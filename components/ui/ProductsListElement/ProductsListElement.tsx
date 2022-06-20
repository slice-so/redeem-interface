import Link from "next/link"
import { Prisma, ProductForm } from "@prisma/client"
import Chevron from "@components/icons/Chevron"
import { useAppContext } from "../context"

export type ProductFormSubmissions = ProductForm & {
  submissions: Prisma.JsonValue[]
}
type Props = {
  product: ProductFormSubmissions
}

const ProductsListElement = ({ product }: Props) => {
  const { slicerId, productId, questions, submissions } = product || {
    slicerId: undefined,
    productId: undefined,
    questions: [],
    submissions: []
  }
  const { setModalView } = useAppContext()

  return (
    <div className="grid grid-cols-7">
      <div className="col-span-2 font-black text-left">
        <a
          href={`https://slice.so/slicer/${slicerId}?product=${productId}`}
          target="_blank"
          rel="noreferrer"
        >
          #{slicerId}/{productId}
        </a>
      </div>
      <div className="flex items-center col-span-2 text-sm text-left ">
        <Link href={`/create?slicer=${slicerId}&product=${productId}`}>
          <a className="cursor-pointer hover:text-yellow-600">Edit form</a>
        </Link>
      </div>
      {submissions.length != 0 && (
        <div
          className="flex items-center justify-end col-span-3 font-semibold cursor-pointer group"
          onClick={() =>
            setModalView({
              name: "SUBMISSIONS_VIEW",
              cross: true,
              params: { slicerId, productId, questions, submissions }
            })
          }
        >
          <p className="text-sm group-hover:text-blue-600">View submissions</p>
          <div className="w-6 h-6 transition-transform duration-200 transform rotate-180 group-hover:translate-x-1 group-hover:text-blue-600">
            <Chevron />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsListElement
