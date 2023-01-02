import { Container, DoubleText, CreateRedeemForm } from "@components/ui"

export default function Create() {
  return (
    <Container page={true} size="max-w-screen-sm">
      <main>
        <h1 className="pb-10">
          <DoubleText
            inactive
            size="text-3xl sm:text-4xl"
            logoText="Create form"
          />
        </h1>

        <CreateRedeemForm />
      </main>
    </Container>
  )
}
