import { FC } from "react"
// import Image from "next/image"

export interface Props {
  className?: string
}

const Background: FC<Props> = (props) => {
  const { className } = props
  const rootClassName = `absolute w-full h-full -z-10 bg-gradient-to-br from-white to-sky-50 ${
    className ? className : ""
  }`

  return (
    <div className={rootClassName}>
      {/* <div className="opacity-20">
        <Image
          src="/background.jpg"
          alt={`Sfondo ${serie.title}`}
          layout="fill"
          quality="85"
          priority
        />
      </div> */}
    </div>
  )
}

export default Background
