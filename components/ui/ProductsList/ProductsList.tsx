import { useAppContext } from "../context"
import usePrismaQuery from "@utils/prismaQuery"
import Spinner from "@components/icons/Spinner"
import { MySwitch, ProductsListElement } from "@components/ui"
import { useState } from "react"
import { ProductFormSubmissions } from "../ProductsListElement/ProductsListElement"

const ProductsList = () => {
  const { account } = useAppContext()
  const [sortById, setSortById] = useState(false)

  const data = usePrismaQuery(
    `/api/form/creator?account=${account}`
  ) as ProductFormSubmissions[]

  const sortedData = sortById
    ? data?.sort(
        (a, b) =>
          Number(a.slicerId) - Number(b.slicerId) ||
          Number(a.productId) - Number(b.productId)
      )
    : data?.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))

  return sortedData ? (
    <>
      <div className="flex justify-end">
        <div>
          <p className="pb-3 font-semibold text-center text-yellow-600">
            Order by
          </p>
          <div className="flex space-x-3">
            <p>Last created</p>
            <MySwitch enabled={sortById} setEnabled={setSortById} />
            <p>ID</p>
          </div>
        </div>
      </div>
      <p className="mt-12 text-sm font-semibold text-left text-gray-600 uppercase">
        Slicer ID / Product ID
      </p>
      <hr className="px-4 mx-auto mt-3 mb-6 border-gray-300 max-w-screen-xs" />
      {[...Array(data?.length)].map((key, i) => (
        <div key={i}>
          <ProductsListElement product={data[i]} />
          <hr className="px-4 mx-auto my-6 border-gray-300 max-w-screen-xs" />
        </div>
      ))}
    </>
  ) : (
    <div className="flex justify-center">
      <Spinner size="w-10 h-10" />
    </div>
  )
}

export default ProductsList
