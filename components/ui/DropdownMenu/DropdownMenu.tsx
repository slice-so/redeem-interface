import Logo from "@components/icons/Logo"
import { Dispatch, SetStateAction } from "react"
import { DropdownMenuElement } from ".."
import File from "@components/icons/File"
import FileText from "@components/icons/FileText"
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
      className={`z-20 absolute text-sm top-0 right-0 w-56 mt-20 border border-gray-200 space-y-1 bg-white rounded-sm overflow-hidden shadow-base nightwind-prevent-block`}
      // ${
      //   showDropdown ? " opacity-100" : "-z-10 opacity-0"
      // }
    >
      <DropdownMenuElement
        href="/forms"
        image={
          <div className="w-5">
            <FileText />
          </div>
        }
        label="Your forms"
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
