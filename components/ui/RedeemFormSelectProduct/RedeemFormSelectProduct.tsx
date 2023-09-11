import { Dispatch, SetStateAction, useEffect } from "react"
import {
  ExternalSettings,
  LinkedProducts
} from "../PrintfulStore/PrintfulStore"
import { Answers } from "../RedeemForm/RedeemForm"
import { ProductData } from "@utils/useProductData"
import { SingleVariant, MultiVariant, MySwitch, Question } from "@components/ui"

type Props = {
  slicerId: number
  productId: number
  quantityToRedeem: number
  linkedProducts: LinkedProducts
  externalSettings: ExternalSettings
  product: ProductData
  answers: Answers
  setAnswers: Dispatch<SetStateAction<Answers>>
}

const RedeemFormSelectProduct = ({
  slicerId,
  productId,
  quantityToRedeem,
  linkedProducts,
  externalSettings,
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

  const id = `${slicerId}-${productId}`
  const choosenVariants = answers?.[id]?.choosenVariants || []

  const totalQuantitySelected =
    choosenVariants?.reduce((acc, { quantity }) => acc + quantity, 0) || 0

  useEffect(() => {
    if (allVariants?.length == 1) {
      const answer = answers[id] || {}
      const choosenVariants = answer.choosenVariants || []
      const onSiteRedemption = answer.onSiteRedemption || false
      choosenVariants[0] = {
        quantity: quantityToRedeem,
        variantId: allVariants[0].external_id
      }

      setAnswers((prev) => ({
        ...prev,
        [id]: {
          questionAnswers: answer.questionAnswers,
          choosenVariants,
          onSiteRedemption
        }
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
    const onSiteRedemption = answer.onSiteRedemption || false

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
      [id]: {
        questionAnswers: answer.questionAnswers,
        choosenVariants,
        onSiteRedemption
      }
    }))
  }

  const handleSetOnSiteRedemption = (enabled: boolean) => {
    const answer = answers[id] || {}
    setAnswers((prev) => ({
      ...prev,
      [id]: {
        questionAnswers: answer.questionAnswers,
        choosenVariants: answer.choosenVariants,
        onSiteRedemption: enabled
      }
    }))
  }

  return (
    <>
      <div className="relative p-4 rounded-md shadow-sm bg-gray-50">
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
      {externalSettings.onSiteRedemption && (
        <div className="relative flex items-center justify-end gap-2 pt-8">
          <p>Redeem on-site</p>
          <Question
            text={
              <div className="space-y-4 text-sm">
                <p>
                  Enable if you&apos;re redeeming the items at the seller&apos;s
                  physical store.
                </p>
              </div>
            }
            position="bottom-0 right-0"
          />
          <MySwitch
            enabled={answers[id]?.onSiteRedemption}
            setEnabled={handleSetOnSiteRedemption}
          />
        </div>
      )}
    </>
  )
}

export default RedeemFormSelectProduct
