import type { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import crypto from "crypto"
import fetcher from "@utils/fetcher"

function generateHMAC(data: string, key: string) {
  const hmac = crypto.createHmac("sha256", key)
  hmac.update(data)
  return hmac.digest("hex")
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)

  try {
    if (req.method === "POST") {
      const { hmac, host, shop, timestamp, code, state } = JSON.parse(req.body)
      const message = `code=${code}&host=${host}&shop=${shop}&state=${state}&timestamp=${timestamp}`
      const secretKey = process.env.SHOPIFY_CLIENT_SECRET
      const signature = generateHMAC(message, secretKey)

      const hashEquals = crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(hmac)
      )

      if (!hashEquals) {
        throw new Error("HMAC validation failed")
      }

      console.log("hashEquals", hashEquals)

      // get access token
      const client_id = process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID
      const client_secret = process.env.SHOPIFY_CLIENT_SECRET
      const endpoint = `https://${shop}/admin/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}`
      const response = await fetcher(endpoint, {
        method: "POST"
      })
      const accessToken = response?.access_token

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: {
          id: String(state)
        }
      })

      // If user doesn't exist, create it
      if (!user) {
        await prisma.user.create({
          data: {
            id: String(state)
          }
        })
      }

      // Create account
      await prisma.account.create({
        data: {
          userId: state,
          id: "shopify" + shop,
          type: "native",
          provider: "shopify",
          providerAccountId: shop,
          refresh_token: code, // authorization code
          access_token: accessToken
        }
      })

      res.status(200).json({ status: "verified" })
    }
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export default handler
