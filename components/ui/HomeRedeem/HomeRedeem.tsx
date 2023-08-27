import { Purchase, getPurchases } from "@utils/getPurchases"
import { useAppContext } from "../context"
import { useEffect, useState } from "react"

const HomeRedeem = () => {
  const { account } = useAppContext()
  const [purchases, setPurchases] = useState<Purchase[]>([])

  useEffect(() => {
    getPurchases(account, setPurchases)
  }, [account])

  return <></>
}

export default HomeRedeem
