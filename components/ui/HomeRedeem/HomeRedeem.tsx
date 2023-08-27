import { useAppContext } from "../context"
import useSWR from "swr"
import fetcher from "@utils/fetcher"
import { ProductData } from "@utils/useProductData"
import Spinner from "@components/icons/Spinner"

type Data = {
  [slicerId: string]: (ProductData & {
    quantity: number
  })[]
}

const HomeRedeem = () => {
  const { account } = useAppContext()

  const { data } = useSWR(account ? `/api/products/${account}` : null, fetcher)
  const productData = data as Data

  return data ? (
    Object.entries(productData).map(([slicerId, val]) => {
      return (
        <div key={slicerId}>
          <p>{slicerId}</p>
          {val.map((product) => {
            return (
              <div key={product.product_id}>
                <div>{product.name}</div>
                <div>{product.quantity}</div>
              </div>
            )
          })}
        </div>
      )
    })
  ) : (
    <div className="flex justify-center">
      <Spinner className="w-16 h-16 text-random2-600" />
    </div>
  )
}

export default HomeRedeem
