import Check from "@components/icons/Check"
import Spinner from "@components/icons/Spinner"
import { Account } from "@prisma/client"
import fetcher from "@utils/fetcher"
import Image from "next/future/image"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Items } from "../CreateFormPrintful/CreateFormPrintful"

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
    <div className="w-[160px] flex-shrink-0 pb-4">
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
          linkedProducts[0].product.id == item.id && (
            <div className="absolute top-[8px] rounded-full bg-blue-600 p-[3px] right-[8px] text-white w-5 h-5">
              <Check />
            </div>
          )}
      </div>
    </div>
  )
}
