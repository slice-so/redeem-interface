import PrintfulLogo from "@components/icons/PrintfulLogo"
import { Account } from "@prisma/client"
import { useState } from "react"
import PrintfulStore from "../PrintfulStore"

type Props = { stateValue: string; accounts: Account[] }
export type Items = { [accountId: string]: any[] }

export const clientId = "app-8875250"

const CreateFormPrintful = ({ stateValue, accounts }: Props) => {
  const redirectUrl = process.env.NEXT_PUBLIC_APP_URL + "/create"
  const [printfulItems, setPrintfulItems] = useState<Items>({})

  return (
    <>
      <div>
        <p className="pt-2 text-gray-500">
          Link items from your Printful stores to automatically place orders
          when someone redeems your Slice product
        </p>
      </div>
      {accounts && accounts?.length != 0 && (
        <ul className="w-full pt-8 space-y-6 text-left">
          {accounts
            .sort((a, b) => Number(a.id) - Number(b.id))
            .map((account) => (
              <PrintfulStore
                key={account.id}
                account={account}
                printfulItems={printfulItems}
                setPrintfulItems={setPrintfulItems}
              />
            ))}
        </ul>
      )}
      <div className="text-center">
        <a
          href={`https://www.printful.com/oauth/authorize?client_id=${clientId}&state=${stateValue}&redirect_url=${redirectUrl}`}
          className="inline-block mt-8 mb-4 text-sm text-black hover:text-black"
        >
          <button className="flex items-center justify-center gap-2 px-8 py-2 font-medium tracking-wide transition-all duration-100 rounded-sm shadow-md hover:shadow-none bg-blue-50 hover:translate-y-0.5">
            <p>Connect Printful store</p>
            <div className="w-8">
              <PrintfulLogo />
            </div>
          </button>
        </a>
      </div>
    </>
  )
}

export default CreateFormPrintful

/** TODO:
  - Connect printful account
    - Auth with printful
    - Store access token in db
  - Link printful items with slicer product -> store in db
  - Automatically set delivery info for delivery
  - Add optional printful order submission on redeem
    - Refresh auth token if expired
*/
