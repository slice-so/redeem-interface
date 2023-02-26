import Check from "@components/icons/Check"
import Chevron from "@components/icons/Chevron"
import { Account } from "@prisma/client"
import fetcher from "@utils/fetcher"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Items } from "../CreateFormPrintful/CreateFormPrintful"
import { LinkedProducts } from "../HomeRedeem/HomeRedeem"
import PrintfulItem from "../PrintfulItem"

type Props = {
  account: Account
  printfulItems: Items
  setPrintfulItems: Dispatch<SetStateAction<Items>>
  wrapperClassName?: string
  linkedProducts: LinkedProducts
  setLinkedProducts: Dispatch<SetStateAction<any>>
}

export default function PrintfulStore({
  account,
  printfulItems,
  setPrintfulItems,
  wrapperClassName,
  linkedProducts,
  setLinkedProducts
}: Props) {
  const [showDetail, setShowDetail] = useState(false)
  const [shownItemIndex, setShownItemIndex] = useState<number>(null)

  const item =
    printfulItems &&
    account.id &&
    shownItemIndex != null &&
    printfulItems[account.id][shownItemIndex]
  const variantsList = item?.variantsList

  const linkedProductIndex = linkedProducts?.findIndex(
    ({ product }) => product.id == item.id
  )
  const linkedProduct = linkedProducts[linkedProductIndex]

  const getPrintfulItems = async () => {
    try {
      const items = await fetcher(`/api/printful/items?accountId=${account.id}`)

      setPrintfulItems({ ...printfulItems, [account.id]: items })
    } catch (error) {
      console.log(error)
    }
  }

  const getVariants = async (index: number) => {
    try {
      const variants = await fetcher(
        `/api/printful/items/${printfulItems[account.id][index].id}?accountId=${
          account.id
        }`
      )
      const newPrintfulItems = { ...printfulItems }
      newPrintfulItems[account.id][index].variantsList = variants

      setPrintfulItems(newPrintfulItems)
    } catch (error) {
      console.log(error)
    }
  }

  const isVariantActive = (variant: any) =>
    linkedProduct?.variants?.find((v: any) => variant.id == v.id) && true

  const handleSetLinkedProducts = (variant: any) => {
    const newProductsVariants = linkedProduct ? [...linkedProduct.variants] : []
    const newLinkedProducts =
      linkedProducts.length && linkedProducts[0].accountId == account.id
        ? [...linkedProducts]
        : []

    if (isVariantActive(variant)) {
      const index = newProductsVariants.findIndex((el) => el.id == variant.id)
      newProductsVariants.splice(index, 1)
      if (!newProductsVariants.length) {
        newLinkedProducts.splice(linkedProductIndex, 1)
      }
    } else {
      newProductsVariants.push(variant)
    }

    if (newProductsVariants.length) {
      if (newLinkedProducts.length && linkedProductIndex != -1) {
        newLinkedProducts[linkedProductIndex] = {
          accountId: account.id,
          product: item,
          variants: newProductsVariants
        }
      } else {
        newLinkedProducts.push({
          accountId: account.id,
          product: item,
          variants: newProductsVariants
        })
      }
    }

    setLinkedProducts(newLinkedProducts)
  }

  const handleSetAllLinkedProducts = () => {
    const newLinkedProducts =
      linkedProducts.length && linkedProducts[0].accountId == account.id
        ? [...linkedProducts]
        : []

    if (linkedProduct?.variants == variantsList) {
      newLinkedProducts.splice(linkedProductIndex, 1)
    } else {
      if (newLinkedProducts.length && linkedProductIndex != -1) {
        newLinkedProducts[linkedProductIndex] = {
          accountId: account.id,
          product: item,
          variants: variantsList
        }
      } else {
        newLinkedProducts.push({
          accountId: account.id,
          product: item,
          variants: variantsList
        })
      }
    }

    setLinkedProducts(newLinkedProducts)
  }

  useEffect(() => {
    if (showDetail && !printfulItems[account?.id]) {
      getPrintfulItems()
    }
  }, [showDetail])

  useEffect(() => {
    if (shownItemIndex != null && !variantsList) {
      getVariants(shownItemIndex)
    }
  }, [shownItemIndex])

  return (
    <li className="rounded-md shadow-md bg-gray-50">
      <div
        className={`flex items-center justify-between cursor-pointer py-3.5 px-4 group ${
          wrapperClassName || ""
        }`}
        onClick={() => setShowDetail((showDetail) => !showDetail)}
      >
        <div className="flex items-center">
          <div className={`flex-shrink-0 w-6 h-6 mr-4 ${showDetail && "pb-2"}`}>
            <Chevron
              className={`transition-transform duration-100 ease-out ${
                showDetail
                  ? "-rotate-90"
                  : "-rotate-180 group-hover:translate-x-[4px]"
              }`}
            />
          </div>
          <p>{account?.providerAccountId}</p>
        </div>

        {!showDetail &&
          linkedProducts.length != 0 &&
          linkedProducts.findIndex(
            (product) => product.accountId == account?.id
          ) != -1 && (
            <div className="rounded-full bg-blue-600 nightwind-prevent p-[3px] text-white w-5 h-5">
              <Check />
            </div>
          )}
      </div>
      <div className="flex gap-2 px-4 overflow-y-hidden">
        {showDetail &&
          (printfulItems[account?.id] ? (
            printfulItems[account.id].length != 0 ? (
              printfulItems[account.id].map(
                (item, index) =>
                  item.thumbnail_url && (
                    <PrintfulItem
                      key={item.id}
                      index={index}
                      shownItemIndex={shownItemIndex}
                      setShownItemIndex={setShownItemIndex}
                      item={item}
                      linkedProducts={linkedProducts}
                    />
                  )
              )
            ) : (
              <p className="pb-4 text-gray-500">
                Add products on your Printful store to see them here.
              </p>
            )
          ) : (
            [...Array(5)].map((i, key) => (
              <div key={key} className="flex-shrink-0 w-40 pb-4 animate-pulse">
                <div>
                  <div className="h-40 bg-gray-300 rounded-md" />
                  <div className="w-24 h-5 mt-2 bg-gray-300 rounded-lg" />
                </div>
              </div>
            ))
          ))}
      </div>
      {showDetail && shownItemIndex != null && (
        <div className="px-2 pb-6 text-sm sm:px-4">
          <p className="pb-4 text-base text-gray-500">
            Choose the variants among which the buyers can pick when redeeming
            the product
          </p>
          {!variantsList ? (
            <>
              <span className="inline-block mb-2 font-medium text-blue-600 opacity-60">
                Select all
              </span>
              <div className="flex flex-wrap gap-y-2 gap-x-3">
                {[...Array(3)].map((i, key) => (
                  <div key={key}>
                    <div className="w-24 bg-gray-300 border border-blue-300 rounded-lg h-7 animate-pulse" />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {variantsList.length != 1 && (
                <span
                  className={`inline-block mb-2 font-medium cursor-pointer opacity-60 hover:opacity-100 ${
                    linkedProduct?.variants == variantsList
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                  onClick={() => handleSetAllLinkedProducts()}
                >
                  {linkedProduct?.variants == variantsList
                    ? "Deselect all"
                    : "Select all"}
                </span>
              )}
              <div className="flex flex-wrap gap-y-2 gap-x-3">
                {variantsList.map((variant, i) => (
                  <div key={i}>
                    <div
                      className={`p-1 px-3 cursor-pointer rounded-lg border border-blue-300 ${
                        isVariantActive(variant)
                          ? "bg-blue-100"
                          : "hover:bg-blue-50 "
                      }`}
                      onClick={() => handleSetLinkedProducts(variant)}
                    >
                      <p>
                        {(variantsList.length == 1 ? "Unique" : "") +
                          (variantsList.length == 1 &&
                          variant.name.split(item.name + " - ")[1]
                            ? " - "
                            : "") +
                          (variant.name.split(item.name + " - ")[1]
                            ? variant.name.split(item.name + " - ")[1]
                            : "")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </li>
  )
}
