import Link from "next/link"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Logo from "@components/icons/Logo"
import Nightwind from "@components/icons/Nightwind"
import UserIcon from "@components/icons/UserIcon"
import { Container, DropdownMenu } from "@components/ui"
import { useAppContext } from "../context"
import { useEffect, useState } from "react"

const Navbar = () => {
  const { account } = useAppContext()
  const [showMenu, setShowMenu] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    if (account) {
      setShowMenu(true)
    } else {
      setShowMenu(false)
    }
  }, [account])

  return (
    <header className="shadow-sm bg-gray-50">
      <Container>
        <nav className="relative px-3 sm:px-6 h-[4.25rem] items-center mx-auto flex justify-between">
          <div className="relative z-10 flex items-center space-x-7 sm:space-x-10">
            <Link href="/">
              <a className="mb-1" aria-label="Slice logo">
                <Logo size="w-[24px]" />
              </a>
            </Link>
          </div>
          <div className="relative z-10 flex items-center space-x-6">
            <div>
              <Nightwind size="h-[24px]" />
            </div>
            <div onClick={() => sa_event("connect_wallet_attempt")}>
              <ConnectButton
                chainStatus="none"
                accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "full"
                }}
              />
            </div>
            {showMenu && (
              <a
                onClick={() => setShowDropdown((showDropdown) => !showDropdown)}
              >
                <UserIcon />
              </a>
            )}
          </div>
          {showDropdown && (
            <DropdownMenu
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
            />
          )}
        </nav>
      </Container>
      <hr className="w-full border-gray-200" />
    </header>
  )
}

export default Navbar
