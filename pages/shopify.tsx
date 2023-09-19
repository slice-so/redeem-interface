import { Container, DoubleText, VerifiedBlock } from "@components/ui"
import { useRouter } from "next/router"

export default function Products() {
  const router = useRouter()
  const { hmac, host, shop, timestamp } = router.query
  console.log(router.query)

  return (
    <>
      <Container page={true}>
        <main>
          <h1 className="pb-12">
            <DoubleText
              inactive
              size="text-3xl sm:text-4xl"
              logoText="Connect a Slicer to your Shopify store"
            />
          </h1>
          <VerifiedBlock>
            <div className="max-w-md mx-auto"></div>
          </VerifiedBlock>
        </main>
      </Container>
    </>
  )
}
