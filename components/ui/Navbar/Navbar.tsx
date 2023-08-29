import Link from "next/link"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Logo from "@components/icons/Logo"
import Nightwind from "@components/icons/Nightwind"
import UserIcon from "@components/icons/UserIcon"
import { Container, DropdownMenu } from "@components/ui"
import { useAppContext } from "../context"
import { useEffect, useRef, useState } from "react"
import saEvent from "@utils/saEvent"
import { getSliceSubdomain } from "@utils/getSliceSubdomain"

const Navbar = () => {
  const { isConnected } = useAppContext()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClick(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClick)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClick)
    }
  }, [dropdownRef])

  return (
    <header className="shadow-sm">
      <Container>
        <nav className="relative px-3 sm:px-6 h-20 items-center mx-auto flex justify-between">
          <div className="z-10 flex items-center space-x-6 sm:space-x-8">
            <Link
              href={`https://${getSliceSubdomain()}slice.so`}
              aria-label="Slice logo"
            >
              <Logo className="w-6 h-6" />
            </Link>
            <Link
              href={`https://${getSliceSubdomain()}slice.so/slicer`}
              className="text-[0.925rem] font-medium"
            >
              Explore
            </Link>
          </div>
          <div className="relative z-10 flex items-center space-x-6">
            <div>
              <Nightwind size="h-[24px]" />
            </div>
            <div onClick={() => saEvent("connect_wallet_attempt")}>
              <ConnectButton
                label={isConnected ? "Sign message" : undefined}
                chainStatus="none"
                accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "full"
                }}
              />
            </div>
            {isConnected && (
              <a
                onClick={() => setShowDropdown((showDropdown) => !showDropdown)}
                ref={dropdownRef}
              >
                <UserIcon />
              </a>
            )}
          </div>
          {showDropdown && (
            <div className="absolute top-0 right-0" ref={dropdownRef}>
              <DropdownMenu setShowDropdown={setShowDropdown} />
            </div>
          )}
        </nav>
      </Container>
    </header>
  )
}

export default Navbar
