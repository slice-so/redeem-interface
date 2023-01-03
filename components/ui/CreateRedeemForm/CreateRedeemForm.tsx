import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import {
  Button,
  Input,
  CreateForm,
  VerifiedBlock,
  ProductPreview,
  DoubleText
} from "@components/ui"
import { useAppContext } from "../context"
import client from "@utils/apollo-client"
import { gql } from "@apollo/client"
import decimalToHex from "@utils/decimalToHex"
import fetcher from "@utils/fetcher"
import { Account } from "@prisma/client"

const CreateRedeemForm = () => {
  const router = useRouter()
  const { slicer, product, state, code, success } = router.query
  const { account } = useAppContext()

  const [slicerId, setSlicerId] = useState(0)
  const [productId, setProductId] = useState(1)
  const [loading, setLoading] = useState(false)
  const [productCreator, setProductCreator] = useState(null)
  const [initData, setInitData] = useState(null)
  const [printfulAccounts, setPrintfulAccounts] = useState<Account[]>(null)
  const stateValue = "1234" // TODO: Handle state

  const verifyOwnership = async (slicerId: number, productId: number) => {
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
      slicer && setSlicerId(Number(slicer))
      product && setProductId(Number(product))
      if (slicer && product) {
        verifyOwnership(Number(slicer), Number(product))
      }
    }
  }, [slicer, product, account])

  const getPrintfulAccounts = async () => {
    try {
      if (success == "1" && state == stateValue && code && account) {
        const body = {
          body: JSON.stringify({
            code,
            account
          }),
          method: "POST"
        }

        const data = await fetcher("/api/printful", body)
        if (data) setPrintfulAccounts(data?.accounts)
      } else if (account) {
        const data = await fetcher("/api/printful?account=" + account)
        if (data) setPrintfulAccounts(data?.accounts)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getPrintfulAccounts()
  }, [success, state, code, account])

  return (
    <>
      <h1 className="pb-10">
        <DoubleText
          inactive
          size="text-3xl sm:text-4xl"
          logoText={
            !productCreator || productCreator == "none" || !initData
              ? "Create form"
              : "Edit form"
          }
        />
      </h1>
      {!productCreator || productCreator == "none" ? (
        <div className="mx-auto">
          <div className="flex justify-between gap-8">
            <Input
              label="Slicer"
              type="number"
              min={0}
              value={slicerId}
              onChange={setSlicerId}
            />
            <Input
              label="Product"
              type="number"
              min={1}
              value={productId}
              onChange={setProductId}
            />
          </div>
          <Button
            label="Verify ownership"
            wrapperClassName="mt-8 mb-12"
            loading={loading}
            onClick={() => verifyOwnership(slicerId, productId)}
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
            <ProductPreview slicerId={slicerId} productId={productId} />

            <a
              className="text-sm highlight"
              onClick={() => setProductCreator(null)}
            >
              Change product
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
            <div className="mx-auto">
              <CreateForm
                id={`${decimalToHex(slicerId)}-${decimalToHex(productId)}`}
                productCreator={productCreator}
                initData={initData}
                stateValue={stateValue}
                accounts={printfulAccounts}
              />
            </div>
          </VerifiedBlock>
        </>
      )}
    </>
  )
}

export default CreateRedeemForm

// TODO: Solve issue related to questions type, preventing reading and writing to db

// TODO: Add product info from slice db, using card
