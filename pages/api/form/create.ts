import type { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import { prisma } from "@lib/prisma"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)

  if (req.method === "POST") {
    try {
      const { slicerId, productId, creator, questions, linkedProducts } =
        JSON.parse(req.body)
      let data

      const product = await prisma.form.findFirst({
        where: {
          AND: [
            { slicerId: Number(slicerId) },
            { productId: Number(productId) }
          ]
        }
      })

      if (product) {
        data = await prisma.form.update({
          where: {
            id: product.id
          },
          data: {
            slicerId: Number(slicerId),
            productId: Number(productId),
            creator,
            questions,
            linkedProducts
          }
        })
      } else {
        data = await prisma.form.create({
          data: {
            slicerId: Number(slicerId),
            productId: Number(productId),
            creator,
            questions,
            linkedProducts
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
