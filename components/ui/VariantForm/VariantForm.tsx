import Image from "next/image"
import { useEffect, useState } from "react"

type Props = {
  allVariants: any[]
  selectedVariant: any
  setSelectedVariant: any
  groupIndex: number
  setGroupIndex: any
  variantsJson: any
  totalQuantitySelected: number
}

const VariantForm = ({
  allVariants,
  selectedVariant,
  setSelectedVariant,
  groupIndex,
  setGroupIndex,
  variantsJson,
  totalQuantitySelected
}: Props) => {
  const [selectedColor, setSelectedColor] = useState(
    variantsJson[selectedVariant.variant_id]?.colorCode || ""
  )
  const [selectedSize, setSelectedSize] = useState(
    variantsJson[selectedVariant.variant_id]?.size || ""
  )

  const sizes = allVariants[groupIndex]
    .map(({ variant_id }) => variantsJson[variant_id]?.size)
    .filter((size) => size)

  const colors = allVariants[groupIndex]
    .map(({ variant_id }) => variantsJson[variant_id]?.colorCode)
    .filter((colorCode) => colorCode)

  const uniqueSizes = Array.from(new Set(sizes))
  const uniqueColors = Array.from(new Set(colors))

  useEffect(() => {
    const variant = allVariants[groupIndex].find(
      ({ variant_id }) =>
        variantsJson[variant_id]?.size == selectedSize &&
        variantsJson[variant_id]?.colorCode == selectedColor
    )

    setSelectedVariant(variant)
  }, [selectedSize, selectedColor])

  useEffect(() => {
    const color = variantsJson[selectedVariant.variant_id]?.colorCode
    const size = variantsJson[selectedVariant.variant_id]?.size

    setSelectedColor(color)
    setSelectedSize(size)
  }, [selectedVariant])

  return (
    <>
      <div className="space-y-3">
        {allVariants.length > 1 && (
          <div className="relative mt-4 sm:mt-0">
            <p className="pb-1 text-xs font-medium text-gray-600">Products</p>
            <input
              name="totalQuantitySelected"
              value={totalQuantitySelected}
              type="number"
              className="opacity-0 h-[1px] absolute top-[-10px] right-0"
              min={1}
            />
            <div className="overflow-scroll">
              <div className="flex gap-1 sm:flex-wrap">
                {allVariants.map((value, index) => {
                  const image = value[0].files?.slice(-1)?.[0]?.preview_url
                  const isSelected = groupIndex == index

                  return (
                    <div className="relative flex-shrink-0 w-20" key={index}>
                      <Image
                        src={image}
                        alt={`${selectedVariant.product.name} image`}
                        className={`rounded-lg aspect-square img-background cursor-pointer object-cover duration-100 ${
                          isSelected
                            ? "opacity-100"
                            : "opacity-70 hover:opacity-100"
                        }`}
                        width={260}
                        height={260}
                        onClick={() => {
                          setSelectedVariant(value[0])
                          setGroupIndex(index)
                        }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {uniqueSizes.length > 1 && (
          <div>
            <p className="pb-1 text-xs font-medium text-gray-600">Size</p>
            <div className="flex flex-wrap gap-1 pr-2">
              {uniqueSizes.map((size: string, key) => {
                const isSelected = selectedSize == size
                const isAvailable = allVariants[groupIndex].some(
                  ({ variant_id }) =>
                    variantsJson[variant_id]?.size == size &&
                    variantsJson[variant_id]?.colorCode == selectedColor
                )

                return (
                  <div
                    className={`p-1 h-6 border-2 flex justify-center items-center rounded-full text-xs text-gray-900 ${
                      isSelected
                        ? "border-black hover:border-black"
                        : "border-transparent"
                    } ${
                      isAvailable
                        ? `opacity-100 cursor-pointer ${
                            !isSelected ? "hover:border-gray-600" : ""
                          }`
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() => (isAvailable ? setSelectedSize(size) : null)}
                    key={key}
                  >
                    <p>{size}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {uniqueColors.length > 1 && (
          <div>
            <p className="pb-2 text-xs font-medium text-gray-600">Color</p>
            <div className="flex flex-wrap gap-3 pl-1 pr-2">
              {uniqueColors.map((color: string, key) => {
                const isSelected = selectedColor == color
                const isAvailable = allVariants[groupIndex].some(
                  ({ variant_id }) =>
                    variantsJson[variant_id]?.size == selectedSize &&
                    variantsJson[variant_id]?.colorCode == color
                )

                return (
                  <div
                    className={`outline outline-2 outline-offset-[3px] rounded-full text-xs ${
                      isSelected
                        ? "outline-black hover:outline-gray-600 dark:outline-white"
                        : "outline-transparent"
                    } ${
                      isAvailable
                        ? `opacity-100 cursor-pointer ${
                            !isSelected ? "hover:outline-gray-600" : ""
                          }`
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() =>
                      isAvailable ? setSelectedColor(color) : null
                    }
                    key={key}
                  >
                    <div
                      className="w-4 h-4 border border-gray-500 rounded-full"
                      key={key}
                      style={{ content: "", background: color }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default VariantForm
