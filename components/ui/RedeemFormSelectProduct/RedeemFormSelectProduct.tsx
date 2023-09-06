import { Dispatch, SetStateAction, useEffect } from "react"
import { LinkedProducts } from "../PrintfulStore/PrintfulStore"
import { Answers } from "../RedeemForm/RedeemForm"
import { ProductData } from "@utils/useProductData"
import { SingleVariant, MultiVariant } from "@components/ui"

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
  const linkedVariants = linkedProducts.map(({ variants }) => variants)
  const allVariants = isPrintful
    ? linkedVariants.flat()
    : [{ external_id: `${product.Slicer.id}-${product.Slicer.name}`, product }]
  const isSingleVariant = allVariants.length == 1
  console.log({ product, isSingleVariant, allVariants })

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
      <div className="p-4 rounded-md shadow-sm bg-gray-50 relative">
        {isSingleVariant && (
          <SingleVariant
            value={allVariants[0]}
            choosenVariants={choosenVariants}
            totalQuantitySelected={totalQuantitySelected}
            quantityToRedeem={quantityToRedeem}
            updateProductQuantity={updateProductQuantity}
          />
        )}

        {!isSingleVariant && (
          <MultiVariant
            allVariants={linkedVariants}
            choosenVariants={choosenVariants}
            totalQuantitySelected={totalQuantitySelected}
            quantityToRedeem={quantityToRedeem}
            updateProductQuantity={updateProductQuantity}
          />
        )}
      </div>
    </>
  )
}

export default RedeemFormSelectProduct
