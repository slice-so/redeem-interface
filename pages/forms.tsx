import {
  Container,
  DoubleText,
  ProductsList,
  VerifiedBlock
} from "@components/ui"

export default function Products() {
  return (
    <>
      <Container page={true}>
        <main>
          <h1 className="pb-12">
            <DoubleText
              inactive
              size="text-3xl sm:text-4xl"
              logoText="My forms"
            />
          </h1>
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
        </main>
      </Container>
    </>
  )
}
