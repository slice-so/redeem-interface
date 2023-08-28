import Chevron from "@components/icons/Chevron"
import Image from "next/image"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { LinkedProducts } from "../HomeRedeem/HomeRedeem_old"
import { Answers } from "../RedeemForm/RedeemForm"

type Props = {
  linkedProducts: LinkedProducts
  selectedProduct: string
  setSelectedProduct: Dispatch<SetStateAction<string>>
  answers: Answers
  setAnswers: Dispatch<SetStateAction<Answers>>
}

const RedeemFormPrintful = ({
  linkedProducts,
  selectedProduct,
  setSelectedProduct,
  answers,
  setAnswers
}: Props) => {
  const [chosenProduct, setChosenProduct] = useState(
    linkedProducts.length != 0 ? linkedProducts[0] : null
  )

  const product = chosenProduct?.product
  const variants = chosenProduct?.variants

  const handleSetChosenProduct = (externalId: string) => {
    const product = linkedProducts.find(
      ({ product }) => product.external_id == externalId
    )
    setChosenProduct(product)
  }

  useEffect(() => {
    if (variants?.length == 1) setSelectedProduct(variants[0].external_id)
  }, [variants, setSelectedProduct])

  return (
    <>
      {linkedProducts.length != 0 && (
        <div className="mb-6">
          <div className="flex justify-center">
            <Image
              src={product.thumbnail_url}
              width={260}
              height={260}
              alt={product.name + " image"}
              className="rounded-lg"
            />
          </div>
          {linkedProducts.length == 1 ? (
            <p className="py-6 font-medium">{product.name}</p>
          ) : (
            <div className="py-6">
              <p className="pb-1 pr-1 text-sm font-medium text-left text-gray-500">
                Product to redeem
              </p>
              <div className="relative">
                <select
                  className="w-full py-2 pl-5 pr-4 text-black transition-shadow duration-150 ease-in-out bg-white border-blue-300 rounded-sm appearance-none focus:outline-none shadow-light-focusable focus:border-blue-200"
                  value={chosenProduct.product.external_id}
                  onChange={(e) => {
                    handleSetChosenProduct(e.target.value)
                  }}
                  required
                >
                  {linkedProducts.map(({ product }) => (
                    <option key={product.id} value={product.external_id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <div className="absolute top-0 right-[16px] w-4 h-full -rotate-90">
                  <Chevron />
                </div>
              </div>
            </div>
          )}
          {(variants.length != 1 ||
            variants[0].name.split(product.name + " - ")[1]) && (
            <>
              <p className="pb-1 pr-1 text-sm font-medium text-left text-gray-500">
                Color / size
              </p>
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
                      {(variants.length == 1 ? "Unique" : "") +
                        (variants.length == 1 &&
                        variant.name.split(product.name + " - ")[1]
                          ? " - "
                          : "") +
                        (variant.name.split(product.name + " - ")[1]
                          ? variant.name.split(product.name + " - ")[1]
                          : "")}
                    </option>
                  ))}
                </select>
                {variants.length != 1 && (
                  <div className="absolute top-0 right-[16px] w-4 h-full -rotate-90">
                    <Chevron />
                  </div>
                )}
              </div>
            </>
          )}

          <div className="px-2 py-6 my-6 text-left rounded-md shadow-lg bg-gray-50 sm:px-4">
            <div className="pb-4">
              <p className="font-medium">Delivery info</p>
              <p className="text-sm">
                The item will be delivered to the address specified below.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RedeemFormPrintful
