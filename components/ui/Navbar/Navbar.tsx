import Link from "next/link"
import { useRouter } from "next/router"
// import { signIn, useSession } from "next-auth/client"
import Logo from "@components/icons/Logo"
// import Nightwind from "@components/icons/Nightwind"
import { Container } from "@components/ui"

const Navbar = () => {
  // const [session, loading] = useSession()
  // const router = useRouter()

  return (
    <header className="shadow-sm bg-gray-50">
      <Container>
        <nav className="relative px-3 sm:px-6 h-[4.25rem] items-center mx-auto flex justify-between">
          <div className="flex items-center space-x-7 sm:space-x-10">
            <Link href="/">
              <a>
                <Logo className="mr-10 h-7" />
              </a>
            </Link>
          </div>
          {/* <div className="flex items-center">
            <Nightwind size="h-7" />
          </div> */}
        </nav>
      </Container>
      <hr className="w-full border-gray-200" />
    </header>
  )
}

export default Navbar
