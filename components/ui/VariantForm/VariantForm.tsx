import variantsJson from "constants/printfulVariants.json"
import Image from "next/image"
import { useEffect, useState } from "react"

type Props = {
  allVariants: any[]
  selectedVariant: any
  setSelectedVariant: any
  groupIndex: number
  setGroupIndex: any
}

const VariantForm = ({
  allVariants,
  selectedVariant,
  setSelectedVariant,
  groupIndex,
  setGroupIndex
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
      <div className="space-y-2">
        {allVariants.length > 1 && (
          <div className="mt-4 sm:mt-0">
            <p className="text-sm text-gray-600 pb-1">Products</p>
            <div className="overflow-y-scroll ">
              <div className="flex mb-2 w-fit">
                {allVariants.map((value, index) => {
                  const image = value[0].files?.slice(-1)?.[0]?.preview_url
                  const isSelected = groupIndex == index

                  return (
                    <div className="relative w-20 pb-1 pr-1" key={index}>
                      <Image
                        src={image}
                        alt={`${selectedVariant.product.name} image`}
                        className={`rounded-lg aspect-square img-background cursor-pointer object-cover duration-100 ${
                          isSelected ? "opacity-100" : "opacity-70"
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
            <p className="text-sm text-gray-600 pb-1">Size</p>
            <div className="flex flex-wrap pr-2 gap-1">
              {uniqueSizes.map((size: string, key) => {
                const isSelected = selectedSize == size
                const isAvailable = allVariants[groupIndex].some(
                  ({ variant_id }) =>
                    variantsJson[variant_id]?.size == size &&
                    variantsJson[variant_id]?.colorCode == selectedColor
                )

                return (
                  <div
                    className={`p-1 h-6 border-2 flex justify-center items-center border-transparent rounded-full text-xs ${
                      isSelected ? "border-black hover:border-black" : ""
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
            <p className="text-sm text-gray-600 pb-1">Color</p>
            <div className="flex flex-wrap pr-2">
              {uniqueColors.map((color: string, key) => {
                const isSelected = selectedColor == color
                const isAvailable = allVariants[groupIndex].some(
                  ({ variant_id }) =>
                    variantsJson[variant_id]?.size == selectedSize &&
                    variantsJson[variant_id]?.colorCode == color
                )

                return (
                  <div
                    className={`p-1 border-2 border-transparent rounded-full text-xs ${
                      isSelected ? "border-black hover:border-black" : ""
                    } ${
                      isAvailable
                        ? `opacity-100 cursor-pointer ${
                            !isSelected ? "hover:border-gray-600" : ""
                          }`
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() =>
                      isAvailable ? setSelectedColor(color) : null
                    }
                    key={key}
                  >
                    <div
                      className={"w-4 h-4 rounded-full"}
                      key={key}
                      style={{ content: "", background: color }}
                    ></div>
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
