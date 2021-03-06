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
