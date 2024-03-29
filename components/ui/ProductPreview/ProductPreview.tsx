import getBlurImageUrl from "@utils/getBlurImageUrl"
import { getSliceSubdomain } from "@utils/getSliceSubdomain"
import { useProduct } from "@utils/useProductData"
import Image from "next/image"
import productDefault from "public/product_default.png"

type Props = {
  slicerId: number
  productId: number
}

const ProductPreview = ({ slicerId, productId }: Props) => {
  const { data: productData } = useProduct(slicerId, productId)

  return (
    <div className="mb-6 text-center">
      {productData ? (
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
              blurDataURL={
                productData.image && getBlurImageUrl(productData.image)
              }
              className="rounded-lg img-background object-cover"
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
      )}
    </div>
  )
}

export default ProductPreview
