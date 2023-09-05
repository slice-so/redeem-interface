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
      <div>
        {allVariants.length > 1 && (
          <div className="mb-2">
            <p className="mt-4 sm:mt-0">Available products</p>
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
                        className={`rounded-lg h-24 img-background cursor-pointer object-cover duration-100 ${
                          isSelected ? "opacity-100" : "opacity-80"
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
          <div className="mb-2">
            <p className="mb-1">Size</p>
            <div className="flex flex-wrap pr-2">
              {uniqueSizes.map((size: string, key) => {
                const isSelected = selectedSize == size
                const isAvailable = allVariants[groupIndex].some(
                  ({ variant_id }) =>
                    variantsJson[variant_id]?.size == size &&
                    variantsJson[variant_id]?.colorCode == selectedColor
                )

                return (
                  <div
                    className={`p-1 border-2 border-transparent ${
                      isSelected && "border-black"
                    } ${
                      isAvailable ? "opacity-100 cursor-pointer" : "opacity-50"
                    }`}
                    onClick={() => (isAvailable ? setSelectedSize(size) : null)}
                    key={key}
                  >
                    {size}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {uniqueColors.length > 1 && (
          <div className="mb-2">
            <p className="mb-1">Color</p>
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
                    className={`p-1 border-2 border-transparent rounded-full ${
                      isSelected && "border-black"
                    } ${
                      isAvailable ? "opacity-100 cursor-pointer" : "opacity-10"
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
