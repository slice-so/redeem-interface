import { Client } from "@xmtp/xmtp-js"
import { Wallet } from "ethers"

const sendBaseMessage = async (message: string, recipient: string) => {
  const wallet = Wallet.fromMnemonic(
    process.env.COINBASE_MESSAGE_WALLET_MNEMONIC
  )
  // Create the client with your wallet. This will connect to the XMTP development network by default
  const xmtp = await Client.create(wallet, { env: "production" })

  // Start a conversation with XMTP
  const conversation = await xmtp.conversations.newConversation(recipient)

  await conversation.send(message)
}

export default sendBaseMessage
