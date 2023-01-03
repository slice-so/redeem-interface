import Chevron from "@components/icons/Chevron"
import { Submission } from "@prisma/client"
import { useState } from "react"
import { useEnsName } from "wagmi"
import { QuestionValue } from "../CreateFormInput/CreateFormInput"

type Props = {
  submission: Submission & { createdAt: string }
}

const SubmissionBlock = ({ submission }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const { buyer, redeemedUnits, createdAt, answers } = submission
  const date = new Date(createdAt).toLocaleDateString()

  // @ts-ignore
  const { data: ens } = useEnsName({ address: buyer })

  const reducedAddress = buyer.replace(
    buyer.substring(5, buyer.length - 3),
    `\xa0\xa0\xa0\xa0\xa0\xa0`
  )
  const orderedQuestions = Object.keys(answers).sort()

  return (
    <li
      className={`pt-2 pb-1.5 bg-gray-50 rounded-md shadow-md ${
        orderedQuestions.length != 0
          ? "transition-shadow duration-100 cursor-pointer group hover:shadow-sm"
          : ""
      }`}
      onClick={() => (orderedQuestions.length != 0 ? setIsOpen(!isOpen) : null)}
    >
      <div className="grid items-center justify-between grid-cols-5 px-4 py-2 text-sm">
        <p className="col-span-2">
          <a
            className="highlight"
            href={`https://etherscan.io/address/${buyer}`}
            target="_blank"
            rel="noreferrer"
          >
            {ens || reducedAddress}
          </a>
        </p>
        <p className="text-center">{redeemedUnits}</p>
        <p className="col-span-2 text-right">{date}</p>
      </div>
      {isOpen && (
        <div
          className="mx-4 mb-1 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          {orderedQuestions.map((question, i) => (
            <div key={i} className="py-1">
              <p>
                <span className="font-semibold">{question}:</span>{" "}
                {answers[question] || "/"}
              </p>
            </div>
          ))}
        </div>
      )}
      {orderedQuestions.length != 0 && (
        <div className="flex items-center justify-center">
          <div
            className={`w-6 h-6 transition-transform duration-100 group-hover:text-blue-600 ${
              isOpen
                ? "rotate-90 translate-y-[2px] group-hover:translate-y-[-2px]"
                : "-rotate-90 group-hover:translate-y-[2px]"
            }`}
          >
            <Chevron />
          </div>
        </div>
      )}
    </li>
  )
}

export default SubmissionBlock
