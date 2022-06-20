import Chevron from "@components/icons/Chevron"
import { Submission } from "@prisma/client"
import { useState } from "react"
import { QuestionValue } from "../CreateFormInput/CreateFormInput"

type Props = {
  questions: QuestionValue[]
  submission: Submission & { createdAt: string }
}

const SubmissionBlock = ({ questions, submission }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const { buyer, redeemedUnits, createdAt, answers } = submission
  const date = new Date(createdAt).toLocaleDateString()
  const reducedAddress = buyer.replace(
    buyer.substring(5, buyer.length - 3),
    `\xa0\xa0\xa0\xa0\xa0\xa0`
  )

  return (
    <li
      className={`pt-2 pb-1.5 bg-gray-50 rounded-md shadow-md ${
        questions.length != 0
          ? "transition-all duration-100 cursor-pointer group hover:shadow-sm hover:translate-y-[2px]"
          : ""
      }`}
      onClick={() => (questions.length != 0 ? setIsOpen(!isOpen) : null)}
    >
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
      {isOpen && (
        <div
          className="mx-4 mb-1 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          {questions.map((el, key) => (
            <div key={key} className="py-1">
              <p>
                <span className="font-semibold">
                  {questions[key].question}:
                </span>{" "}
                {answers[key] || "/"}
              </p>
            </div>
          ))}
        </div>
      )}
      {questions.length != 0 && (
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
