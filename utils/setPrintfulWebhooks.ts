import fetcher from "./fetcher"

export default async function setPrintfulWebhooks(
  access_token: string,
  storeId: number
) {
  await fetcher("https://api.printful.com/webhooks", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      ["X-PF-Store-Id"]: String(storeId)
    },
    body: JSON.stringify({
      url: process.env.NEXT_PUBLIC_APP_URL + "/api/printful/webhook",
      types: ["order_created", "order_updated", "package_shipped"]
    })
  })
}
