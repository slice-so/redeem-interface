export type Purchase = {
  slicerId: string
  productId: string
  totalQuantity: string
}

export const getPurchases = async (buyer: string) => {
  const client = (await import("@utils/apollo-client")).default
  const { gql } = await import("@apollo/client")

  const tokensQuery = /* GraphQL */ `
    payee (id: "${buyer.toLowerCase()}") {
      purchases {
        id
        totalQuantity
      }
    }`

  const { data } = await client.query({
    query: gql`
      query {
        ${tokensQuery}
      }
    `,
    fetchPolicy: "no-cache"
  })
  const payeePurchases = data?.payee?.purchases
  let purchasesList: Purchase[] = []

  payeePurchases?.map((p) => {
    const id = p.id.split("-")
    const slicerId = parseInt(id[0], 16).toString()
    const productId = parseInt(id[1], 16).toString()

    purchasesList.push({
      slicerId,
      productId,
      totalQuantity: p.totalQuantity
    })
  })

  return purchasesList
}
