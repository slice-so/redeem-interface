import Link from "next/link"
import { Prisma, Form } from "@prisma/client"
import Chevron from "@components/icons/Chevron"
import { useAppContext } from "../context"
import { getSliceSubdomain } from "@utils/getSliceSubdomain"

export type ProductFormSubmissions = Form & {
  submissions: Prisma.JsonValue[]
}
type Props = {
  product: ProductFormSubmissions
}

const ProductsListElement = ({ product }: Props) => {
  const { slicerId, productId, submissions } = product || {
    slicerId: undefined,
    productId: undefined,
    questions: [],
    submissions: []
  }
  const { setModalView } = useAppContext()

  return (
    <div className="flex items-center justify-between w-full">
      <div className="text-sm text-left">
        <a
          href={`https://${getSliceSubdomain()}slice.so/slicer/${slicerId}?product=${productId}`}
          target="_blank"
          rel="noreferrer"
        >
          #{slicerId}/{productId}
        </a>
        <Link href={`/create?slicer=${slicerId}&product=${productId}`}>
          <a className="ml-4 text-gray-500">Edit form</a>
        </Link>
      </div>
      {submissions.length != 0 && (
        <div
          className="flex items-center justify-end font-semibold cursor-pointer group"
          onClick={() =>
            setModalView({
              name: "SUBMISSIONS_VIEW",
              cross: true,
              params: { slicerId, productId, submissions }
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
