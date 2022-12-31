import type { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import { prisma } from "@lib/prisma"
import fetcher from "@utils/fetcher"
import { clientId } from "@components/ui/CreateFormPrintful/CreateFormPrintful"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)

  try {
    if (req.method === "GET") {
      const { account } = req.query

      const data = await prisma.user.findUnique({
        where: {
          id: String(account)
        },
        select: {
          accounts: true
        }
      })

      res.status(200).json(data)
    }
    if (req.method === "POST") {
      const { code, account } = JSON.parse(req.body)

      const endpoint = "https://www.printful.com/oauth/token"
      const body = {
        body: JSON.stringify({
          grant_type: "authorization_code",
          client_id: clientId,
          client_secret: process.env.PRINTFUL_SECRET,
          code
        }),
        method: "POST"
      }

      const accessData = await fetcher(endpoint, body)

      let data = undefined
      if (!accessData?.error) {
        const { access_token, expires_at, token_type, refresh_token } =
          accessData

        // Get stores data
        const storesData: {
          result: { id: number; name: string; type: string }[]
        } = await fetcher("https://api.printful.com/stores", {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        })

        const upsertData = storesData.result?.map((store) => ({
          where: { id: String(store.id) },
          create: {
            id: "printful" + store.id,
            provider: "printful",
            type: store.type,
            providerAccountId: store.name,
            access_token,
            refresh_token,
            expires_at,
            token_type
          },
          update: {
            access_token,
            refresh_token,
            expires_at,
            token_type
          }
        }))

        // Check if user exists
        const user = await prisma.user.findUnique({
          where: {
            id: String(account)
          }
        })

        // If user doesn't exist, create it
        if (!user) {
          await prisma.user.create({
            data: {
              id: String(account)
            }
          })
        }

        // Upsert accounts
        data = await prisma.user.update({
          where: {
            id: String(account)
          },
          data: {
            accounts: {
              upsert: upsertData
            }
          },
          select: {
            accounts: true
          }
        })
      }

      res.status(200).json(data)
    }
  } catch (err) {
    console.log(err)

    res.status(500).send(err.message)
  }
}

export default handler
