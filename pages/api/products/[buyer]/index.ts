import type { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import { prisma } from "@lib/prisma"
import { getPurchases } from "@utils/getPurchases"
import { getProductsQuery } from "@utils/useProductData"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)

  if (req.method === "GET") {
    try {
      const { buyer } = req.query
      const buyerAddress = buyer as string

      const purchases = await getPurchases(buyerAddress)

      const products = await getProductsQuery(
        purchases.map((p) => ({
          slicerId: Number(p.slicerId),
          productId: Number(p.productId)
        }))
      )

      const forms = await prisma.form.findMany({
        where: {
          OR: products.map(({ Slicer: { id: slicerId }, product_id }) => ({
            slicerId,
            productId: product_id
          }))
        }
      })

      const submissions = await prisma.submission.findMany({
        where: {
          OR: forms.map(({ id: formId }) => ({
            formId,
            buyer: buyerAddress
          }))
        }
      })

      const productsToRedeem = forms.flatMap((form) => {
        const product = products.find(
          (product) =>
            product.Slicer.id === form.slicerId &&
            product.product_id === form.productId
        )

        const slicerId = product.Slicer.id
        const productId = product.product_id

        const purchase = purchases.find(
          (purchase) =>
            Number(purchase.slicerId) === slicerId &&
            Number(purchase.productId) === productId
        )

        const submissionsForProduct = submissions.filter(
          (submission) => submission.formId === form.id
        )

        const quantityRedeemed = submissionsForProduct.reduce(
          (acc, curr) => acc + curr.redeemedUnits,
          0
        )

        const quantityToRedeem =
          Number(purchase.totalQuantity) - quantityRedeemed

        if (quantityToRedeem == 0) return []

        return {
          ...product,
          quantityToRedeem
        }
      })

      res.status(200).json({ data: productsToRedeem })
    } catch (err) {
      console.log(err)

      res.status(500).send(err.message)
    }
  }
}

export default handler
