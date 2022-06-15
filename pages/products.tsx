import { NextSeo } from "next-seo"
import {
  Container,
  DoubleText,
  ProductsList,
  VerifiedBlock
} from "@components/ui"
import {
  defaultDescription,
  defaultTitle,
  longTitle,
  domain
} from "@components/common/Head"

export default function Products() {
  return (
    <>
      <NextSeo
        title="Decentralized slicing platform"
        openGraph={{
          title: longTitle,
          description: defaultDescription,
          url: domain,
          images: [
            {
              url: `${domain}/og_image.jpg`,
              width: 1000,
              height: 1000,
              alt: `${defaultTitle} cover image`
            }
          ]
        }}
      />
      <Container page={true}>
        <main className="max-w-screen-lg pb-16 mx-auto text-center">
          <h1 className="pb-6">
            <DoubleText
              inactive
              size="text-4xl sm:text-5xl"
              logoText="Your products"
            />
          </h1>
        </main>
        <VerifiedBlock
          beforeConnect={
            <p className="pb-6 font-semibold text-yellow-600">
              Connect your wallet to proceed
            </p>
          }
          beforeSign={
            <p className="pb-6 font-semibold text-yellow-600">
              Sign the message to verify ownership of your address
            </p>
          }
        >
          <div className="max-w-md mx-auto">
            <ProductsList />
          </div>
        </VerifiedBlock>
      </Container>
    </>
  )
}
