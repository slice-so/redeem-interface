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
  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)

  let chainData

  switch (chainId) {
    case 1:
      chainData = {
        label: "Ethereum Mainnet",
        url: "https://testnet.slice.so",
        altLabel: "Ethereum Goerli (testnet)"
      }
      break
    case 5:
      chainData = {
        label: "Ethereum Goerli (testnet)",
        url: "https://slice.so",
        altLabel: "Ethereum Mainnet"
      }
      break
    case 10:
      chainData = {
        label: "Optimism",
        url: "https://slice.so",
        altLabel: "Ethereum Mainnet"
      }
      break
    case 8453:
      chainData = {
        label: "Base",
        url: "https://slice.so",
        altLabel: "Ethereum Mainnet"
      }
      break
    case 84531:
      chainData = {
        label: "Base Goerli (testnet)",
        url: "https://base.slice.so",
        altLabel: "Base Mainnet"
      }
      break
  }

  return (
    <div className="text-center">
      <div className="pb-6">
        <DoubleText inactive logoText="Pick the right chain" />
      </div>
      <p className="text-lg">
        Connect to the <span className="font-black">{chainData.label}</span>{" "}
        Network
      </p>
      <div
        className="flex justify-center pt-6"
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

      <p className="pt-6 text-gray-600">
        Or go to{" "}
        <a
          href={chainData.url}
          target="_blank"
          rel="noreferrer"
          className="highlight"
        >
          {chainData.altLabel}
        </a>
      </p>
    </div>
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
        <p className="pt-4 text-sm font-medium text-center text-gray-400">
          Slicer {slicerId} / Product {productId}
        </p>
      </div>
      <div className="grid items-center justify-between grid-cols-5 p-4 text-sm font-medium text-gray-500">
        <p className="">#</p>
        <p className="col-span-3 text-center ">Redeemed units</p>
        <p className="text-right">Date</p>
      </div>
      <ul className="space-y-4">
        {orderedSubmissions.map((submission, index) => (
          <SubmissionBlock
            key={submission.id}
            submission={submission}
            index={index}
          />
        ))}
      </ul>
    </>
  )
}
