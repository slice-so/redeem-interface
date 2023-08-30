import Image from "next/image"
import Check from "@components/icons/Check"
import productDefault from "public/product_default.png"

type Props = {
  image: string
  name: string
  children?: JSX.Element
  topRight?: JSX.Element
  isSelected?: boolean
  onClick?: (...args: any[]) => any
  onClickIncrease?: (...args: any[]) => any
  onClickDecrease?: (...args: any[]) => any
  width?: number
  height?: number
  truncate?: boolean
}

const ListElement = ({
  children,
  topRight,
  onClick,
  image,
  name,
  isSelected,
  width,
  height,
  truncate = true
}: Props) => {
  return (
    <div className="flex-shrink-0 w-40 sm:w-48">
      <div className="relative group">
        {topRight && (
          <span
            title="Purchases"
            className="absolute text-sm z-10 flex items-center nightwind-prevent bg-white bg-opacity-75 backdrop-blur-sm shadow-md h-[32px] cursor-pointer top-0 left-0 rounded-br-xl rounded-tl-lg px-[18px] text-indigo-600"
            onClick={onClick}
          >
            {topRight}
          </span>
        )}
        <Image
          src={image || productDefault}
          alt={name + " image"}
          className={`rounded-lg h-32 sm:h-36 img-background cursor-pointer object-cover duration-100 ${
            isSelected ? "opacity-100" : "opacity-80"
          }`}
          width={width}
          height={height}
          onClick={onClick}
        />
        <p
          className={`text-sm py-3 font-medium text-gray-500 ${
            truncate ? "truncate" : ""
          }`}
        >
          {name}
        </p>
        {children}
        <div
          className={`absolute top-[8px] rounded-full nightwind-prevent p-[3px] right-[8px] text-white w-5 h-5 cursor-pointer border border-white ${
            isSelected ? "bg-green-500" : "bg-gray-400"
          }`}
          onClick={onClick}
        >
          {isSelected ? <Check /> : null}
        </div>
      </div>
    </div>
  )
}

export default ListElement
