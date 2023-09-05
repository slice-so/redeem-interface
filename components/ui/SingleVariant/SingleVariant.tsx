import ListElement from "../ListElement"
import Minus from "@components/icons/Minus"
import Plus from "@components/icons/Plus"

type Props = {
  value: any
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

const SingleVariant = ({
  value,
  choosenVariants,
  quantityToRedeem,
  totalQuantitySelected,
  updateProductQuantity
}: Props) => {
  const { product, external_id: variantId, files } = value
  const { image, name } = product
  const index = choosenVariants.findIndex(
    ({ variantId: chosenVariantId }) => chosenVariantId == variantId
  )
  const variant = choosenVariants?.[index]
  const quantitySelected = variant?.quantity || 0
  const quantityLeft = quantityToRedeem - totalQuantitySelected
  const disabled = quantityLeft == 0 && quantitySelected == 0

  const mockupUrl = files?.slice(-1)?.[0]?.preview_url

  return (
    <>
      <ListElement
        image={mockupUrl || image}
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
    </>
  )
}

export default SingleVariant
