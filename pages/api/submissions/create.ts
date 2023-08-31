import type { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import { encryptTexts } from "@utils/crypto"
import fetcher from "@utils/fetcher"
import getRefreshedAccessToken from "@utils/getRefreshedAccessToken"
import { isUserAuthenticated } from "@utils/isUserAuthenticated"
import { Answers } from "@components/ui/RedeemForm/RedeemForm"
import { prisma } from "@lib/prisma"

const appUrl = process.env.NEXT_PUBLIC_APP_URL

type Body = {
  account: string
  answers: Answers
}

type PrintfulOrders = {
  [id: string]: {
    products: {
      productId: number
      slicerId: number
      variants: { quantity: number; variantId: number }[]
      isInstantOrder: boolean
    }[]
    success: boolean
    error: string
    orderId: number
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)

  if (req.method === "POST") {
    try {
      const { account, answers } = JSON.parse(req.body) as Body

      const isAuth = await isUserAuthenticated(req, account)
      if (!isAuth) return res.status(401).json({ error: "Unauthorized" })

      const productsToRedeem = await fetcher(
        `${appUrl}/api/products/${account}`
      )

      let allProductRedeemed = true
      const printfulOrders = {} as PrintfulOrders
      const submissions = []
      const answersEntries = Object.entries(answers)
      const totalToRedeem = answersEntries.length - 1

      // check the user can redeem selected products and the quantities are correct
      answersEntries.forEach(([id, answer]) => {
        if (id === "deliveryInfo") return

        const slicerId = Number(id.split("-")[0])
        const productId = Number(id.split("-")[1])

        const productInfo = productsToRedeem[slicerId]?.find(
          (info) =>
            info?.product?.product_id === productId &&
            info?.product?.Slicer.id === slicerId
        )

        if (!productInfo) {
          throw Error("Invalid product")
        }

        const { quantityToRedeem } = productInfo
        const choosenVariants = answer.choosenVariants as unknown as {
          quantity: number
          variantId: number
        }[]

        const quantityRedeemed = choosenVariants.reduce(
          (acc, curr) => acc + curr.quantity,
          0
        )

        if (quantityRedeemed > quantityToRedeem) {
          throw Error("Invalid quantity")
        }

        const { linkedProducts, externalSettings } = productInfo.form
        const isPrintful = linkedProducts.some((linkedProduct) =>
          linkedProduct.accountId.includes("printful")
        )

        if (isPrintful) {
          let cleanedVariants = []
          // clean variants and check they are allowed
          choosenVariants?.forEach((variant) => {
            if (variant.quantity > 0) {
              cleanedVariants.push(variant)
            }

            const isVariantAllowed = linkedProducts?.find(
              (product) =>
                product.variants.findIndex(
                  (v) => v.external_id == variant.variantId
                ) != -1
            )

            if (!isVariantAllowed) {
              throw Error("Invalid variant")
            }
          })

          const storeId = linkedProducts[0].accountId.split("printful")[1]
          const isInstantOrder = !!externalSettings["instantOrder"] || false
          const key = `${storeId}-${isInstantOrder}`
          printfulOrders[key] = printfulOrders[key] || {
            products: [],
            success: false,
            error: "",
            orderId: null
          }

          printfulOrders[key].products.push({
            productId,
            slicerId,
            variants: cleanedVariants || [],
            isInstantOrder
          })
        }
      })

      // For each store and instantOrder combination create a printful order
      for (const [key, value] of Object.entries(printfulOrders)) {
        const [storeId, isInstantOrder] = key.split("-")
        const { products } = value
        const endpoint = `https://api.printful.com/orders?confirm=${isInstantOrder}`

        const { access_token } = await getRefreshedAccessToken(
          `printful${storeId}`
        )

        // array of items
        let items = []
        products.forEach((product) => {
          const { variants } = product

          variants.forEach((variant) => {
            items.push({
              external_variant_id: variant.variantId,
              quantity: variant.quantity
            })
          })
        })

        const body = {
          body: JSON.stringify({
            recipient: {
              name: answers.deliveryInfo["Full name"],
              address1: answers.deliveryInfo["Address"],
              city: answers.deliveryInfo["City"],
              state_code: answers.deliveryInfo["State"],
              country_code: answers.deliveryInfo["Country"],
              zip: answers.deliveryInfo["Postal code"],
              email: answers.deliveryInfo["Email"]
            },
            items
          }),
          headers: { Authorization: `Bearer ${access_token}` },
          method: "POST"
        }

        const order = await fetcher(endpoint, body)
        printfulOrders[key].success = order.code === 200
        printfulOrders[key].orderId = order.result.id

        if (order.code !== 200) {
          allProductRedeemed = allProductRedeemed && false
          printfulOrders[key].error = order.error.message

          if (order.error.message.includes("ZIP code")) {
            throw Error(order.error.message)
          }
        }
      }

      // create submissions only for product correctly redeemed
      for (const [id, value] of answersEntries) {
        if (id === "deliveryInfo") continue

        const choosenVariants = value.choosenVariants as unknown as {
          quantity: number
          variantId: number
        }[]

        const quantityRedeemed = choosenVariants.reduce(
          (acc, curr) => acc + curr.quantity,
          0
        )

        if (quantityRedeemed === 0) continue

        const slicerId = Number(id.split("-")[0])
        const productId = Number(id.split("-")[1])
        let orderId: number
        let orderProvider: string

        const productInfo = productsToRedeem[slicerId]?.find(
          (info) =>
            info?.product?.product_id === productId &&
            info?.product?.Slicer.id === slicerId
        )

        const {
          linkedProducts,
          id: formId,
          questions,
          externalSettings
        } = productInfo.form

        const isPrintful = linkedProducts.some((linkedProduct) =>
          linkedProduct.accountId.includes("printful")
        )

        if (isPrintful) {
          const storeId = linkedProducts[0].accountId.split("printful")[1]
          const isInstantOrder = !!externalSettings["instantOrder"] || false
          const key = `${storeId}-${isInstantOrder}`
          orderId = printfulOrders[key].orderId

          if (!printfulOrders[key].success) {
            continue
          } else {
            orderId = printfulOrders[key].orderId
            orderProvider = "printful"
          }
        }

        const formattedQuestions = {}
        questions.forEach((question: { question: string }, index) => {
          formattedQuestions[question.question] = value.questionAnswers[index]
        })

        Object.entries(answers.deliveryInfo).forEach(([key, value]) => {
          formattedQuestions[key] = value
        })

        const encryptedAnswers = await encryptTexts(
          formId,
          String(quantityRedeemed),
          formattedQuestions
        )

        // Create user if it doesn't exist
        await prisma.user.upsert({
          where: {
            id: account
          },
          update: {},
          create: {
            id: account
          }
        })

        const data = await prisma.submission.create({
          data: {
            formId: Number(formId),
            buyer: account,
            redeemedUnits: Number(quantityRedeemed),
            answers: encryptedAnswers,
            orderId: orderId || null,
            orderProvider: orderProvider || null
          }
        })
        submissions.push(data)
      }

      if (submissions.length == 0) {
        throw Error("Error during redemption")
      }

      res.status(200).json({ submissions, totalToRedeem })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}

export default handler
