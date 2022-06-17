import Link from "next/link"
import { ProductForm } from "@prisma/client"
import Chevron from "@components/icons/Chevron"

type Props = {
  product: ProductForm
}

const ProductsListElement = ({ product }: Props) => {
  const { slicerId, productId } = product || {
    slicerId: undefined,
    productId: undefined
  }
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
      <div className="flex items-center justify-end col-span-3 font-semibold cursor-pointer group">
        <p className="text-sm group-hover:text-blue-600">View submissions</p>
        <div className="w-6 h-6 transition-transform duration-200 transform rotate-180 group-hover:translate-x-1 group-hover:text-blue-600">
          <Chevron />
        </div>
      </div>
    </div>
  )
}

export default ProductsListElement
