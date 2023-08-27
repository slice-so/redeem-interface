import { Dispatch, SetStateAction } from "react"

export type Purchase = {
  slicerId: string
  productId: string
  totalQuantity: string
}

export const getPurchases = async (
  buyer: string,
  setPurchases: Dispatch<SetStateAction<Purchase[]>>
) => {
  console.log("getPurchase")
  const client = (await import("@utils/apollo-client")).default
  const { gql } = await import("@apollo/client")

  const tokensQuery = /* GraphQL */ `
    payee (id: "${buyer.toLowerCase()}") {
      purchases (orderBy: "lastPurchasedAtTimestamp", orderDirection: "desc") {
        id
        totalQuantity
      }
    }`

  const { data } = await client.query({
    query: gql`
      query {
        ${tokensQuery}
      }
    `
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
  setPurchases(purchasesList)
}
