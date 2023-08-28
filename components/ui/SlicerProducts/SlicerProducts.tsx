import Image from "next/image"
import { ProductDataExpanded } from "../HomeRedeem/HomeRedeem"
import { Dispatch, SetStateAction } from "react"
import Check from "@components/icons/Check"
import productDefault from "public/product_default.png"
import Minus from "@components/icons/Minus"
import Plus from "@components/icons/Plus"
import ShoppingBag from "@components/icons/ShoppingBag"
import { SelectedProducts } from "../SelectRedeems/SelectRedeems"

type Props = {
  slicerId: number
  products: ProductDataExpanded[]
  selectedProducts: SelectedProducts
  setSelectedProducts: Dispatch<SetStateAction<SelectedProducts>>
}

const SlicerProducts = ({
  slicerId,
  products,
  selectedProducts,
  setSelectedProducts
}: Props) => {
  const slicerName = products[0].product.Slicer.name

  const updateProductQuantity = (
    slicerId: number,
    productId: number,
    maxQuantity: number,
    amount: number
  ) => {
    if (amount < 0) amount = 0
    if (amount > maxQuantity) amount = maxQuantity
    setSelectedProducts({
      ...selectedProducts,
      [`${slicerId}-${productId}`]: amount
    })
  }

  return (
    <li>
      <h2 className="pb-3.5 pl-4 text-lg sm:text-xl flex text-gray-600 pt-2 font-medium items-center">
        {slicerName}
      </h2>
      <div className="rounded-md pt-6 shadow-md bg-gray-50">
        <div className="flex gap-6 px-4 overflow-y-hidden">
          {products.map(({ product, quantityToRedeem }) => {
            const { product_id: productId, name, image } = product
            const quantitySelected =
              selectedProducts[`${slicerId}-${productId}`]

            return (
              <div className="flex-shrink-0 w-40 sm:w-48 pb-4" key={productId}>
                <div className="relative group">
                  <span
                    title="Purchases"
                    className="absolute text-sm z-10 flex items-center nightwind-prevent bg-white bg-opacity-75 backdrop-blur-sm shadow-md h-[32px] cursor-pointer top-0 left-0 rounded-br-xl rounded-tl-lg px-[18px] text-indigo-600"
                    onClick={() =>
                      updateProductQuantity(
                        slicerId,
                        productId,
                        quantityToRedeem,
                        quantitySelected ? 0 : quantityToRedeem
                      )
                    }
                  >
                    <p className="mr-[5px]">{quantityToRedeem}</p>
                    <ShoppingBag className="mb-[1px] w-[15px] h-[15px]" />
                  </span>
                  <Image
                    src={image || productDefault}
                    alt={name + " image"}
                    className={`rounded-lg h-32 sm:h-36 img-background cursor-pointer object-cover duration-100 ${
                      quantitySelected ? "opacity-100" : "opacity-80"
                    }`}
                    onClick={() =>
                      updateProductQuantity(
                        slicerId,
                        productId,
                        quantityToRedeem,
                        quantitySelected ? 0 : quantityToRedeem
                      )
                    }
                  />
                  <p className="text-sm py-3 font-medium text-gray-500 truncate">
                    {name}
                  </p>
                  <div className="relative z-10 grid items-center justify-center w-full grid-cols-4 overflow-hidden text-center bg-white border border-gray-100 rounded-md shadow-md">
                    <button
                      className={`flex items-center justify-center h-8 transition-colors duration-150 ${
                        quantitySelected && quantitySelected != 0
                          ? "text-red-500 hover:bg-red-500 hover:text-white"
                          : "text-white bg-gray-400 cursor-default"
                      }`}
                      onClick={() =>
                        updateProductQuantity(
                          slicerId,
                          productId,
                          quantityToRedeem,
                          quantitySelected - 1
                        )
                      }
                    >
                      <Minus className="w-[17px] h-[17px]" />
                    </button>
                    <div className="flex items-center justify-center col-span-2 pl-3 text-sm text-black border-l border-r border-gray-200 cursor-default h-8">
                      <input
                        value={quantitySelected || 0}
                        type="number"
                        max={quantityToRedeem}
                        className="w-full text-center bg-transparent border-none outline-none focus:ring-0 form-input"
                        onChange={(e) => {
                          updateProductQuantity(
                            slicerId,
                            productId,
                            quantityToRedeem,
                            Number(e.target.value)
                          )
                        }}
                      />
                    </div>
                    <button
                      className={`flex items-center justify-center h-8 transition-colors duration-150 ${
                        quantityToRedeem != quantitySelected
                          ? "text-green-500 hover:bg-green-500 hover:text-white"
                          : "text-white bg-gray-400 cursor-default"
                      }`}
                      onClick={() =>
                        updateProductQuantity(
                          slicerId,
                          productId,
                          quantityToRedeem,
                          (quantitySelected || 0) + 1
                        )
                      }
                    >
                      <Plus className="w-[17px] h-[17px]" />
                    </button>
                  </div>
                  <div
                    className={`absolute top-[8px] rounded-full nightwind-prevent p-[3px] right-[8px] text-white w-5 h-5 cursor-pointer border border-white ${
                      quantitySelected ? "bg-green-500" : "bg-gray-400"
                    }`}
                    onClick={() =>
                      updateProductQuantity(
                        slicerId,
                        productId,
                        quantityToRedeem,
                        quantitySelected ? 0 : quantityToRedeem
                      )
                    }
                  >
                    {quantitySelected ? <Check /> : null}
                  </div>
                </div>
              </div>
            )
          })}
        </div>{" "}
      </div>
    </li>
  )
}

export default SlicerProducts
