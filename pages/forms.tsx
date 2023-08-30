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
          <VerifiedBlock>
            <div className="max-w-md mx-auto">
              <ProductsList />
            </div>
          </VerifiedBlock>
        </main>
      </Container>
    </>
  )
}
