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

  useEffect(() => {
    slicer && setSlicerValue(Number(slicer))
    product && setProductValue(Number(product))
  }, [slicer, product])

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
          label="Check product"
          wrapperClassName="my-10"
          loading={loading}
          onClick={() => checkProduct()}
        />
        {isProductUnredeemable && (
          <div className="space-y-3">
            <p className="text-red-600">
              Product does not exist or a claim process has not been set up.
            </p>
            <p>
              If you&apos;re the creator of the product, you can{" "}
              <Link
                href={`/setup?slicerId=${slicerValue}&productId=${productValue}`}
              >
                <a className="highlight">set up a custom redeem form here</a>
              </Link>
              .
            </p>
          </div>
        )}
      </div>
      {showRedeemForm && productData && (
        <VerifiedBlock>
          <RedeemForm
          // productData={productData}
          />
        </VerifiedBlock>
      )}
    </>
  )
}

export default HomeRedeem
