import { NextSeo } from "next-seo"
import { Container, DoubleText, CreateRedeemForm } from "@components/ui"
import {
  defaultDescription,
  defaultTitle,
  longTitle,
  domain
} from "@components/common/Head"

export default function Create() {
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
              logoText="Create redeem form"
            />
          </h1>
          <p className="sm:text-lg">
            Set up a post-purchase step for your Slice product
          </p>
        </main>

        <CreateRedeemForm />
      </Container>
    </>
  )
}
