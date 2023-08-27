import { Purchase, getPurchases } from "@utils/getPurchases"
import { useAppContext } from "../context"
import useSWR from "swr"
import fetcher from "@utils/fetcher"

const HomeRedeem = () => {
  const { account } = useAppContext()

  const { data } = useSWR(account ? `/api/products/${account}` : null, fetcher)
  console.log(data)

  return <></>
}

export default HomeRedeem
