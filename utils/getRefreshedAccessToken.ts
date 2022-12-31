import { clientId } from "@components/ui/CreateFormPrintful/CreateFormPrintful"
import getAccessToken from "./getAccessToken"
import updateAccessToken from "./updateAccessToken"

const getRefreshedAccessToken = async (accountId: string) => {
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
  return { access_token }
}

export default getRefreshedAccessToken
