import Check from "@components/icons/Check"
import Image from "next/image"
import { Dispatch, SetStateAction } from "react"

type Props = {
  index: number
  item: any
  shownItemIndex: number
  setShownItemIndex: Dispatch<SetStateAction<number>>
  linkedProducts: any
}

export default function PrintfulItem({
  index,
  item,
  shownItemIndex,
  setShownItemIndex,
  linkedProducts
}: Props) {
  return (
    <div className="flex-shrink-0 w-40 pb-4">
      <div
        className="relative cursor-pointer group"
        onClick={() =>
          setShownItemIndex(shownItemIndex == index ? null : index)
        }
      >
        <Image
          src={item.thumbnail_url}
          width={200}
          height={200}
          alt={item.name + " image"}
          className="rounded-md"
        />
        <p
          className={`pt-2 text-sm font-medium text-gray-500 group-hover:underline ${
            shownItemIndex == index ? " underline" : ""
          }`}
        >
          {item.name}
        </p>
        {linkedProducts.length != 0 &&
          linkedProducts.findIndex(
            (linkedProduct) => linkedProduct.product.id == item.id
          ) != -1 && (
            <div className="absolute top-[8px] rounded-full nightwind-prevent bg-blue-600 p-[3px] right-[8px] text-white w-5 h-5">
              <Check />
            </div>
          )}
      </div>
    </div>
  )
}
