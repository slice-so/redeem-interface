import { ThemeProvider } from "next-themes"
import Head from "@components/common/Head"
import { Background, Layout } from "@components/ui"
import "../styles/global/styles.scss"
import { AppWrapper } from "@components/ui/context"
import { AppProps } from "next/dist/shared/lib/router/router"

import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme
} from "@rainbow-me/rainbowkit"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { infuraProvider } from "wagmi/providers/infura"
import { publicProvider } from "wagmi/providers/public"
import { createClient, configureChains, WagmiConfig } from "wagmi"
import { mainnet, goerli } from "wagmi/chains"
import "@rainbow-me/rainbowkit/styles.css"

const defaultChains =
  process.env.NEXT_PUBLIC_CHAIN_ID === "5" ? [goerli] : [mainnet]

const { chains, provider } = configureChains(defaultChains, [
  infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_ID }),
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
  publicProvider()
])

const { connectors } = getDefaultWallets({
  appName: "Slice Redeem",
  chains
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head />
      <ThemeProvider
        attribute="class"
        storageKey="nightwind-mode"
        defaultTheme="system"
      >
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider
            chains={chains}
            theme={
              // isDark
              //   ? midnightTheme({
              //       accentColor: "#2563eb",
              //       accentColorForeground: "white",
              //       borderRadius: "medium"
              //     })
              //   :
              lightTheme({
                accentColor: "#2563eb",
                accentColorForeground: "white",
                borderRadius: "medium"
              })
            }
            showRecentTransactions={true}
            coolMode
          >
            <AppWrapper>
              <Layout>
                <Background />
                <Component {...pageProps} />
              </Layout>
            </AppWrapper>
          </RainbowKitProvider>
        </WagmiConfig>
      </ThemeProvider>
    </>
  )
}

export default MyApp
