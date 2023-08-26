import type { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import { prisma } from "@lib/prisma"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)

  if (req.method === "POST") {
    try {
      const {
        slicerId,
        productId,
        creator,
        questions,
        linkedProducts,
        externalSettings
      } = JSON.parse(req.body)
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
            linkedProducts,
            externalSettings
          }
        })
      } else {
        // Check if user exists
        const user = await prisma.user.findUnique({
          where: {
            id: String(creator)
          }
        })
        // If user doesn't exist, create it
        if (!user) {
          await prisma.user.create({
            data: {
              id: String(creator)
            }
          })
        }

        data = await prisma.form.create({
          data: {
            slicerId: Number(slicerId),
            productId: Number(productId),
            creator,
            questions,
            linkedProducts,
            externalSettings
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
