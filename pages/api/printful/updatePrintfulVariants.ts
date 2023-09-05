import type { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import getPrintfulVariants from "@utils/getPrintfulVariants"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)

  try {
    if (req.method === "GET") {
      /**
       * @notice Job is called every 12 hours, check vercel.json
       */
      getPrintfulVariants()

      res.status(200).json({ message: "Job started" })
    }
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export default handler
