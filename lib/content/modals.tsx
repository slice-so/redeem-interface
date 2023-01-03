import { DoubleText, SubmissionBlock } from "@components/ui"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import saEvent from "@utils/saEvent"

export type View = {
  name: ViewNames
  cross?: boolean
  params?: object
}
type ViewNames = "" | "NETWORK_VIEW" | "SUBMISSIONS_VIEW"

export const NETWORK_VIEW = () => {
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID

  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl">Pick the right chain</h1>
        <div className="py-8">
          <p>
            Connect to the{" "}
            <b>{chainId === "5" ? "Goerli Testnet" : "Ethereum Mainnet"}</b>{" "}
            Network
          </p>
        </div>
        <div
          className="flex justify-center"
          onClick={() => saEvent("connect_wallet_attempt")}
        >
          <ConnectButton
            accountStatus={{
              smallScreen: "address",
              largeScreen: "full"
            }}
            chainStatus="full"
            showBalance={false}
          />
        </div>
      </div>
    </>
  )
}

export const SUBMISSIONS_VIEW = (params: any) => {
  const { slicerId, productId, submissions } = params
  const orderedSubmissions = submissions.sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  )

  return (
    <>
      <div className="pb-6 text-center">
        <DoubleText inactive logoText="Submissions" />
        <p className="pt-4 text-sm font-semibold text-gray-500 uppercase">
          #{slicerId}/{productId}
        </p>
      </div>
      <div className="flex justify-between p-4 text-sm font-medium text-gray-500">
        <p className="col-span-2 ">Buyer</p>
        <p className="text-center ">Units Redeemed</p>
        <p className="col-span-2 text-right">Date</p>
      </div>
      <ul className="space-y-4">
        {orderedSubmissions.map((submission) => (
          <SubmissionBlock key={submission.id} submission={submission} />
        ))}
      </ul>
    </>
  )
}
