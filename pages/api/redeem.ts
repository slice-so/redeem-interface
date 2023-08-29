import type { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import { prisma } from "@lib/prisma"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)

  try {
    if (req.method === "GET") {
      const { slicerId, productId } = JSON.parse(req.body)
      const data = await prisma.form.findFirst({
        where: {
          AND: [
            { slicerId: { equals: Number(slicerId) } },
            { productId: { equals: Number(productId) } }
          ]
        },
        select: {
          id: true,
          questions: true,
          linkedProducts: true
        }
      })

      res.status(200).json({ data })
    }
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export default handler
