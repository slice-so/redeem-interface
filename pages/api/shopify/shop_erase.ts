import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "POST") {
      res.status(200)
    }
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export default handler
