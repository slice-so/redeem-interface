import { useEffect } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAppContext } from "@components/ui/context"
import { preload } from "swr"
import fetcher from "@utils/fetcher"
import { useSession } from "next-auth/react"
import { useDisconnect } from "wagmi"

type Props = {
  children: JSX.Element
  beforeConnect?: JSX.Element
  beforeSign?: JSX.Element
  preloadUrl?: string
}

const beforeConnectDefault = (
  <p className="pb-6 font-semibold text-yellow-600">
    Connect your wallet to proceed
  </p>
)

const beforeSignDefault = (
  <p className="pb-6 font-semibold text-yellow-600">
    Verify ownership of the connected address
  </p>
)

const VerifiedBlock = ({
  beforeConnect = beforeConnectDefault,
  beforeSign = beforeSignDefault,
  preloadUrl,
  children
}: Props) => {
  const { account, isConnected } = useAppContext()
  const { disconnect } = useDisconnect()
  const { data: session, status } = useSession()
  const authenticatedAddress = session?.["address"]

  useEffect(() => {
    if (authenticatedAddress && authenticatedAddress != account) {
      disconnect()
    } else {
      if (preloadUrl && account) {
        preload(preloadUrl + account, fetcher)
      }
    }
  }, [authenticatedAddress, account])

  return !isConnected || status != "authenticated" ? (
    <>
      {isConnected ? beforeSign : beforeConnect}
      <div className="flex justify-center">
        <ConnectButton label={isConnected ? "Sign message" : undefined} />
      </div>
    </>
  ) : (
    children
  )
}

export default VerifiedBlock
