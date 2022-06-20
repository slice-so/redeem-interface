import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Button, Input, CreateForm, VerifiedBlock } from "@components/ui"
import { useAppContext } from "../context"
import client from "@utils/apollo-client"
import { gql } from "@apollo/client"
import decimalToHex from "@utils/decimalToHex"

const CreateRedeemForm = () => {
  const router = useRouter()
  const { slicer, product } = router.query
  const { account } = useAppContext()

  const [slicerValue, setSlicerValue] = useState(0)
  const [productValue, setProductValue] = useState(1)
  const [loading, setLoading] = useState(false)
  const [productCreator, setProductCreator] = useState(null)
  const [initData, setInitData] = useState(null)

  const verifyOwnerhsip = async (slicerId: number, productId: number) => {
    setProductCreator(null)
    setLoading(true)
    const fetcher = (await import("@utils/fetcher")).default
    const hexId = `${decimalToHex(Number(slicerId))}-${decimalToHex(
      Number(productId)
    )}`

    try {
      const { data } = await fetcher(
        `/api/form?slicerId=${slicerId}&productId=${productId}`
      )
      if (data) {
        setInitData(data)
        setProductCreator(data.creator.toLowerCase())
      } else {
        setInitData(null)
        const tokensQuery = /* GraphQL */ `
          product (id: "${hexId}") {
            creator
          }`

        const { data: subgraphData } = await client.query({
          query: gql`
            query {
              ${tokensQuery}
            }
          `
        })
        const product = subgraphData?.product

        setProductCreator(product?.creator || "none")
      }
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

  useEffect(() => {
    if (account) {
      slicer && setSlicerValue(Number(slicer))
      product && setProductValue(Number(product))
      if (slicer && product) {
        verifyOwnerhsip(Number(slicer), Number(product))
      }
    }
  }, [slicer, product, account])

  return (
    <>
      {!productCreator || productCreator == "none" ? (
        <div className="max-w-sm mx-auto">
          <div className="flex justify-between gap-8">
            <Input
              label="Slicer"
              type="number"
              min={0}
              value={slicerValue}
              onChange={setSlicerValue}
            />
            <Input
              label="Product"
              type="number"
              min={1}
              value={productValue}
              onChange={setProductValue}
            />
          </div>
          <Button
            label="Verify ownership"
            wrapperClassName="mt-8 mb-12"
            loading={loading}
            onClick={() => verifyOwnerhsip(slicerValue, productValue)}
          />
          {productCreator == "none" && (
            <p className="font-semibold text-yellow-600">
              This product does not exist
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="pb-12">
            <div className="flex justify-between max-w-[14rem] gap-8 pb-4 mx-auto text-center">
              <div className="">
                <p>Slicer</p>
                <p className="pt-2 font-bold">{slicerValue}</p>
              </div>
              <div>
                <p>Product</p>
                <p className="pt-2 font-bold">{productValue}</p>
              </div>
            </div>
            <a
              className="text-sm highlight"
              onClick={() => setProductCreator(null)}
            >
              Create form for a different product
            </a>
          </div>
          <hr className="w-20 mx-auto mb-12 border-gray-300" />
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
              <CreateForm
                id={`${decimalToHex(slicerValue)}-${decimalToHex(
                  productValue
                )}`}
                productCreator={productCreator}
                initData={initData}
              />
            </div>
          </VerifiedBlock>
        </>
      )}
    </>
  )
}

export default CreateRedeemForm
