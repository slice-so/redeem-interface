import { supabase } from "@lib/supabase"
import { useEffect, useState } from "react"

type Props = {
  slicerId: number
  productId: number
}

export const useProductData = (purchases: Props[]) => {
  const [productData, setProductData] = useState(null)

  const getProduct = async (purchases: Props[]) => {
    const orConditions = purchases
      .map(
        (pair) =>
          `slicer_id.eq.${pair.slicerId},product_id.eq.${pair.productId}`
      )
      .join("|")

    const { data, error } = await supabase
      .from("Product")
      .select()
      .or(orConditions)
      .select("name,image,shortDescription,Slicer(id,name)")

    if (error) console.log(error)
    console.log(data)
    // setProductData(data)
  }

  useEffect(() => {
    getProduct(purchases)
  }, [])

  return productData
}
