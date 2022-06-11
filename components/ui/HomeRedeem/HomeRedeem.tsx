import { useRouter } from "next/router"
import { Button, Input, VerifiedBlock, RedeemForm } from "@components/ui"
import { useEffect, useState } from "react"

const HomeRedeem = () => {
  const router = useRouter()
  const { slicer, product } = router.query

  const [slicerValue, setSlicerValue] = useState(0)
  const [productValue, setProductValue] = useState(0)
  const [productRedeemable, setProductRedeemable] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    slicer && setSlicerValue(Number(slicer))
    product && setProductValue(Number(product))
  }, [slicer, product])

  const checkProduct = () => {
    setLoading(true)

    setLoading(false)
  }

  return (
    <>
      <div className="flex justify-between max-w-sm gap-8 mx-auto">
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
          min={0}
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
      {productRedeemable && (
        <VerifiedBlock>
          <RedeemForm />
        </VerifiedBlock>
      )}
    </>
  )
}

export default HomeRedeem
