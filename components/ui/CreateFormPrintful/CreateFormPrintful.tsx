import PrintfulLogo from "@components/icons/PrintfulLogo"
import { Account, Form, Prisma } from "@prisma/client"
import { Dispatch, SetStateAction, useState } from "react"
import MySwitch from "../MySwitch"
import PrintfulStore from "../PrintfulStore"
import Question from "../Question"

type Props = {
  stateValue: string
  accounts: Account[]
  linkedProducts: any
  setLinkedProducts: Dispatch<SetStateAction<any>>
  externalSettings: object
  setExternalSettings: Dispatch<SetStateAction<object>>
}
export type Items = { [accountId: string]: any[] }

export const clientId = process.env.NEXT_PUBLIC_PRINTFUL_CLIENT_ID

const CreateFormPrintful = ({
  stateValue,
  accounts,
  linkedProducts,
  setLinkedProducts,
  externalSettings,
  setExternalSettings
}: Props) => {
  const redirectUrl = process.env.NEXT_PUBLIC_APP_URL + "/create"
  const [printfulItems, setPrintfulItems] = useState<Items>({})

  const handleSetInstantOrder = (enabled: boolean) => {
    setExternalSettings({ ...externalSettings, instantOrder: enabled })
  }

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
                linkedProducts={linkedProducts}
                setLinkedProducts={setLinkedProducts}
              />
            ))}
        </ul>
      )}
      <div className="text-center">
        <a
          href={`https://www.printful.com/oauth/authorize?client_id=${clientId}&state=${stateValue}&redirect_url=${redirectUrl}`}
          className="inline-block mt-8 mb-4 text-sm text-black hover:text-black"
        >
          <button className="flex items-center justify-center gap-2 px-8 py-2 font-medium tracking-wide transition-all duration-100 rounded-sm shadow-md hover:shadow-none bg-blue-50 dark:hover:bg-opacity-70 hover:translate-y-0.5">
            <p>Connect Printful store</p>
            <div className="w-8">
              <PrintfulLogo />
            </div>
          </button>
        </a>
      </div>
      {linkedProducts.length != 0 && (
        <div className="relative flex items-center justify-end gap-2 pt-8">
          <p>Enable instant orders</p>
          <Question
            text={
              <div className="space-y-4 text-sm">
                <p>
                  If enabled, orders will be automatically processed and
                  fulfilled by Printful.
                </p>
                <p>
                  If disabled, each order will need to be manually confirmed
                  from your Printful dashboard first.
                </p>
                <p>
                  You can change this behaviour anytime by editing the form.
                </p>
                {process.env.NEXT_PUBLIC_CHAIN_ID == "5" && (
                  <p className="text-yellow-600">
                    Note: This feature can only be enabled on mainnet.
                  </p>
                )}
              </div>
            }
            position="bottom-0 right-0"
          />
          <MySwitch
            enabled={externalSettings["instantOrder"]}
            setEnabled={handleSetInstantOrder}
            disabled={process.env.NEXT_PUBLIC_CHAIN_ID == "5"}
          />
        </div>
      )}
    </>
  )
}

export default CreateFormPrintful
