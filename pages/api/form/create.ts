import type { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import { prisma } from "@lib/prisma"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)

  if (req.method === "POST") {
    try {
      const { slicerId, productId, creator, questions } = JSON.parse(req.body)
      let data

      const product = await prisma.productForm.findFirst({
        where: {
          AND: [
            { slicerId: Number(slicerId) },
            { productId: Number(productId) }
          ]
        }
      })

      if (product) {
        data = await prisma.productForm.update({
          where: {
            id: product.id
          },
          data: {
            slicerId: Number(slicerId),
            productId: Number(productId),
            creator,
            questions
          }
        })
      } else {
        data = await prisma.productForm.create({
          data: {
            slicerId: Number(slicerId),
            productId: Number(productId),
            creator,
            questions
          }
        })
      }

      res.status(200).json({ data })
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
}

export default handler
