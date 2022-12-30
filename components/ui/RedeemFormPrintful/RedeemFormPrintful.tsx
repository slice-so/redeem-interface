import Chevron from "@components/icons/Chevron"
import Image from "next/future/image"
import { Dispatch, SetStateAction, useEffect, useRef } from "react"
import { LinkedProducts } from "../HomeRedeem/HomeRedeem"

type Props = {
  linkedProducts: LinkedProducts
  selectedProduct: string
  setSelectedProduct: Dispatch<SetStateAction<string>>
}

const RedeemFormPrintful = ({
  linkedProducts,
  selectedProduct,
  setSelectedProduct
}: Props) => {
  const product = linkedProducts.length != 0 && linkedProducts[0].product
  const variants = linkedProducts.length != 0 && linkedProducts[0].variants

  useEffect(() => {
    if (variants.length == 1) setSelectedProduct(variants[0].external_id)
  }, [variants])

  return (
    product && (
      <div className="mb-6">
        <div className="flex justify-center">
          <Image
            src={product.thumbnail_url}
            width={200}
            height={200}
            alt={product.name + " image"}
            className="rounded-md"
          />
        </div>
        <p className="py-6 font-medium">{product.name}</p>
        <div className="relative">
          <select
            className="w-full py-2 pl-5 pr-4 text-black transition-shadow duration-150 ease-in-out bg-white border-blue-300 rounded-sm appearance-none focus:outline-none shadow-light-focusable focus:border-blue-200 disabled:text-gray-500 disabled:border-blue-100 disabled:bg-gray-50"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            disabled={variants.length == 1}
            required
          >
            <option value="">Pick option...</option>
            {variants.map((variant) => (
              <option key={variant.id} value={variant.external_id}>
                {(variants.length == 1 ? "Unique - " : "") +
                  variant.name.split(" - ")[1]}
              </option>
            ))}
          </select>
          {variants.length != 1 && (
            <div className="absolute top-0 right-[16px] w-4 h-full -rotate-90">
              <Chevron />
            </div>
          )}
        </div>
      </div>
    )
  )
}

export default RedeemFormPrintful
