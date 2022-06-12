import { useRouter } from "next/router"
import { Button, Input, VerifiedBlock, RedeemForm } from "@components/ui"
import { useEffect, useState } from "react"
import Link from "next/link"

const HomeRedeem = () => {
  const router = useRouter()
  const { slicer, product } = router.query

  const [slicerValue, setSlicerValue] = useState(0)
  const [productValue, setProductValue] = useState(1)
  const [isProductUnredeemable, setIsProductUnredeemable] = useState(false)
  const [showRedeemForm, setShowRedeemForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [productData, setProductData] = useState(null)

  const checkProduct = async () => {
    setIsProductUnredeemable(false)
    setShowRedeemForm(false)
    setLoading(true)
    const fetcher = (await import("@utils/fetcher")).default

    const { data } = await fetcher(
      `/api/redeem?slicerId=${slicerValue}&productId=${productValue}`
    )

    if (data) {
      setProductData(data)
      setShowRedeemForm(true)
    } else {
      setIsProductUnredeemable(true)
    }

    setLoading(false)
  }

  useEffect(() => {
    slicer && setSlicerValue(Number(slicer))
    product && setProductValue(Number(product))
    if (slicer && product) {
      checkProduct()
    }
  }, [slicer, product])

  return (
    <>
      <div className="max-w-sm mx-auto ">
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
          label={showRedeemForm ? "Check new product" : "Check product"}
          wrapperClassName="mt-8 mb-12"
          loading={loading}
          onClick={() => checkProduct()}
        />
        {isProductUnredeemable && (
          <div className="space-y-3">
            <p className="font-semibold text-yellow-600">
              This product does not exist or a redeem process has not been set
              up yet.
            </p>
            <p>
              If you own the product{" "}
              <Link
                href={`/create?slicerId=${slicerValue}&productId=${productValue}`}
              >
                <a className="highlight">
                  click here to set up a custom redeem form
                </a>
              </Link>
              .
            </p>
          </div>
        )}
      </div>
      {showRedeemForm && productData && (
        <VerifiedBlock
          beforeConnect={
            <p className="pb-6 font-semibold text-yellow-600">
              1. Connect your wallet to proceed
            </p>
          }
          beforeSign={
            <p className="pb-6 font-semibold text-yellow-600">
              2. Sign the message to verify ownership of your address
            </p>
          }
        >
          <RedeemForm
          // productData={productData}
          />
        </VerifiedBlock>
      )}
    </>
  )
}

export default HomeRedeem
