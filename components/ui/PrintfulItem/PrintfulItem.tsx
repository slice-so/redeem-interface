import Spinner from "@components/icons/Spinner"
import { Account } from "@prisma/client"
import fetcher from "@utils/fetcher"
import Image from "next/future/image"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Items } from "../CreateFormPrintful/CreateFormPrintful"

type Props = {
  index: number
  account: Account
  item: any
  printfulItems: Items
  setPrintfulItems: Dispatch<SetStateAction<Items>>
  productVariants: any
  setProductVariants: Dispatch<SetStateAction<any>>
}

export default function PrintfulItem({
  index,
  account,
  item,
  printfulItems,
  setPrintfulItems,
  productVariants,
  setProductVariants
}: Props) {
  const [showVariants, setShowVariants] = useState(false)

  const variantsList = printfulItems[account.id][index].variantsList

  const getVariants = async () => {
    try {
      const variants = await fetcher(
        `/api/printful/items/${item.id}?accountId=${account.id}`
      )
      const newPrintfulItems = { ...printfulItems }
      newPrintfulItems[account.id][index].variantsList = variants

      setPrintfulItems(newPrintfulItems)
    } catch (error) {
      console.log(error)
    }
  }

  const isVariantActive = (variant: any) =>
    productVariants &&
    productVariants[item.id] &&
    productVariants[item.id]?.includes(variant) &&
    true

  const handleSetProductVariants = (variant: any) => {
    const newProductsVariants = { ...productVariants }
    if (isVariantActive(variant)) {
      const index = newProductsVariants[item.id].findIndex(
        (el) => el == variant
      )
      newProductsVariants[item.id].splice(index, 1)
      setProductVariants(newProductsVariants)
    } else {
      if (!newProductsVariants[item.id]) {
        newProductsVariants[item.id] = []
      }
      newProductsVariants[item.id].push(variant)
      setProductVariants(newProductsVariants)
    }
  }

  useEffect(() => {
    if (showVariants && !variantsList) {
      getVariants()
    }
  }, [showVariants])

  return (
    <div>
      <div onClick={() => setShowVariants(!showVariants)}>
        <Image
          src={item.thumbnail_url}
          width={200}
          height={200}
          alt={item.name + " image"}
        />
        <p>{item.name}</p>
      </div>
      {showVariants &&
        (!variantsList ? (
          <Spinner />
        ) : (
          variantsList.map((variant) => (
            <div
              key={variant.id}
              className={`p-2 rounded-md border border-blue-300 ${
                isVariantActive(variant) && "bg-blue-100"
              }`}
              onClick={() => handleSetProductVariants(variant)}
            >
              <p>
                {variantsList.length == 1
                  ? "Unique"
                  : variant?.name?.split(" - ")[1]}
              </p>
            </div>
          ))
        ))}
    </div>
  )
}
