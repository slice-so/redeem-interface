export const base = {
  id: 8453,
  name: "Base Mainnet",
  network: "base",
  nativeCurrency: {
    decimals: 18,
    name: "Base",
    symbol: "ETH"
  },
  rpcUrls: {
    public: { http: ["https://developer-access-mainnet.base.org"] },
    default: { http: ["https://developer-access-mainnet.base.org"] }
  },
  blockExplorers: {
    etherscan: { name: "BaseScan", url: "https://basescan.org/" },
    default: { name: "BaseScan", url: "https://basescan.org/" }
  }
} as const
