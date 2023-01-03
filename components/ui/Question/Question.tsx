import { useState } from "react"
import QuestionMark from "@components/icons/QuestionMark"

type Props = {
  text: string | JSX.Element
  position?: string
}

export default function Question({ text, position }: Props) {
  const [show, setShow] = useState(false)

  return (
    <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <div
        className={`${
          !show ? "hidden " : ""
        }prose text-left absolute p-5 text-sm w-[22rem] z-10 xs:w-96 bg-white shadow-xl ${
          position || "bottom-0 left-0"
        } mb-9 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700`}
      >
        {text}
      </div>
      <div className="p-2">
        <QuestionMark />
      </div>
    </div>
  )
}
