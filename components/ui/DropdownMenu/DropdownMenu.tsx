import Logo from "@components/icons/Logo"
import { Dispatch, SetStateAction } from "react"
import { DropdownMenuElement } from ".."
import File from "@components/icons/File"
import FileText from "@components/icons/FileText"
import ShoppingBag from "@components/icons/ShoppingBag"
import Banknotes from "@components/icons/Banknotes"
import { getSliceSubdomain } from "@utils/getSliceSubdomain"
import Package from "@components/icons/Package"
type Props = {
  setShowDropdown: Dispatch<SetStateAction<boolean>>
}

function DropdownMenu({ setShowDropdown }: Props) {
  // const { connector }: { connector: WalletConnect } = useAppContext()

  // const { theme, setTheme } = useTheme()

  // const toggle = () => {
  //   nightwind.beforeTransition()
  //   if (theme !== "dark") {
  //     setTheme("dark")
  //   } else {
  //     setTheme("light")
  //   }
  // }
  // const disconnect = async () => {
  //   if (connector.connected) {
  //     await connector.killSession()
  //     setShowDropdown(false)
  //   } else {
  //     setShowDropdown(false)
  //   }
  // }

  return (
    <div
      className={`z-20 absolute top-0 right-0 w-56 p-1.5 mt-20 border border-opacity-80 border-gray-200 space-y-1 bg-white rounded-lg shadow-base transition-opacity duration-200 nightwind-prevent-block`}
    >
      <DropdownMenuElement
        href={`https://${getSliceSubdomain()}slice.so/profile`}
        image={<Logo className="w-5 h-5" />}
        label="Slicers"
        onClick={() => setShowDropdown(false)}
      />
      <DropdownMenuElement
        href={`https://${getSliceSubdomain()}slice.so/earnings`}
        image={<Banknotes className="w-5 h-5" />}
        label="Earnings"
        onClick={() => setShowDropdown(false)}
      />
      <DropdownMenuElement
        href={`https://${getSliceSubdomain()}slice.so/purchases`}
        image={<ShoppingBag strokeWidth="1.5" className="w-5 h-5" />}
        label="Purchases"
        onClick={() => setShowDropdown(false)}
      />
      <DropdownMenuElement
        href="/"
        image={
          <div className="w-5">
            <Package />
          </div>
        }
        label="Redeem"
        onClick={() => setShowDropdown(false)}
      />
      <DropdownMenuElement
        href="/forms"
        image={
          <div className="w-5">
            <FileText />
          </div>
        }
        label="Forms"
        onClick={() => setShowDropdown(false)}
      />
      {/* <DropdownMenuElement
        href="/purchases"
        image={<ShoppingBag className="w-5 h-5 text-blue-300" />}
        label="Purchases"
        onClick={() => setShowDropdown(false)}
      /> */}
    </div>
  )
}

export default DropdownMenu
