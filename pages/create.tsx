import { Container, DoubleText, CreateRedeemForm } from "@components/ui"

export default function Create() {
  return (
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
  )
}
