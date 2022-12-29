import fetcher from "./fetcher"

const updateAccessToken = async (
  accountId: string,
  clientId: string,
  refresh_token: string
) => {
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
    access_token,
    expires_at,
    token_type,
    refresh_token: newRefreshToken
  } = accessData

  await prisma.account.update({
    where: {
      id: accountId
    },
    data: {
      access_token,
      refresh_token: newRefreshToken,
      expires_at,
      token_type
    }
  })

  return { newAccessToken: access_token, newRefreshToken }
}

export default updateAccessToken
