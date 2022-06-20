import type { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import { prisma } from "@lib/prisma"
import { decryptTexts, generateKey } from "@utils/crypto"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)

  if (req.method === "GET") {
    try {
      const { account } = req.query

      const key = await generateKey()

      const products = await prisma.productForm.findMany({
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

      // Loop over products
      for (let i = 0; i < products.length; i++) {
        const { id, submissions } = products[i] || { submissions: [] }

        // Loop over submissions
        for (let k = 0; k < submissions.length; k++) {
          const answers = submissions[k].answers
          const redeemedUnits = submissions[k].redeemedUnits

          // Loop over answers and decrypt them
          const decryptedAnswers = await decryptTexts(
            key,
            id,
            redeemedUnits,
            answers
          )

          // Substitute decrypted answers to existing ones
          products[i].submissions[k].answers = decryptedAnswers

          // TODO: Improve, don't think this scales well
        }
      }

      res.status(200).json({ data: products })
    } catch (err) {
      res.status(500).json({ data: [] })
      // TODO: Handle case when there are no products better
    }
  }
}

export default handler
