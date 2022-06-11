import { useEffect } from "react"
import { useSignMessage } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { verifyMessage } from "ethers/lib/utils"
import { Button } from "@components/ui"
import { useAppContext } from "@components/ui/context"

const VerifiedBlock = ({ children }) => {
  const message = "gm wagmi frens"

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
    <div className="flex justify-center">
      <ConnectButton />
    </div>
  ) : !isAccountVerified ? (
    <div>
      <Button
        wrapperClassName="mb-6"
        label="Sign message"
        onClick={() => signMessage()}
      />
      {isLoading && <p>Loading...</p>}
      {isError && <div>Error signing message</div>}
    </div>
  ) : (
    children
  )
}

export default VerifiedBlock
