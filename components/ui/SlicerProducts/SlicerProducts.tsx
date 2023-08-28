import Image from "next/image"
import { ProductDataExpanded } from "../HomeRedeem/HomeRedeem"
import { Dispatch, SetStateAction, useState } from "react"
import Check from "@components/icons/Check"
import productDefault from "public/product_default.png"
import Minus from "@components/icons/Minus"
import Plus from "@components/icons/Plus"

type Props = {
  slicerId: number
  products: ProductDataExpanded[]
  selectedProducts: object
  setSelectedProducts: Dispatch<SetStateAction<object>>
}

const SlicerProducts = ({
  slicerId,
  products,
  selectedProducts,
  setSelectedProducts
}: Props) => {
  const slicerName = products[0].Slicer.name

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
      <h2 className="pb-3.5 pl-4 text-lg flex text-gray-600 pt-2 font-medium items-center">
        {slicerName}
      </h2>
      <div className="rounded-md pt-6 shadow-md bg-gray-50">
        <div className="flex gap-6 px-4 overflow-y-hidden">
          {products.map(
            ({ product_id: productId, name, quantityToRedeem, image }) => {
              const quantitySelected =
                selectedProducts[`${slicerId}-${productId}`]
              return (
                <div className="flex-shrink-0 w-40 pb-4" key={productId}>
                  <div className="relative group">
                    <Image
                      src={image || productDefault}
                      width={200}
                      height={150}
                      alt={name + " image"}
                      className="rounded-lg h-full img-background cursor-pointer object-cover"
                      onClick={() =>
                        updateProductQuantity(
                          slicerId,
                          productId,
                          quantityToRedeem,
                          quantitySelected ? 0 : quantityToRedeem
                        )
                      }
                    />
                    <p className="text-sm py-3 font-medium text-gray-500">
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
                      className={`absolute top-[8px] rounded-full nightwind-prevent p-[3px] right-[8px] text-white w-[22px] h-[22px] cursor-pointer border border-white ${
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
            }
          )}
        </div>{" "}
      </div>
    </li>
  )
}

export default SlicerProducts
