import getBlurImageUrl from "@utils/getBlurImageUrl"
import { Purchase } from "@utils/getPurchases"
import { getSliceSubdomain } from "@utils/getSliceSubdomain"
import { useProductData } from "@utils/useProductData"
import Image from "next/future/image"
import productDefault from "public/product_default.png"

type Props = {
  slicerId: number
  productId: number
}

const ProductPreview = ({ slicerId, productId }: Props) => {
  const productDataArray = useProductData([{ slicerId, productId }])
  // const productData = productDataArray[0]

  return (
    <div className="mb-6 text-center">
      {/* {productData ? (
        <>
          <a
            className="font-semibold"
            href={`https://${getSliceSubdomain()}slice.so/slicer/${slicerId}?product=${productId}`}
            target="_blank"
            rel="noreferrer"
          >
            {productData.name}
          </a>
          <div className="relative h-48 mx-auto mt-2 mb-4 w-72">
            <Image
              src={productData.image || productDefault}
              alt={`${productData.name || "placeholder"} image`}
              blurDataURL={getBlurImageUrl(productData.image)}
              className="object-cover rounded-lg"
              placeholder="blur"
              fill={true}
            />
          </div>
          <p className="text-sm">{productData.shortDescription}</p>
        </>
      ) : (
        <>
          <div className="w-32 h-5 mx-auto bg-gray-400 rounded-md animate-pulse" />
          <div className="h-48 mx-auto mt-2 mb-4 bg-gray-400 rounded-lg w-72 animate-pulse" />
          <div className="w-64 h-5 mx-auto bg-gray-400 rounded-md animate-pulse" />
        </>
      )} */}
    </div>
  )
}

export default ProductPreview
