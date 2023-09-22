import Spinner from "@components/icons/Spinner"
import { Button, Container, DoubleText, VerifiedBlock } from "@components/ui"
import fetcher from "@utils/fetcher"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"

export default function Shopify() {
  const router = useRouter()
  const { hmac, host, shop, timestamp } = router.query
  const { address } = useAccount()
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState("")
  const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/shopify/connected`
  const scope =
    "read_products,write_products,read_orders,write_orders,read_draft_orders,write_draft_orders"
  const shopifyUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID}&scope=${scope}&redirect_uri=${redirectUrl}&state=${address}`

  async function verify() {
    const res = await fetcher("/api/shopify/verify", {
      method: "POST",
      body: JSON.stringify({
        hmac,
        host,
        shop,
        timestamp
      })
    })

    if (res.status === "verified") {
      setVerified(true)
    } else {
      setError("Installation not valid")
    }
  }

  useEffect(() => {
    if (hmac && host && shop && timestamp) {
      verify()
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
                    <div className="mb-4 text-2xl font-bold">
                      Installation verified
                    </div>
                    <p className="mb-4">Shop: {shop}</p>
                    <Button
                      label={"Connect"}
                      onClick={() => {
                        router.push(shopifyUrl)
                      }}
                    />
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
