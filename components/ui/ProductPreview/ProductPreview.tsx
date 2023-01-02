import getBlurImageUrl from "@utils/getBlurImageUrl"
import { useProductData } from "@utils/useProductData"
import Image from "next/future/image"

type Props = {
  slicerId: number
  productId: number
}

const ProductPreview = ({ slicerId, productId }: Props) => {
  const productData = useProductData(slicerId, productId)

  return (
    <div className="mb-6 text-sm text-center">
      <a
        className="font-medium text-gray-400"
        href={`https://${
          process.env.NEXT_PUBLIC_CHAIN_ID == "5" ? "testnet." : ""
        }slice.so/slicer/${slicerId}?product=${productId}`}
        target="_blank"
        rel="noreferrer"
      >
        Slicer {slicerId} / Product {productId}
      </a>
      {productData ? (
        <>
          <div className="relative h-48 mx-auto mt-2 mb-4 w-72">
            <Image
              src={productData.image}
              alt={`${productData.name || "placeholder"} image`}
              blurDataURL={getBlurImageUrl(productData.image)}
              className="object-cover rounded-lg "
              placeholder="blur"
              fill={true}
            />
          </div>
          <p>{productData.shortDescription}</p>
        </>
      ) : (
        <>
          <div className="h-48 mx-auto mt-2 mb-4 bg-gray-400 rounded-lg w-72 animate-pulse" />
          <div className="w-64 h-6 mx-auto bg-gray-400 rounded-md animate-pulse" />
        </>
      )}
    </div>
  )
}

export default ProductPreview
