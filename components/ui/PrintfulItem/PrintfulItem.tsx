import Alert from "@components/icons/Alert"
import Chevron from "@components/icons/Chevron"
import Spinner from "@components/icons/Spinner"
import { Account } from "@prisma/client"
import fetcher from "@utils/fetcher"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Items } from "../CreateFormPrintful/CreateFormPrintful"

type Props = {
  account: Account
  printfulItems: Items
  setPrintfulItems: Dispatch<SetStateAction<Items>>
  wrapperClassName?: string
}

export default function PrintfulItem({
  account,
  printfulItems,
  setPrintfulItems,
  wrapperClassName
}: Props) {
  const [showDetail, setShowDetail] = useState(false)

  const getPrintfulItems = async () => {
    try {
      const data = await fetcher(
        `/api/printful/items?id=${account.id}&access_token=${account.access_token}&expires_at=${account.expires_at}&refresh_token=${account.refresh_token}`
      )

      setPrintfulItems({ ...printfulItems, [account.id]: data.result })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (showDetail && !printfulItems[account?.id]) {
      getPrintfulItems()
    }
  }, [showDetail])

  console.log(printfulItems)

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
            className={`transition-transform duration-50 ease-out ${
              showDetail
                ? "-rotate-90"
                : "-rotate-180 group-hover:translate-x-[4px]"
            } `}
          />
        </div>
        <p>{account?.providerAccountId}</p>

        {showDetail && !printfulItems[account?.id] && (
          <div className="ml-4">
            <Spinner />
          </div>
        )}
      </div>
      {showDetail && (
        <div className="px-3 py-5 mt-3 prose-sm prose max-w-none sm:px-5">
          {/* {typeof detail == "string" ? <p>{detail}</p> : detail} */}
        </div>
      )}
    </li>
  )
}
