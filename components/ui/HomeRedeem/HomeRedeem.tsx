import { useAppContext } from "../context"
import fetcher from "@utils/fetcher"
import { ProductData } from "@utils/useProductData"
import Spinner from "@components/icons/Spinner"
import { useState } from "react"
import SelectRedeems from "../SelectRedeems/SelectRedeems"
import { Purchase } from "@utils/getPurchases"
import { Form } from "@prisma/client"
import RedeemForm from "../RedeemForm"
import { getSliceSubdomain } from "@utils/getSliceSubdomain"
import Button from "../Button"
import { useRouter } from "next/router"
import useSWR from "swr"

export type ProductDataExpanded = {
  product: ProductData
  form: Form
  purchase: Purchase
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
  const router = useRouter()

  const { data } = useSWR(account ? `/api/products/${account}` : null, fetcher)
  const productData = data as RedeemData

  const [selectedProducts, setSelectedProducts] = useState<SelectedProducts>({})
  const [isFormView, setIsFormView] = useState(false)
  const [success, setSuccess] = useState(false)

  return data ? (
    <>
      {!success ? (
        !isFormView ? (
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
            setSuccess={setSuccess}
          />
        )
      ) : (
        <div>
          <h2 className="text-2xl">Products redeemed successfully!</h2>
          <div className="py-8">
            <Button
              label="Go back to Slice"
              href={`https://${getSliceSubdomain()}slice.so/slicer`}
            />
          </div>

          <a className="highlight" onClick={() => router.reload()}>
            Redeem more products
          </a>
        </div>
      )}
    </>
  ) : (
    <div className="flex justify-center">
      <Spinner className="w-16 h-16 text-random2-600" />
    </div>
  )
}

export default HomeRedeem
