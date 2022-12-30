import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Input } from "@components/ui"
import { QuestionValue } from "../CreateFormInput/CreateFormInput"
import markdownToHtml from "@lib/markdownToHtml"

type Props = {
  questionNumber: number
  answers: { [question: string]: string }
  setAnswers: Dispatch<SetStateAction<{ [question: string]: string }>>
  questionValue: QuestionValue
}

const CreateFormInputRedeem = ({
  questionNumber,
  answers,
  setAnswers,
  questionValue
}: Props) => {
  const [answer, setAnswer] = useState("")
  const [htmlContent, setHtmlContent] = useState("")
  const { question, hint } = questionValue

  const handleShowPreview = async () => {
    setHtmlContent(await markdownToHtml(hint))
  }

  useEffect(() => {
    handleShowPreview()
  }, [])

  useEffect(() => {
    const updatedAnswers = { ...answers }
    updatedAnswers[question] = answer
    setAnswers(updatedAnswers)
  }, [answer])

  return (
    <>
      <div className="pb-2">
        <div className="relative flex items-center">
          <p className="pr-1 text-sm font-semibold text-left text-gray-600">
            {question}
          </p>
        </div>
        {hint && (
          <div
            className="py-1 text-sm prose text-left text-gray-600"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          ></div>
        )}
      </div>
      <Input value={answer} onChange={setAnswer} required />
    </>
  )
}

export default CreateFormInputRedeem
