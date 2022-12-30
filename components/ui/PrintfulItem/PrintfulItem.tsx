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
  linkedProducts: any
  setLinkedProducts: Dispatch<SetStateAction<any>>
}

export default function PrintfulItem({
  index,
  account,
  item,
  shownItemIndex,
  setShownItemIndex,
  printfulItems,
  setPrintfulItems,
  linkedProducts,
  setLinkedProducts
}: Props) {
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
    linkedProducts[0]?.variants?.find((v: any) => variant.id == v.id) && true

  const handleSetLinkedProducts = (variant: any) => {
    const newProductsVariants =
      linkedProducts[0]?.product.id == item.id && linkedProducts[0]?.variants
        ? [...linkedProducts[0].variants]
        : []

    if (isVariantActive(variant)) {
      const index = newProductsVariants.findIndex((el) => el.id == variant.id)
      newProductsVariants.splice(index, 1)
      setLinkedProducts(
        newProductsVariants.length != 0
          ? [
              {
                accountId: account.id,
                product: item,
                variants: newProductsVariants
              }
            ]
          : []
      )
    } else {
      newProductsVariants.push(variant)
      setLinkedProducts([
        { accountId: account.id, product: item, variants: newProductsVariants }
      ])
    }
  }

  const handleSetAllLinkedProducts = () => {
    if (linkedProducts[0]?.variants == variantsList) {
      setLinkedProducts([])
    } else {
      setLinkedProducts([
        { accountId: account.id, product: item, variants: variantsList }
      ])
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
                  linkedProducts[0]?.variants == variantsList && "bg-blue-100"
                }`}
                onClick={() => handleSetAllLinkedProducts()}
              >
                <p>
                  {linkedProducts[0]?.variants == variantsList
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
                  onClick={() => handleSetLinkedProducts(variant)}
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
