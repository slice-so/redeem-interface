import vatiantsJson from "constants/printfulVariants.json"
import Minus from "@components/icons/Minus"
import Plus from "@components/icons/Plus"
import Trash from "@components/icons/Trash"
import Image from "next/image"

type Props = {
  value: any
  index: number
  quantitySelected: number
  totalQuantitySelected: number
  quantityToRedeem: number
  updateProductQuantity: (
    index: number,
    variantId: string,
    maxQuantity: number,
    amount: number
  ) => void
}

const SelectedVariant = ({
  value,
  index,
  quantitySelected,
  quantityToRedeem,
  totalQuantitySelected,
  updateProductQuantity
}: Props) => {
  const { product, external_id: variantId, files, name, variant_id } = value
  const { image } = product

  const quantityLeft = quantityToRedeem - totalQuantitySelected
  const disabled = quantityLeft == 0 && quantitySelected == 0

  const mockupUrl = files?.slice(-1)?.[0]?.preview_url
  const color = vatiantsJson[variant_id]?.colorCode
  const size = vatiantsJson[variant_id]?.size

  return (
    <div className="flex flex-col mb-8 sm:flex-row">
      <div>
        <div className="relative w-56 h-32 pb-1 pr-1" key={index}>
          <Image
            src={mockupUrl || image}
            alt={`${name} image`}
            className={"rounded-lg img-background cursor-pointer object-cover "}
            fill
            objectFit="cover"
            objectPosition="center"
          />
        </div>
      </div>
      <div className="flex flex-col justify-between w-full sm:pl-8">
        <p className="sm:text-lg">{name}</p>
        {(color || size) && (
          <div className="flex items-center">
            <div className="p-1 mr-4">
              <div
                className={"w-6 h-6"}
                style={{ content: "", background: color }}
              ></div>
            </div>
            <p className="p-1 text-lg">{size}</p>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="relative z-10 grid items-center justify-center w-48 grid-cols-4 overflow-hidden text-center bg-white border border-gray-100 rounded-md shadow-md">
            {/* @dev Different logic from component in ListItem */}
            <button
              type="button"
              className={`flex items-center justify-center h-8 transition-colors duration-150 ${
                quantitySelected > 1
                  ? "text-red-500 hover:bg-red-500 hover:text-white"
                  : "text-white bg-gray-400 cursor-default"
              }`}
              onClick={() =>
                quantitySelected > 1
                  ? updateProductQuantity(
                      index,
                      variantId,
                      quantitySelected + quantityLeft,
                      quantitySelected - 1
                    )
                  : null
              }
            >
              <Minus className="w-[17px] h-[17px] cursor-pointer" />
            </button>
            <div
              className={`flex items-center justify-center col-span-2 pl-3 text-sm text-black border-l border-r border-gray-200 cursor-default h-8 ${
                disabled ? "bg-gray-400" : ""
              }`}
            >
              <input
                value={quantitySelected || ""}
                placeholder="1"
                type="number"
                min={1}
                max={quantityToRedeem}
                className="w-full text-center bg-transparent border-none outline-none focus:ring-0 form-input disabled:bg-gray-400"
                onChange={(e) => {
                  if (e.target.value != "0" && e.target.value != "") {
                    updateProductQuantity(
                      index,
                      variantId,
                      quantitySelected + quantityLeft,
                      Number(e.target.value)
                    )
                  } else {
                    e.target.value = "1"
                  }
                }}
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
              <Plus className="w-[17px] h-[17px] cursor-pointer" />
            </button>
          </div>
          <div
            onClick={() =>
              updateProductQuantity(
                index,
                variantId,
                quantitySelected + quantityLeft,
                0
              )
            }
          >
            <Trash className="w-[17px] h-[17px] cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectedVariant
