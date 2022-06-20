import type { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import { prisma } from "@lib/prisma"
import { encryptText, generateKey } from "@utils/crypto"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)

  if (req.method === "POST") {
    try {
      const { productFormId, buyer, redeemedUnits, answers } = JSON.parse(
        req.body
      )

      const key = await generateKey()
      let encryptedAnswers = []

      for (let i = 0; i < answers.length; i++) {
        encryptedAnswers.push(
          await encryptText(key, productFormId, redeemedUnits, answers[i])
        )
      }

      const data = await prisma.submission.create({
        data: {
          productFormId: Number(productFormId),
          buyer,
          redeemedUnits: Number(redeemedUnits),
          answers: encryptedAnswers
        }
      })

      res.status(200).json({ data })
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
}

export default handler
