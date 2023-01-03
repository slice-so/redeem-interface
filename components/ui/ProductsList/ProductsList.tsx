import { useAppContext } from "../context"
import usePrismaQuery from "@utils/prismaQuery"
import Spinner from "@components/icons/Spinner"
import { Button, MySwitch, ProductsListElement } from "@components/ui"
import { useState } from "react"
import { ProductFormSubmissions } from "../ProductsListElement/ProductsListElement"
import Link from "next/link"

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
    sortedData.length != 0 ? (
      <>
        <div className="flex justify-end text-sm">
          <div>
            <p className="pb-3 font-medium text-center text-gray-400">
              Order by
            </p>
            <div className="flex items-center space-x-3">
              <p>Last created</p>
              <MySwitch enabled={sortById} setEnabled={setSortById} />
              <p>ID</p>
            </div>
          </div>
        </div>
        <p className="mt-12 text-xs font-medium text-left text-gray-400 uppercase">
          Slicer ID / Product ID
        </p>
        <hr className="px-4 mx-auto mt-1 mb-6 border-gray-300 max-w-screen-xs" />
        {[...Array(data?.length)].map((key, i) => (
          <div key={i}>
            <ProductsListElement product={data[i]} />
            <hr className="px-4 mx-auto my-6 border-gray-300 max-w-screen-xs" />
          </div>
        ))}
        <Link href="/create">
          <a className="text-sm highlight">Create new form</a>
        </Link>
      </>
    ) : (
      <>
        <p className="pb-8 text-lg">You haven&apos;t created a form yet</p>
        <Button label="Create form" href="/create" />
      </>
    )
  ) : (
    <div className="flex justify-center">
      <Spinner size="w-10 h-10" />
    </div>
  )
}

export default ProductsList
