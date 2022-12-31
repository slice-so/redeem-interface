import type { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import { prisma } from "@lib/prisma"
import { encryptTexts } from "@utils/crypto"
import fetcher from "@utils/fetcher"
import getRefreshedAccessToken from "@utils/getRefreshedAccessToken"
import { LinkedProducts } from "@components/ui/HomeRedeem/HomeRedeem"
import { Prisma } from "@prisma/client"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)

  if (req.method === "POST") {
    try {
      const { formId, buyer, redeemedUnits, answers, selectedProduct } =
        JSON.parse(req.body)
      let orderId: number
      let orderProvider: string

      const encryptedAnswers = await encryptTexts(
        formId,
        redeemedUnits,
        answers
      )

      const { linkedProducts, externalSettings } =
        (await prisma.form.findUnique({
          where: {
            id: Number(formId)
          },
          select: {
            linkedProducts: true,
            externalSettings: true
          }
        })) as {
          linkedProducts: LinkedProducts
          externalSettings: Prisma.JsonValue
        }

      if (selectedProduct) {
        const endpoint = `https://api.printful.com/orders?confirm=${
          externalSettings["instantOrder"] || false
        }`
        console.log(endpoint)

        const { accountId, variants } = linkedProducts[0] // Only allowing to link one product at a time, for now

        if (!variants.find((v) => v.external_id == selectedProduct)) {
          throw Error("Invalid product")
        }

        const { access_token } = await getRefreshedAccessToken(
          String(accountId)
        )

        const body = {
          body: JSON.stringify({
            recipient: {
              name: answers["Receiver name"],
              address1: answers["Delivery address"],
              city: answers["City"],
              state_code: answers["State"],
              country_code: answers["Country"],
              zip: answers["Postal code"],
              email: answers["Email"]
            },
            items: [
              {
                external_variant_id: selectedProduct,
                quantity: redeemedUnits
              }
            ]
          }),
          headers: { Authorization: `Bearer ${access_token}` },
          method: "POST"
        }

        const order = await fetcher(endpoint, body)
        orderProvider = "Printful"
        orderId = order.result.id

        if (!orderId) throw Error(order.error.message)
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
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}

export default handler
