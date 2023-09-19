import type { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)

  try {
    if (req.method === "POST") {
      const { hmac, host, shop, timestamp } = JSON.parse(req.body)
      const message = `shop=${shop}&timestamp=${timestamp}`
      const generatedHash = Buffer.from(message, "utf8").toString("base64")
      const hashEquals = generatedHash === hmac

      if (!hashEquals) {
        throw new Error("HMAC validation failed")
      }

      res.status(200).json({ message: "Success" })
    }
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export default handler
