import { supabase } from "@lib/supabase"
import { useEffect, useState } from "react"

export const useProductData = (slicerId: number, productId: number) => {
  const [productData, setProductData] = useState(null)

  const getProduct = async (slicerId: number, productId: number) => {
    const { data } = await supabase
      .from("Product")
      .select()
      .eq("slicer_id", slicerId)
      .eq("product_id", productId)
      .select("name,image,shortDescription")
    setProductData(data[0])
  }

  useEffect(() => {
    getProduct(slicerId, productId)
  }, [])

  return productData
}
