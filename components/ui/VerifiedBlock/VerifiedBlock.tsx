import { useEffect } from "react"
import { useSignMessage } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { verifyMessage } from "ethers/lib/utils"
import { Button } from "@components/ui"
import { useAppContext } from "@components/ui/context"

type Props = {
  children: JSX.Element
  beforeConnect?: JSX.Element
  beforeSign?: JSX.Element
}

const VerifiedBlock = ({ beforeConnect, beforeSign, children }: Props) => {
  const message = `Sign this message to prove you have access to this wallet in order to sign in to thegraph.com/studio.

  This won't cost you any Ether.
  
  Timestamp: Now`

  const { account, isAccountVerified, setIsAccountVerified } = useAppContext()
  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message
  })

  useEffect(() => {
    if (isSuccess) {
      setIsAccountVerified(verifyMessage(message, data) == account)
    }
  }, [isSuccess])

  return !account ? (
    <>
      {beforeConnect}
      <div className="flex justify-center">
        <ConnectButton />
      </div>
    </>
  ) : !isAccountVerified ? (
    <>
      {beforeSign}
      <div>
        <Button
          wrapperClassName="mb-6"
          label="Sign message"
          onClick={() => signMessage()}
        />
        {isLoading && <p>Loading...</p>}
        {isError && <div>Error signing message</div>}
      </div>
    </>
  ) : (
    children
  )
}

export default VerifiedBlock
