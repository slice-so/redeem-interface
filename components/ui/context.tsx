import { colorList, darkColorList } from "@utils/colorList"
import { createContext, useContext, useEffect, useState } from "react"
import { View } from "@lib/content/modals"
import { useAccount, useNetwork, useProvider } from "wagmi"

const AppContext = createContext<any>({
  provider: null,
  isConnected: false,
  isSigned: false,
  account: "",
  color1: colorList[0],
  color2: colorList[1],
  darkColor1: darkColorList[0],
  darkColor2: darkColorList[1],
  modalView: { name: "" },
  setIsSigned: () => null,
  setModalView: () => null,
  shuffleColors: () => null
})

export function AppWrapper({ children }) {
  const [modalView, setModalView] = useState<View>({ name: "" })
  const provider = useProvider()
  const { chain } = useNetwork()

  const { address: account } = useAccount()
  const [isConnected, setIsConnected] = useState(false)
  const [isSigned, setIsSigned] = useState(false)

  const [color1, setColor1] = useState([])
  const [color2, setColor2] = useState([])
  const [darkColor1, setDarkColor1] = useState([])
  const [darkColor2, setDarkColor2] = useState([])

  const shuffleColors = () => {
    const random1 = Math.floor(Math.random() * colorList.length)
    const random2 = Math.floor(Math.random() * colorList.length)
    setColor1(colorList[random1])
    setColor2(colorList[random2])
    setDarkColor1(darkColorList[random1])
    setDarkColor2(darkColorList[random2])

    let root = document.documentElement
    root.style.setProperty("--color1", colorList[random1][0])
    root.style.setProperty("--color2", colorList[random2][0])
    root.style.setProperty("--darkColor1", darkColorList[random1][0])
    root.style.setProperty("--darkColor2", darkColorList[random2][0])
  }

  useEffect(() => {
    shuffleColors()
  }, [])

  useEffect(() => {
    setIsConnected(account && true)

    if (account) {
      if (account && localStorage.getItem("isSigned") == account) {
        setIsSigned(true)
      } else {
        setIsSigned(false)
        localStorage.removeItem("isSigned")
      }
    } else {
      localStorage.removeItem("isSigned")
    }
  }, [account])

  // Network modal
  useEffect(() => {
    if (
      account &&
      chain &&
      Number(chain.id).toString(16) !== process.env.NEXT_PUBLIC_CHAIN_ID
    ) {
      setModalView({ cross: false, name: "NETWORK_VIEW" })
    } else {
      if (modalView.name == "NETWORK_VIEW") {
        setModalView({ name: "" })
      }
    }
  }, [account, chain])

  return (
    <AppContext.Provider
      value={{
        provider,
        account,
        isConnected,
        isSigned,
        setIsSigned,
        color1,
        color2,
        darkColor1,
        darkColor2,
        modalView,
        setModalView,
        shuffleColors
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}
