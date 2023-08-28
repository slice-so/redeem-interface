import { ProductData } from "@utils/useProductData"
import SlicerProducts from "../SlicerProducts"
import DoubleText from "../DoubleText"
import Button from "../Button"
import { RedeemData } from "../HomeRedeem/HomeRedeem"

export type ProductDataExpanded = ProductData & {
  quantityToRedeem: number
}

type Props = {
  productData: RedeemData
  selectedProducts: {}
  setSelectedProducts: React.Dispatch<React.SetStateAction<{}>>
  setIsFormView: React.Dispatch<React.SetStateAction<boolean>>
}

const SelectRedeems = ({
  productData,
  selectedProducts,
  setSelectedProducts,
  setIsFormView
}: Props) => {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="pb-8">
          <DoubleText
            inactive
            size="text-3xl sm:text-4xl"
            logoText="Redeem Products"
          />
        </h1>
        <p className="text-lg leading-8 text-gray-600">
          Select the quantity of each Slice product to redeem
        </p>
      </div>
      <ul className="pb-4 space-y-12">
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
        disabled={Object.keys(selectedProducts).length === 0}
        onClick={() => setIsFormView(true)}
      />
    </div>
  )
}

export default SelectRedeems
