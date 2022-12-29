import type { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import fetcher from "@utils/fetcher"
import { clientId } from "@components/ui/CreateFormPrintful/CreateFormPrintful"
import updateAccessToken from "@utils/updateAccessToken"
import getAccessToken from "@utils/getAccessToken"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)

  try {
    if (req.method === "GET") {
      let { accountId } = req.query

      let { access_token, refresh_token, expires_at } = await getAccessToken(
        String(accountId)
      )

      // Update access tokens
      if (new Date().getTime() / 1000 > Number(expires_at)) {
        const { access_token: newAccessToken, refresh_token: newRefreshToken } =
          await updateAccessToken(
            String(accountId),
            clientId,
            String(refresh_token)
          )
        access_token = newAccessToken
        refresh_token = newRefreshToken
      }

      const endpoint = "https://api.printful.com/store/products"
      const data = await fetcher(endpoint, {
        headers: { Authorization: `Bearer ${access_token}` }
      })

      res.status(200).json(data.result.sort((a, b) => a.id - b.id))
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
