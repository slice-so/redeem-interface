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
      <Container page={true} size="max-w-screen-xs">
        <main>
          <HomeRedeem />
        </main>
      </Container>
    </>
  )
}

// TODO:
// - Footer (update links, remove unneeded, add slice)
// - Create form styling
// - Redeem form styling
