import { NextSeo } from "next-seo"
import { Container, DoubleText, HomeRedeem } from "@components/ui"
import {
  defaultDescription,
  defaultTitle,
  longTitle,
  domain
} from "@components/common/Head"

export default function Home() {
  return (
    <>
      <NextSeo
        title="Claim purchased Slice products"
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
              logoText="Slice Redeem"
            />
          </h1>
          <p className="sm:text-lg">
            Claim products that require a post-purchase step
          </p>
        </main>

        <div className="max-w-md mx-auto">
          <HomeRedeem />
        </div>
      </Container>
    </>
  )
}
