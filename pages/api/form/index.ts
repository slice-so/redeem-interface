import type { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import { prisma } from "@lib/prisma"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)

  if (req.method === "GET") {
    try {
      const { slicerId, productId } = req.query

      const product = await prisma.productForm.findFirst({
        where: {
          AND: [
            { slicerId: Number(slicerId) },
            { productId: Number(productId) }
          ]
        }
      })

      res.status(200).json({ data: product })
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
}

export default handler
