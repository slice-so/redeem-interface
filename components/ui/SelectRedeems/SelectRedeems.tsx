import { ProductData } from "@utils/useProductData"
import SlicerProducts from "../SlicerProducts"
import Button from "../Button"
import { RedeemData } from "../HomeRedeem/HomeRedeem"

export type ProductDataExpanded = ProductData & {
  quantityToRedeem: number
}

type SelectedProducts = {
  [id: string]: number
}

type Props = {
  productData: RedeemData
  selectedProducts: SelectedProducts
  setSelectedProducts: React.Dispatch<React.SetStateAction<SelectedProducts>>
  setIsFormView: React.Dispatch<React.SetStateAction<boolean>>
}

const SelectRedeems = ({
  productData,
  selectedProducts,
  setSelectedProducts,
  setIsFormView
}: Props) => {
  const totalToRedeem = Object.values(selectedProducts).reduce(
    (acc, curr) => acc + curr,
    0
  )

  return (
    <div>
      <p className="text-lg leading-8 pb-12 text-gray-600">
        Select how many products you wish to redeem
      </p>
      <ul className="pb-16 space-y-12">
        {Object.entries(productData).map(([slicerId, val]) => {
          return (
            <SlicerProducts
              key={slicerId}
              slicerId={Number(slicerId)}
              products={val}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
            />
          )
        })}
      </ul>
      <Button
        label="Redeem products"
        disabled={totalToRedeem === 0}
        onClick={() => setIsFormView(true)}
      />
    </div>
  )
}

export default SelectRedeems
