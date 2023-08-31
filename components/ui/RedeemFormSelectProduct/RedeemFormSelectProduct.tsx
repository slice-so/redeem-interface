import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { LinkedProducts } from "../PrintfulStore/PrintfulStore"
import { Answers } from "../RedeemForm/RedeemForm"
import ListElement from "../ListElement"
import Minus from "@components/icons/Minus"
import Plus from "@components/icons/Plus"
import { ProductData } from "@utils/useProductData"

type Props = {
  slicerId: number
  productId: number
  quantityToRedeem: number
  linkedProducts: LinkedProducts
  product: ProductData
  answers: Answers
  setAnswers: Dispatch<SetStateAction<Answers>>
}

const RedeemFormSelectProduct = ({
  slicerId,
  productId,
  quantityToRedeem,
  linkedProducts,
  product,
  answers,
  setAnswers
}: Props) => {
  const isPrintful = linkedProducts.length > 0
  const allVariants = isPrintful
    ? // TODO: Set as image the product image, instead of the variant image
      // const productImage = product.thumbnail_url // from linkedProducts
      linkedProducts.map(({ variants }) => variants).flat()
    : [{ external_id: `${product.Slicer.id}-${product.Slicer.name}`, product }]

  const id = `${slicerId}-${productId}`
  const choosenVariants = answers?.[id]?.choosenVariants || []

  const totalQuantitySelected =
    choosenVariants?.reduce((acc, { quantity }) => acc + quantity, 0) || 0

  useEffect(() => {
    if (allVariants?.length == 1) {
      const answer = answers[id] || {}
      const choosenVariants = answer.choosenVariants || []
      choosenVariants[0] = {
        quantity: quantityToRedeem,
        variantId: allVariants[0].external_id
      }

      setAnswers((prev) => ({
        ...prev,
        [id]: { questionAnswers: answer.questionAnswers, choosenVariants }
      }))
    }
  }, [])

  const updateProductQuantity = (
    index: number,
    variantId: string,
    maxQuantity: number,
    amount: number
  ) => {
    if (amount < 0) amount = 0
    if (amount > maxQuantity) amount = maxQuantity

    const answer = answers[id] || {}
    const choosenVariants = answer.choosenVariants || []

    if (index == -1) {
      choosenVariants.push({ quantity: amount, variantId })
    } else {
      choosenVariants[index] = {
        quantity: amount,
        variantId
      }
    }

    setAnswers((prev) => ({
      ...prev,
      [id]: { questionAnswers: answer.questionAnswers, choosenVariants }
    }))
  }

  return (
    <>
      <div className="pt-6 rounded-md shadow-sm bg-gray-50">
        <div className="flex gap-6 px-4 overflow-y-hidden">
          {allVariants.map(({ product, external_id: variantId }, key) => {
            const { image, name } = product

            const index = choosenVariants.findIndex(
              ({ variantId: chosenVariantId }) => chosenVariantId == variantId
            )
            const variant = choosenVariants?.[index]
            const quantitySelected = variant?.quantity || 0
            const quantityLeft = quantityToRedeem - totalQuantitySelected
            const disabled = quantityLeft == 0 && quantitySelected == 0

            return (
              <ListElement
                image={image}
                name={name}
                isSelected={quantitySelected != 0}
                onClick={() =>
                  updateProductQuantity(
                    index,
                    variantId,
                    quantitySelected + quantityLeft,
                    quantitySelected == 0 ? quantitySelected + quantityLeft : 0
                  )
                }
                key={variantId}
                width={260}
                height={260}
                truncate={false}
              >
                <div className="relative z-10 grid items-center justify-center w-full grid-cols-4 mb-6 overflow-hidden text-center bg-white border border-gray-100 rounded-md shadow-md">
                  <button
                    type="button"
                    className={`flex items-center justify-center h-8 transition-colors duration-150 ${
                      quantitySelected != 0
                        ? "text-red-500 hover:bg-red-500 hover:text-white"
                        : "text-white bg-gray-400 cursor-default"
                    }`}
                    onClick={() =>
                      updateProductQuantity(
                        index,
                        variantId,
                        quantitySelected + quantityLeft,
                        quantitySelected - 1
                      )
                    }
                  >
                    <Minus className="w-[17px] h-[17px]" />
                  </button>
                  <div
                    className={`flex items-center justify-center col-span-2 pl-3 text-sm text-black border-l border-r border-gray-200 cursor-default h-8 ${
                      disabled ? "bg-gray-400" : ""
                    }`}
                  >
                    <input
                      value={quantitySelected || ""}
                      placeholder="0"
                      type="number"
                      max={quantityToRedeem}
                      className="w-full text-center bg-transparent border-none outline-none focus:ring-0 form-input disabled:bg-gray-400"
                      onChange={(e) =>
                        updateProductQuantity(
                          index,
                          variantId,
                          quantitySelected + quantityLeft,
                          Number(e.target.value)
                        )
                      }
                      disabled={disabled}
                      required={totalQuantitySelected == 0}
                    />
                  </div>
                  <button
                    type="button"
                    className={`flex items-center justify-center h-8 transition-colors duration-150 ${
                      quantityLeft != 0
                        ? "text-green-500 hover:bg-green-500 hover:text-white"
                        : "text-white bg-gray-400 cursor-default"
                    }`}
                    onClick={() =>
                      updateProductQuantity(
                        index,
                        variantId,
                        quantitySelected + quantityLeft,
                        quantitySelected + 1
                      )
                    }
                  >
                    <Plus className="w-[17px] h-[17px]" />
                  </button>
                </div>
              </ListElement>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default RedeemFormSelectProduct
