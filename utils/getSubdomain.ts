export const getSubdomain = () => {
  switch (process.env.NEXT_PUBLIC_CHAIN_ID) {
    case "5":
      return "testnet."
    case "8453":
      return "base."
    case "84531":
      return "base-testnet."
    default:
      return ""
  }
}
