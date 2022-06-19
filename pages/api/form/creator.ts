import type { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import { prisma } from "@lib/prisma"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)

  if (req.method === "GET") {
    try {
      const { account } = req.query

      const product = await prisma.productForm.findMany({
        where: {
          creator: String(account)
        },
        select: {
          id: true,
          createdAt: true,
          creator: true,
          slicerId: true,
          productId: true,
          questions: true,
          submissions: true
        }
      })

      res.status(200).json({ data: product })
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
}

export default handler
