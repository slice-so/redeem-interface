import { prisma } from "@lib/prisma"

const getAccessToken = async (accountId: string) => {
  const { access_token, refresh_token, expires_at, token_type } =
    await prisma.account.findUnique({
      where: {
        id: accountId
      },
      select: {
        access_token: true,
        refresh_token: true,
        expires_at: true,
        token_type: true
      }
    })

  return { access_token, refresh_token, expires_at, token_type }
}

export default getAccessToken
