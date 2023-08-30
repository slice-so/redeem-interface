import { ProductDataExpanded } from "../HomeRedeem/HomeRedeem"
import { Dispatch, SetStateAction } from "react"
import ShoppingBag from "@components/icons/ShoppingBag"
import { SelectedProducts } from "../SelectRedeems/SelectRedeems"
import ListElement from "../ListElement"

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
              <ListElement
                image={image}
                name={name}
                topRight={
                  <>
                    <p className="mr-[5px]">{quantityToRedeem}</p>
                    <ShoppingBag className="mb-[1px] w-[15px] h-[15px]" />
                  </>
                }
                isSelected={!!quantitySelected}
                onClick={() =>
                  updateProductQuantity(
                    slicerId,
                    productId,
                    quantityToRedeem,
                    quantitySelected ? 0 : quantityToRedeem
                  )
                }
                key={productId}
              />
            )
          })}
        </div>{" "}
      </div>
    </li>
  )
}

export default SlicerProducts
