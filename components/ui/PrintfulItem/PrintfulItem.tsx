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
}

export default function PrintfulItem({
  index,
  account,
  item,
  printfulItems,
  setPrintfulItems
}: Props) {
  const [showVariants, setShowVariants] = useState(false)

  const variantsList = printfulItems[account.id][index].variantsList

  const getVariants = async () => {
    try {
      const variants = await fetcher(
        `/api/printful/items/${item.id}?accountId=${account.id}&access_token=${account.access_token}&expires_at=${account.expires_at}&refresh_token=${account.refresh_token}`
      )
      const newPrintfulItems = { ...printfulItems }
      newPrintfulItems[account.id][index].variantsList = variants

      setPrintfulItems(newPrintfulItems)
    } catch (error) {
      console.log(error)
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
            <label className="block" key={variant.id}>
              <input type="checkbox" />
              {variantsList.length == 1
                ? "Unique"
                : variant?.name?.split(" - ")[1]?.trim()}
            </label>
          ))
        ))}
    </div>
  )
}
