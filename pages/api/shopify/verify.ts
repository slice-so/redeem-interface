import type { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import crypto from "crypto"

function generateHMAC(data: string, key: string) {
  const hmac = crypto.createHmac("sha256", key)
  hmac.update(data)
  return hmac.digest("hex")
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)

  try {
    if (req.method === "POST") {
      const { hmac, host, shop, timestamp } = JSON.parse(req.body)
      const message = `host=${host}&shop=${shop}&timestamp=${timestamp}`
      const secretKey = process.env.SHOPIFY_CLIENT_SECRET
      const signature = generateHMAC(message, secretKey)

      const hashEquals = crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(hmac)
      )

      if (!hashEquals) {
        throw new Error("HMAC validation failed")
      }

      res.status(200).json({ status: "verified" })
    }
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export default handler
