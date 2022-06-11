import Link from "next/link"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Logo from "@components/icons/Logo"
import Nightwind from "@components/icons/Nightwind"
import { Container } from "@components/ui"

const Navbar = () => {
  // const [session, loading] = useSession()
  // const router = useRouter()

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
            <Nightwind size="h-[24px]" />
            <div onClick={() => sa_event("connect_wallet_attempt")}>
              <ConnectButton
                accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "full"
                }}
              />
            </div>
          </div>
        </nav>
      </Container>
      <hr className="w-full border-gray-200" />
    </header>
  )
}

export default Navbar
