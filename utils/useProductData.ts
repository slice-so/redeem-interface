import { supabase } from "@lib/supabase"
import { useEffect, useState } from "react"

type Props = {
  slicerId: number
  productId: number
  totalQuantity?: number
}

type ProductData = {
  product_id: number
  Slicer: { id: number; name: string; image: string }
  image: string
  name: string
  shortDescription: string
}

export const getProductsQuery = async (purchases: Props[]) => {
  const orConditions = purchases
    .map(
      ({ slicerId, productId }) =>
        `and(slicer_id.eq.${slicerId},product_id.eq.${productId})`
    )
    .join(",")

  const { data, error } = await supabase
    .from("Product")
    .select()
    .select("name,product_id,image,shortDescription,Slicer(id,name,image)")
    .or(orConditions)

  if (error) {
    throw error
  }

  return data as ProductData[]
}

const getProducts = async (purchases: Props[], setData) => {
  setData(await getProductsQuery(purchases))
}

export const useProduct = (slicerId: number, productId: number) => {
  const [data, setData] = useState(null)

  useEffect(() => {
    if (slicerId && productId) {
      getProducts([{ slicerId, productId }], setData)
    }
  }, [slicerId, productId])

  return { data }
}
