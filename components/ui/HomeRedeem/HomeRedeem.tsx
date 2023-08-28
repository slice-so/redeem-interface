import { useAppContext } from "../context"
import useSWR from "swr"
import fetcher from "@utils/fetcher"
import { ProductData } from "@utils/useProductData"
import Spinner from "@components/icons/Spinner"
import SlicerProducts from "../SlicerProducts"
import { useState } from "react"
import DoubleText from "../DoubleText"
import Button from "../Button"

export type ProductDataExpanded = ProductData & {
  quantityToRedeem: number
}

type Data = {
  [slicerId: string]: ProductDataExpanded[]
}

const HomeRedeem = () => {
  const { account } = useAppContext()

  const { data } = useSWR(account ? `/api/products/${account}` : null, fetcher)
  const productData = data as Data

  const [selectedProducts, setSelectedProducts] = useState({})

  return data ? (
    <div className="space-y-16">
      <div>
        <h1 className="pb-8">
          <DoubleText
            inactive
            size="text-3xl sm:text-4xl"
            logoText="Products to redeem"
          />
        </h1>
        <p>Select the products to redeem</p>
      </div>
      <ul className="space-y-12">
        {Object.entries(productData).map(([slicerId, val]) => {
          return (
            <SlicerProducts
              key={slicerId}
              slicerId={Number(slicerId)}
              products={val}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
            />
          )
        })}
      </ul>
      <Button label="Redeem products" />
    </div>
  ) : (
    <div className="flex justify-center">
      <Spinner className="w-16 h-16 text-random2-600" />
    </div>
  )
}

export default HomeRedeem
