import Chevron from "@components/icons/Chevron"
import { Submission } from "@prisma/client"
import { useState } from "react"

type Props = {
  questions: string[]
  submission: Submission & { createdAt: string }
}

const SubmissionBlock = ({ questions, submission }: Props) => {
  const [isOpen, setIsOpen] = useState(true)

  const { buyer, redeemedUnits, createdAt, answers } = submission
  const date = new Date(createdAt).toLocaleDateString()
  const reducedAddress = buyer.replace(
    buyer.substring(5, buyer.length - 3),
    `\xa0\xa0\xa0\xa0\xa0\xa0`
  )

  return (
    <div className="py-3 transition-all duration-100 bg-gray-100 rounded-md shadow-md cursor-pointer group hover:shadow-sm hover:translate-y-[2px]" onClick={() => setIsOpen(!isOpen)}>
      <div className="grid items-center justify-between grid-cols-5 px-4 py-2">
        <p className="col-span-2">
          <a
            className="highlight"
            href={`https://etherscan.io/address/${buyer}`}
            target="_blank"
            rel="noreferrer"
          >
            {reducedAddress}
          </a>
        </p>
        <p className="text-center">{redeemedUnits}</p>
        <p className="col-span-2 text-right">{date}</p>
      </div>
      {isOpen && <div></div>
        }
      <div className="flex items-center justify-center">
        <div className={`w-6 h-6 transition-transform duration-100 group-hover:text-blue-600 ${isOpen ? '-rotate-90 group-hover:translate-y-[2px]' : 'rotate-90 group-hover:translate-y-[-2px]'}`}>
          <Chevron />
        </div>
      </div>
    </div>
  )
}

export default SubmissionBlock
