import type { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import { prisma } from "@lib/prisma"
import { encryptTexts } from "@utils/crypto"
import fetcher from "@utils/fetcher"
import getRefreshedAccessToken from "@utils/getRefreshedAccessToken"
import { LinkedProducts } from "@components/ui/HomeRedeem/HomeRedeem_old"
import { Prisma } from "@prisma/client"
import { isUserAuthenticated } from "@utils/isUserAuthenticated"

const appUrl = process.env.NEXT_PUBLIC_APP_URL

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)

  if (req.method === "POST") {
    const { account, answers } = JSON.parse(req.body)
    try {
      const isAuth = await isUserAuthenticated(req, account)

      console.log({ account, isAuth })

      if (!isAuth) return res.status(401).json({ error: "Unauthorized" })

      // const productsToRedeem = await fetcher(
      //   `${appUrl}/api/products/${account}`
      // )

      // input validations

      // For each product
      // - submission

      // For each store
      // - a printful order

      // const { formId, buyer, redeemedUnits, answers, selectedProduct } =
      //   JSON.parse(req.body)
      // let orderId: number
      // let orderProvider: string

      // const encryptedAnswers = await encryptTexts(
      //   formId,
      //   redeemedUnits,
      //   answers
      // )

      // const { linkedProducts, externalSettings } =
      //   (await prisma.form.findUnique({
      //     where: {
      //       id: Number(formId)
      //     },
      //     select: {
      //       linkedProducts: true,
      //       externalSettings: true
      //     }
      //   })) as {
      //     linkedProducts: LinkedProducts
      //     externalSettings: Prisma.JsonValue
      //   }

      // if (selectedProduct) {
      //   const endpoint = `https://api.printful.com/orders?confirm=${
      //     externalSettings["instantOrder"] || false
      //   }`

      //   const { accountId } = linkedProducts?.find(
      //     (product) =>
      //       product.variants.findIndex(
      //         (variant) => variant.external_id == selectedProduct
      //       ) != -1
      //   )

      //   if (!accountId) {
      //     throw Error("Invalid product")
      //   }

      //   const { access_token } = await getRefreshedAccessToken(
      //     String(accountId)
      //   )

      //   const body = {
      //     body: JSON.stringify({
      //       recipient: {
      //         name: answers["Full name"],
      //         address1: answers["Address"],
      //         city: answers["City"],
      //         state_code: answers["State"],
      //         country_code: answers["Country"],
      //         zip: answers["Postal code"],
      //         email: answers["Email"]
      //       },
      //       items: [
      //         {
      //           external_variant_id: selectedProduct,
      //           quantity: redeemedUnits
      //         }
      //       ]
      //     }),
      //     headers: { Authorization: `Bearer ${access_token}` },
      //     method: "POST"
      //   }

      //   const order = await fetcher(endpoint, body)
      //   orderProvider = "Printful"
      //   orderId = order.result.id

      //   if (!orderId) throw Error(order.error.message)
      // }

      // // Create user if it doesn't exist
      // await prisma.user.upsert({
      //   where: {
      //     id: buyer
      //   },
      //   update: {},
      //   create: {
      //     id: buyer
      //   }
      // })

      // const data = await prisma.submission.create({
      //   data: {
      //     formId: Number(formId),
      //     buyer,
      //     redeemedUnits: Number(redeemedUnits),
      //     answers: encryptedAnswers,
      //     orderId: orderId || null,
      //     orderProvider: orderProvider || null
      //   }
      // })

      // res.status(200).json({ data })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}

export default handler
