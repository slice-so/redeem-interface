import type { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import { prisma } from "@lib/prisma"
import { encryptTexts } from "@utils/crypto"
import fetcher from "@utils/fetcher"
import getRefreshedAccessToken from "@utils/getRefreshedAccessToken"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)

  if (req.method === "POST") {
    try {
      const { formId, buyer, redeemedUnits, answers, variants } = JSON.parse(
        req.body
      )
      let orderId: number
      let orderProvider: string

      const encryptedAnswers = await encryptTexts(
        formId,
        redeemedUnits,
        answers
      )

      const { linkedProducts } = await prisma.form.findUnique({
        where: {
          id: Number(formId)
        },
        select: {
          linkedProducts: true
        }
      })

      if (linkedProducts) {
        const endpoint = "https://api.printful.com/orders"

        for (let i = 0; i < Object.entries(linkedProducts).length; i++) {
          // TODO: Should we assume linkedProducts to only be of length 1? Handle it here or elsewhere? Each product should be linked with product from a single store
          const [accountId, variants] = Object.entries(linkedProducts)[i]

          const { access_token } = await getRefreshedAccessToken(
            String(accountId)
          )

          const body = {
            body: JSON.stringify({
              recipient: {
                name: "John Doe",
                address1: "19749 Dearborn St",
                city: "Chatsworth",
                state_code: "CA",
                country_code: "US",
                zip: "91311"
              },
              items: variants.map((variant) => ({
                external_variant_id: variant.external_id,
                quantity: redeemedUnits
              }))
            }),
            headers: { Authorization: `Bearer ${access_token}` },
            method: "POST"
          }

          const order = await fetcher(endpoint, body)
          orderId = order.result.id
          orderProvider = "Printful"
        }
      }

      const data = await prisma.submission.create({
        data: {
          formId: Number(formId),
          buyer,
          redeemedUnits: Number(redeemedUnits),
          answers: encryptedAnswers,
          orderId: orderId || null,
          orderProvider: orderProvider || null
        }
      })

      res.status(200).json({ data })
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
}

export default handler
