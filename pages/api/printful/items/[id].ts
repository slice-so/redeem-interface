import type { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import fetcher from "@utils/fetcher"
import getRefreshedAccessToken from "@utils/getRefreshedAccessToken"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)

  try {
    if (req.method === "GET") {
      let { id, accountId } = req.query

      const { access_token } = await getRefreshedAccessToken(String(accountId))

      const endpoint = "https://api.printful.com/store/products/" + String(id)
      const data = await fetcher(endpoint, {
        headers: { Authorization: `Bearer ${access_token}` }
      })

      res.status(200).json(data.result.sync_variants)
    }

    // if (req.method === "POST") {
    //   res.status(200).json(data)
    // }
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export default handler
