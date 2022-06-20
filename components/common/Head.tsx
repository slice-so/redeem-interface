import { FC } from "react"
import NextHead from "next/head"
import { DefaultSeo } from "next-seo"
import { accounts } from "@components/ui/Social/Social"
import Script from "next/script"

export const defaultTitle = "Slice Redeem"
export const longTitle = "Slice Redeem – Claim purchased Slice products"
export const defaultDescription =
  "The decentralized payments infrastructure for projects, teams and communities. Sell and claim NFTs, tickets, merch and more on d-stores."
export const domain = process.env.NEXT_PUBLIC_APP_URL
const twitterAccount = accounts.twitter.split("twitter.com/").pop()

const Head: FC = () => {
  return (
    <>
      <DefaultSeo
        titleTemplate={`%s | ${defaultTitle}`}
        defaultTitle={longTitle}
        description={defaultDescription}
        openGraph={{
          site_name: longTitle,
          type: `website`,
          locale: `en_US`
        }}
        twitter={{
          handle: twitterAccount,
          site: twitterAccount,
          cardType: "summary_large_image"
        }}
      />
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="twitter:image" content={`${domain}/twitter_card.jpg`} />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="shortcut icon" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <Script
          id="sa_event"
          dangerouslySetInnerHTML={{
            __html: `window.sa_event=window.sa_event||function(){var a=[].slice.call(arguments);window.sa_event.q?window.sa_event.q.push(a):window.sa_event.q=[a]};`
          }}
        />
      </NextHead>
    </>
  )
}

export default Head
