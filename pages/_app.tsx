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
import { createConfig, configureChains, WagmiConfig } from "wagmi"
import { mainnet, goerli } from "wagmi/chains"
import "@rainbow-me/rainbowkit/styles.css"

const alchemyId = String(process.env.NEXT_PUBLIC_ALCHEMY_ID)
const infuraId = String(process.env.NEXT_PUBLIC_INFURA_ID)

const customChains = [
  process.env.NEXT_PUBLIC_CHAIN_ID === "5" ? goerli : mainnet
]
const { chains, publicClient } = configureChains(customChains, [
  infuraProvider({ apiKey: infuraId }),
  alchemyProvider({ apiKey: alchemyId }),
  publicProvider()
])

const { connectors } = getDefaultWallets({
  appName: "Slice Redeem",
  projectId: "d3fea506303b8d4b4d9a441d9786886a",
  chains
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
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
        <WagmiConfig config={wagmiConfig}>
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
