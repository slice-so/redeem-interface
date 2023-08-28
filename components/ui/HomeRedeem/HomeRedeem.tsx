import { useAppContext } from "../context"
import useSWR from "swr"
import fetcher from "@utils/fetcher"
import { ProductData } from "@utils/useProductData"
import Spinner from "@components/icons/Spinner"
import { useState } from "react"
import SelectRedeems from "../SelectRedeems/SelectRedeems"
import { Purchase } from "@utils/getPurchases"
import { Submission } from "@prisma/client"

export type ProductDataExpanded = {
  product: ProductData
  purchase: Purchase
  submissionsForProduct: Submission[]
  quantityToRedeem: number
}

export type RedeemData = {
  [slicerId: string]: ProductDataExpanded[]
}

const HomeRedeem = () => {
  const { account } = useAppContext()

  const { data } = useSWR(account ? `/api/products/${account}` : null, fetcher)
  const productData = data as RedeemData

  const [selectedProducts, setSelectedProducts] = useState({})
  const [isFormView, setIsFormView] = useState(false)

  return data ? (
    <>
      {!isFormView ? (
        <SelectRedeems
          productData={productData}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
          setIsFormView={setIsFormView}
        />
      ) : (
        <div>FORM</div>
      )}
    </>
  ) : (
    <div className="flex justify-center">
      <Spinner className="w-16 h-16 text-random2-600" />
    </div>
  )
}

export default HomeRedeem
