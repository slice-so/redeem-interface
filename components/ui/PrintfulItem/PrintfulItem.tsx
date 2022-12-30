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
  shownItemIndex: number
  setShownItemIndex: Dispatch<SetStateAction<number>>
  printfulItems: Items
  setPrintfulItems: Dispatch<SetStateAction<Items>>
  productVariants: any
  setProductVariants: Dispatch<SetStateAction<any>>
}

export default function PrintfulItem({
  index,
  account,
  item,
  shownItemIndex,
  setShownItemIndex,
  printfulItems,
  setPrintfulItems,
  productVariants,
  setProductVariants
}: Props) {
  const variantsList = printfulItems[account.id][index].variantsList
  const productId = printfulItems[account.id][index].id

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
    productVariants[account.id] &&
    productVariants[account.id][productId] &&
    productVariants[account.id][productId]?.find(
      (v: any) => variant.id == v.id
    ) &&
    true

  const handleSetProductVariants = (variant: any) => {
    let newProductsVariants =
      productVariants[account.id] && productVariants[account.id][productId]
        ? [...productVariants[account.id][productId]]
        : null

    if (isVariantActive(variant)) {
      const index = newProductsVariants.findIndex((el) => el.id == variant.id)
      newProductsVariants.splice(index, 1)
      setProductVariants({ [account.id]: { [productId]: newProductsVariants } })
    } else {
      if (!newProductsVariants) {
        newProductsVariants = []
      }
      newProductsVariants.push(variant)
      setProductVariants({ [account.id]: { [productId]: newProductsVariants } })
    }
  }

  const handleSetAllProductVariants = () => {
    if (
      productVariants[account.id] &&
      productVariants[account.id][productId] == variantsList
    ) {
      setProductVariants({ [account.id]: { [productId]: [] } })
    } else {
      setProductVariants({ [account.id]: { [productId]: variantsList } })
    }
  }

  useEffect(() => {
    if (shownItemIndex == index && !variantsList) {
      getVariants()
    }
  }, [shownItemIndex])

  return (
    <div>
      <div
        onClick={() =>
          setShownItemIndex(shownItemIndex == index ? undefined : index)
        }
      >
        <Image
          src={item.thumbnail_url}
          width={200}
          height={200}
          alt={item.name + " image"}
        />
        <p>{item.name}</p>
      </div>
      {shownItemIndex == index &&
        (!variantsList ? (
          <Spinner />
        ) : (
          <>
            {variantsList.length != 1 && (
              <div
                className={`p-2 rounded-md border border-blue-300 ${
                  productVariants[account.id] &&
                  productVariants[account.id][productId] == variantsList &&
                  "bg-blue-100"
                }`}
                onClick={() => handleSetAllProductVariants()}
              >
                <p>
                  {productVariants[account.id] &&
                  productVariants[account.id][productId] == variantsList
                    ? "Deselect all"
                    : "Select all"}
                </p>
              </div>
            )}
            {variantsList.map((variant, i) => (
              <div key={i}>
                <div
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
              </div>
            ))}
          </>
        ))}
    </div>
  )
}
