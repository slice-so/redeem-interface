import type { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import { prisma } from "@lib/prisma"
import fetcher from "@utils/fetcher"
import { clientId } from "@components/ui/CreateFormPrintful/CreateFormPrintful"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)

  try {
    if (req.method === "GET") {
      let { id, access_token, expires_at, refresh_token } = req.query

      // Update access tokens
      if (new Date().getTime() / 1000 > Number(expires_at)) {
        const endpoint = "https://www.printful.com/oauth/token"
        const body = {
          body: JSON.stringify({
            grant_type: "refresh_token",
            client_id: clientId,
            client_secret: process.env.PRINTFUL_SECRET,
            refresh_token
          }),
          method: "POST"
        }

        const accessData = await fetcher(endpoint, body)
        const {
          access_token: newAccessToken,
          expires_at,
          token_type,
          refresh_token: newRefreshToken
        } = accessData

        access_token = newAccessToken
        refresh_token = newRefreshToken

        await prisma.account.update({
          where: {
            id: String(id)
          },
          data: {
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
            expires_at,
            token_type
          }
        })
      }

      const endpoint = "https://api.printful.com/store/products"
      const data = await fetcher(endpoint, {
        headers: { Authorization: `Bearer ${access_token}` }
      })

      res.status(200).json(data)
    }

    // if (req.method === "POST") {
    //   res.status(200).json(data)
    // }
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export default handler

1672276644045
1672252457
