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
import {
  GetSiweMessageOptions,
  RainbowKitSiweNextAuthProvider
} from "@rainbow-me/rainbowkit-siwe-next-auth"
import { SessionProvider } from "next-auth/react"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { infuraProvider } from "wagmi/providers/infura"
import { publicProvider } from "wagmi/providers/public"
import { createConfig, configureChains, WagmiConfig, Chain } from "wagmi"
import { baseGoerli, goerli, mainnet, optimism } from "wagmi/chains"
import "@rainbow-me/rainbowkit/styles.css"
import { base } from "utils/chains"

const alchemyId = String(process.env.NEXT_PUBLIC_ALCHEMY_ID)
const infuraId = String(process.env.NEXT_PUBLIC_INFURA_ID)

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)
const customChains: () => Chain[] = () => {
  if (chainId == 1) {
    return [mainnet]
  } else if (chainId == 5) {
    return [goerli]
  } else if (chainId == 10) {
    return [optimism]
  } else if (chainId == 8453) {
    return [base]
  } else if (chainId == 84531) {
    return [baseGoerli]
  }
}

const { chains, publicClient } = configureChains(customChains(), [
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

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in to Slice"
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
          <SessionProvider refetchInterval={0} session={pageProps.session}>
            <RainbowKitSiweNextAuthProvider
              getSiweMessageOptions={getSiweMessageOptions}
            >
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
            </RainbowKitSiweNextAuthProvider>
          </SessionProvider>
        </WagmiConfig>
      </ThemeProvider>
    </>
  )
}

export default MyApp
