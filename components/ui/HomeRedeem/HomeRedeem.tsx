import { useAppContext } from "../context"
import fetcher from "@utils/fetcher"
import { ProductData } from "@utils/useProductData"
import Spinner from "@components/icons/Spinner"
import { useEffect, useState } from "react"
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
  const { slicerId, productId } = router.query

  const { data } = useSWR(account ? `/api/products/${account}` : null, fetcher)
  let productData = data as RedeemData

  const [selectedProducts, setSelectedProducts] = useState<SelectedProducts>({})
  const [isFormView, setIsFormView] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const preloadSelectedProducts = () => {
    const slicerIds = []
    const productIds = []
    if (typeof slicerId == "string") {
      slicerIds.push(slicerId)
    } else {
      slicerIds.push(...slicerId)
    }
    if (typeof productId == "string") {
      productIds.push(productId)
    } else {
      productIds.push(...productId)
    }

    if (slicerIds.length != productIds.length || slicerIds.length == 0) return

    const newSelectedProducts = {}
    let productRedeemed = 0
    slicerIds.forEach((slicerId, index) => {
      const productId = productIds[index]
      const products = productData[slicerId]
      const quantityToRedeem = products?.find(
        (product) => product.product.product_id == Number(productId)
      )?.quantityToRedeem

      if (quantityToRedeem) {
        productRedeemed++
        newSelectedProducts[`${slicerId}-${productId}`] = quantityToRedeem
      }
    })

    if (Object.keys(newSelectedProducts).length == 0) return

    const totalProductsToRedeem = Object.values(productData).flatMap(
      (products) => products.map((product) => product.product.product_id)
    ).length

    setSelectedProducts(newSelectedProducts)

    if (productRedeemed == totalProductsToRedeem) {
      setIsFormView(true)
    }
  }

  useEffect(() => {
    if (
      Object.keys(selectedProducts).length == 0 &&
      slicerId &&
      productId &&
      data
    ) {
      preloadSelectedProducts()
    }
  }, [slicerId, productId, data])

  return productData ? (
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
            error={error}
            setError={setError}
          />
        )
      ) : (
        <div>
          <h2 className="text-2xl">Products redeemed successfully!</h2>
          <div className="py-8">
            <Button
              label="Go to Slice"
              href={`https://${getSliceSubdomain()}slice.so/slicer`}
            />
          </div>
          {error && (
            <p className="pb-6 text-sm font-semibold text-red-500">{error}</p>
          )}

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
