import { NextApiRequest } from "next"
import { getToken } from "next-auth/jwt"

const secret = process.env.NEXTAUTH_SECRET

export async function isUserAuthenticated(
  req: NextApiRequest,
  account: string
) {
  const token = await getToken({ req, secret })
  const address = token?.sub ?? null

  return address === account
}
