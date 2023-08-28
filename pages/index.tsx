import { NextSeo } from "next-seo"
import {
  Container,
  DoubleText,
  HomeRedeem,
  VerifiedBlock
} from "@components/ui"
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
      <Container page={true} size="max-w-screen-md">
        <main>
          <div>
            <h1 className="pb-12">
              <DoubleText
                inactive
                size="text-4xl sm:text-5xl"
                logoText="Redeem Products"
              />
            </h1>
          </div>
          <VerifiedBlock>
            <HomeRedeem />
          </VerifiedBlock>
        </main>
      </Container>
    </>
  )
}
