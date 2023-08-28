import Image from "next/image"
import { ProductDataExpanded } from "../HomeRedeem/HomeRedeem"
import { Dispatch, SetStateAction, useState } from "react"
import Check from "@components/icons/Check"
import productDefault from "public/product_default.png"

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

  const handleSelectProduct = (
    slicerId: number,
    productId: number,
    quantityToRedeem: number
  ) => {
    if (!selectedProducts[`${slicerId}-${productId}`]) {
      setSelectedProducts({
        ...selectedProducts,
        [`${slicerId}-${productId}`]: quantityToRedeem
      })
    } else {
      setSelectedProducts({
        ...selectedProducts,
        [`${slicerId}-${productId}`]: 0
      })
    }
  }

  const updateProductQuantity = (
    slicerId: number,
    productId: number,
    maxQuantity: number,
    amount: number
  ) => {
    if (
      amount > 0
        ? selectedProducts[`${slicerId}-${productId}`] < maxQuantity
        : selectedProducts[`${slicerId}-${productId}`] > 0
    ) {
      setSelectedProducts({
        ...selectedProducts,
        [`${slicerId}-${productId}`]:
          selectedProducts[`${slicerId}-${productId}`] + amount
      })
    }
  }

  return (
    <li className="rounded-md shadow-md bg-gray-50">
      <div
        className={`flex items-center justify-between cursor-pointer py-3.5 px-4 group`}
      >
        <div className="flex items-center">
          <p>{slicerName}</p>
        </div>
      </div>
      <div className="flex gap-2 px-4 overflow-y-hidden">
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
                    height={200}
                    alt={name + " image"}
                    className="rounded-md cursor-pointer"
                    onClick={() =>
                      handleSelectProduct(slicerId, productId, quantityToRedeem)
                    }
                  />
                  <p>{name}</p>
                  <div className="pt-2 flex justify-around">
                    <button
                      onClick={() =>
                        updateProductQuantity(
                          slicerId,
                          productId,
                          quantityToRedeem,
                          -1
                        )
                      }
                    >
                      -
                    </button>
                    <p>{quantitySelected}</p>
                    <button
                      onClick={() =>
                        updateProductQuantity(
                          slicerId,
                          productId,
                          quantityToRedeem,
                          1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  {quantitySelected ? (
                    <div className="absolute top-[8px] rounded-full nightwind-prevent bg-blue-600 p-[3px] right-[8px] text-white w-5 h-5">
                      <Check />
                    </div>
                  ) : null}
                </div>
              </div>
            )
          }
        )}
      </div>
    </li>
  )
}

export default SlicerProducts
