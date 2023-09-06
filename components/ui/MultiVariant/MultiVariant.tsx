import Image from "next/image"
import { useState } from "react"
import { SelectedVariant, VariantForm, Button } from "@components/ui"
import { useAppContext } from "../context"

type Props = {
  allVariants: any[]
  choosenVariants: {
    quantity: number
    variantId: string
  }[]
  totalQuantitySelected: number
  quantityToRedeem: number
  updateProductQuantity: (
    index: number,
    variantId: string,
    maxQuantity: number,
    amount: number
  ) => void
}

const MultiVariant = ({
  allVariants,
  choosenVariants,
  quantityToRedeem,
  totalQuantitySelected,
  updateProductQuantity
}: Props) => {
  const [selectedVariant, setSelectedVariant] = useState(allVariants[0][0])
  const [groupIndex, setGroupIndex] = useState(0)

  const { setModalView } = useAppContext()

  function redeemVariant() {
    const index = choosenVariants.findIndex(
      ({ variantId: chosenVariantId }) =>
        chosenVariantId == selectedVariant.external_id
    )
    const quantitySelected = choosenVariants?.[index]?.quantity || 0
    const quantityLeft = quantityToRedeem - totalQuantitySelected
    updateProductQuantity(
      index,
      selectedVariant.external_id,
      quantitySelected + quantityLeft,
      quantitySelected + 1
    )
  }

  return (
    <div>
      <div className="flex flex-col flex-1 pb-2 sm:flex-row">
        <div
          className="relative flex-shrink-0 w-full sm:mr-4 aspect-square max-h-[282px] max-w-[282px]"
          onClick={() =>
            setModalView({
              name: "FULLSCREEN_IMAGE",
              cross: true,
              params: {
                src: selectedVariant.files?.slice(-1)?.[0]?.preview_url,
                name: selectedVariant.product.name
              }
            })
          }
        >
          <Image
            src={selectedVariant.files?.slice(-1)?.[0]?.preview_url}
            alt={`${selectedVariant.product.name} image`}
            className={
              "rounded-lg img-background cursor-pointer object-cover duration-100"
            }
            fill
            objectFit="cover"
            objectPosition="center"
          />
        </div>
        <div className="flex flex-col justify-between text-left">
          <VariantForm
            allVariants={allVariants}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
            groupIndex={groupIndex}
            setGroupIndex={setGroupIndex}
          />
          <div className="relative z-10 mt-6 mb-2">
            <Button
              onClick={redeemVariant}
              label={"Select"}
              disabled={totalQuantitySelected == quantityToRedeem}
            />
          </div>
        </div>
      </div>
      {totalQuantitySelected != 0 && (
        <div className="text-left pt-4 pb-8 space-y-6">
          {choosenVariants.map((variant, key) => {
            const value = allVariants
              .flat()
              .find(({ external_id }) => variant.variantId == external_id)

            const index = choosenVariants.findIndex(
              ({ variantId: chosenVariantId }) =>
                chosenVariantId == value.external_id
            )
            const quantitySelected = choosenVariants?.[index]?.quantity || 0

            return (
              <>
                {quantitySelected > 0 && (
                  <SelectedVariant
                    key={key}
                    value={value}
                    index={index}
                    quantitySelected={quantitySelected}
                    totalQuantitySelected={totalQuantitySelected}
                    quantityToRedeem={quantityToRedeem}
                    updateProductQuantity={updateProductQuantity}
                  />
                )}
              </>
            )
          })}
          <p className="absolute bottom-[12px] right-[12px] text-sm text-right text-gray-500">
            <b>
              {totalQuantitySelected} / {quantityToRedeem} products selected
            </b>
          </p>
        </div>
      )}
    </div>
  )
}

export default MultiVariant
