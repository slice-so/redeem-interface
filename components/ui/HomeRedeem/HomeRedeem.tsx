import { useAppContext } from "../context"
import useSWR from "swr"
import fetcher from "@utils/fetcher"
import { ProductData } from "@utils/useProductData"
import Spinner from "@components/icons/Spinner"
import { useState } from "react"
import SelectRedeems from "../SelectRedeems/SelectRedeems"
import { Purchase } from "@utils/getPurchases"
import { Form, Submission } from "@prisma/client"
import RedeemForm from "../RedeemForm"

export type ProductDataExpanded = {
  product: ProductData
  form: Form
  purchase: Purchase
  submissionsForProduct: Submission[]
  quantityToRedeem: number
}

export type RedeemData = {
  [slicerId: string]: ProductDataExpanded[]
}
export type SelectedProducts = {
  [id: string]: number
}

const HomeRedeem = () => {
  const { account } = useAppContext()

  const { data } = useSWR(account ? `/api/products/${account}` : null, fetcher)
  const productData = data as RedeemData

  const [selectedProducts, setSelectedProducts] = useState<SelectedProducts>({})
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
        <RedeemForm
          productData={productData}
          selectedProducts={selectedProducts}
          setIsFormView={setIsFormView}
        />
      )}
    </>
  ) : (
    <div className="flex justify-center">
      <Spinner className="w-16 h-16 text-random2-600" />
    </div>
  )
}

export default HomeRedeem
