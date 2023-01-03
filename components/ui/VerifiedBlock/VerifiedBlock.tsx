import { useEffect, useState } from "react"
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
  const [timestamp] = useState(Date.now())
  const message = `Sign this message to prove you have access to this wallet in order to sign in to redeem.slice.so.

  This won't cost you any Ether.
  
  Timestamp: ${timestamp}`

  const { account, isConnected, isSigned, setIsSigned } = useAppContext()
  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message
  })

  useEffect(() => {
    if (isSuccess) {
      setIsSigned(verifyMessage(message, data) == account)
      localStorage.setItem("isSigned", account)
    }
  }, [isSuccess])

  return !isConnected ? (
    <>
      {beforeConnect}
      <div className="flex justify-center">
        <ConnectButton />
      </div>
    </>
  ) : !isSigned ? (
    <>
      {beforeSign}
      <div>
        <Button
          wrapperClassName="mb-6"
          label="Sign message"
          loading={isLoading}
          onClick={() => signMessage()}
        />
        {isError && <p className="text-red-500">Error signing message</p>}
      </div>
    </>
  ) : (
    children
  )
}

export default VerifiedBlock
