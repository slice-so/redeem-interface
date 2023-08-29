import SlicerProducts from "../SlicerProducts"
import Button from "../Button"
import { RedeemData } from "../HomeRedeem/HomeRedeem"
import { Dispatch, SetStateAction } from "react"
import { getSliceSubdomain } from "@utils/getSliceSubdomain"

export type SelectedProducts = {
  [id: string]: number
}

type Props = {
  productData: RedeemData
  selectedProducts: SelectedProducts
  setSelectedProducts: Dispatch<SetStateAction<SelectedProducts>>
  setIsFormView: Dispatch<SetStateAction<boolean>>
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

  return Object.keys(productData).length != 0 ? (
    <div>
      <p className="text-lg leading-8 pb-12 text-gray-600">
        Select the products to redeem
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
        label="Continue"
        disabled={totalToRedeem === 0}
        onClick={() => setIsFormView(true)}
      />
    </div>
  ) : (
    <div>
      <p className="text-lg leading-8 pb-12 text-gray-600">
        You have no products to redeem
      </p>
      <Button
        label="Go to Slice"
        href={`https://${getSliceSubdomain()}slice.so/slicer`}
      />
    </div>
  )
}

export default SelectRedeems

//
