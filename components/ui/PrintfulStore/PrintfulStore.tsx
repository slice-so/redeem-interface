import Chevron from "@components/icons/Chevron"
import Spinner from "@components/icons/Spinner"
import { Account } from "@prisma/client"
import fetcher from "@utils/fetcher"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Items } from "../CreateFormPrintful/CreateFormPrintful"
import PrintfulItem from "../PrintfulItem"

type Props = {
  account: Account
  printfulItems: Items
  setPrintfulItems: Dispatch<SetStateAction<Items>>
  wrapperClassName?: string
  productVariants: any
  setProductVariants: Dispatch<SetStateAction<any>>
}

export default function PrintfulStore({
  account,
  printfulItems,
  setPrintfulItems,
  wrapperClassName,
  productVariants,
  setProductVariants
}: Props) {
  const [showDetail, setShowDetail] = useState(false)
  const [shownItemIndex, setShownItemIndex] = useState<number>()

  const getPrintfulItems = async () => {
    try {
      const items = await fetcher(`/api/printful/items?accountId=${account.id}`)

      setPrintfulItems({ ...printfulItems, [account.id]: items })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (showDetail && !printfulItems[account?.id]) {
      getPrintfulItems()
    }
  }, [showDetail])

  return (
    <li>
      <div
        className={`flex items-center py-3.5 px-4 bg-gray-100 rounded-md cursor-pointer group ${
          wrapperClassName || ""
        }`}
        onClick={() => setShowDetail((showDetail) => !showDetail)}
      >
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

        {showDetail && !printfulItems[account?.id] && (
          <div className="ml-4">
            <Spinner />
          </div>
        )}
      </div>
      <div className="flex gap-2">
        {showDetail &&
          printfulItems[account.id] &&
          printfulItems[account.id].map((item, index) => (
            <PrintfulItem
              key={item.id}
              index={index}
              shownItemIndex={shownItemIndex}
              setShownItemIndex={setShownItemIndex}
              account={account}
              item={item}
              printfulItems={printfulItems}
              setPrintfulItems={setPrintfulItems}
              productVariants={productVariants}
              setProductVariants={setProductVariants}
            />
          ))}
      </div>
    </li>
  )
}
