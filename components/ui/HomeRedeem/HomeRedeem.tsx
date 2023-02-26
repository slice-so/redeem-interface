import { useRouter } from "next/router"
import {
  Button,
  Input,
  VerifiedBlock,
  RedeemForm,
  DoubleText,
  ProductPreview
} from "@components/ui"
import { useEffect, useState } from "react"
import Link from "next/link"
import Spinner from "@components/icons/Spinner"

export type LinkedProducts = {
  accountId: string
  product: any
  variants: any[]
}[]

const HomeRedeem = () => {
  const router = useRouter()
  const { slicer, product } = router.query

  const [slicerId, setSlicerId] = useState(0)
  const [productId, setProductId] = useState(1)
  const [isProductUnredeemable, setIsProductUnredeemable] = useState(false)
  const [loading, setLoading] = useState(false)
  const [productData, setProductData] = useState(null)

  const checkProduct = async (
    slicerId: number | string,
    productId: number | string
  ) => {
    setIsProductUnredeemable(false)
    setLoading(true)

    try {
      const fetcher = (await import("@utils/fetcher")).default
      const { data } = await fetcher(
        `/api/redeem?slicerId=${slicerId}&productId=${productId}`
      )

      if (data) {
        setProductData(data)
      } else {
        setIsProductUnredeemable(true)
      }
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

  useEffect(() => {
    slicer && setSlicerId(Number(slicer))
    product && setProductId(Number(product))
    if (slicer && product) {
      checkProduct(String(slicer), String(product))
    }
  }, [slicer, product])

  return (
    <>
      {!productData && (
        <>
          <div className="pb-16 text-center">
            <h1 className="pb-6">
              <DoubleText
                inactive
                size="text-4xl sm:text-5xl"
                logoText="Slice Redeem"
              />
            </h1>
            <p className="sm:text-lg">
              Claim products after purchasing them on Slice
            </p>
          </div>
          {!loading ? (
            <>
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
                label="Redeem product"
                wrapperClassName="mt-8 mb-12"
                onClick={() => checkProduct(slicerId, productId)}
              />
            </>
          ) : (
            <div className="flex justify-center">
              <Spinner size="w-10 h-10" />
            </div>
          )}
          {isProductUnredeemable && (
            <div className="space-y-3 text-sm">
              <p className="font-semibold text-yellow-600">
                This product does not exist or a redeem process has not been set
                up yet
              </p>
              <p>
                If you own the product{" "}
                <Link href={`/create?slicer=${slicerId}&product=${productId}`}>
                  <a className="highlight">click here to set up a form</a>
                </Link>
              </p>
            </div>
          )}
        </>
      )}
      {productData && (
        <>
          <div className="pb-12">
            <ProductPreview slicerId={slicerId} productId={productId} />
            <a
              className="text-sm highlight"
              onClick={() => setProductData(null)}
            >
              Redeem another product
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
            <RedeemForm
              slicerId={slicerId}
              productId={productId}
              questions={productData.questions}
              linkedProducts={productData.linkedProducts}
            />
          </VerifiedBlock>
        </>
      )}
    </>
  )
}

export default HomeRedeem
