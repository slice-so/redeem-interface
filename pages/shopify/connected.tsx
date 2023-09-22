import Spinner from "@components/icons/Spinner"
import { Button, Container, DoubleText, VerifiedBlock } from "@components/ui"
import fetcher from "@utils/fetcher"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"

export default function Shopify() {
  const router = useRouter()
  const { hmac, code, host, shop, timestamp, state } = router.query
  const { address } = useAccount()
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState("")

  async function verifyAndSave() {
    try {
      const res = await fetcher("/api/shopify", {
        method: "POST",
        body: JSON.stringify({
          hmac,
          host,
          shop,
          timestamp,
          code,
          state
        })
      })

      if (res?.status === "verified") {
        setVerified(true)
      }
    } catch (error) {
      setError("Installation not valid")
    }
  }

  useEffect(() => {
    if (hmac && host && shop && timestamp && code && state) {
      if (state === address) {
        verifyAndSave()
      } else {
        setError("Installation not valid")
      }
    }
  }, [hmac, host, shop, timestamp])

  return (
    <>
      <Container page={true}>
        <main>
          <h1 className="pb-12">
            <DoubleText
              inactive
              size="text-3xl sm:text-4xl"
              logoText="Connect your Shopify store"
            />
          </h1>
          <VerifiedBlock>
            <div className="py-6 rounded-md shadow-md bg-gray-50">
              <div className="max-w-md mx-auto">
                {!verified && !error && (
                  <div className="text-center">
                    <div className="mb-4 text-2xl font-bold">
                      Verifying your installation
                    </div>
                    <div className="flex items-center justify-center w-full mb-4">
                      <Spinner />
                    </div>
                    <div className="text-sm text-gray-600">
                      Please wait while we verify your installation.
                    </div>
                  </div>
                )}
                {error && (
                  <div className="text-center text-red-600">{error}</div>
                )}
                {verified && (
                  <div>
                    <p className="mb-4">
                      You have successfully connected your Shopify store, start
                      by associating your shopify products with your slicer
                      products.
                    </p>
                    <div className="flex justify-center">
                      <Button
                        label={"Create a new form"}
                        onClick={() => router.push("/create")}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </VerifiedBlock>
        </main>
      </Container>
    </>
  )
}
