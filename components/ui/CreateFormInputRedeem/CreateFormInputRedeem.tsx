import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Input } from "@components/ui"
import { QuestionValue } from "../CreateFormInput/CreateFormInput"
import markdownToHtml from "@lib/markdownToHtml"

type Props = {
  questionNumber: number
  slicerId: number
  productId: number
  answers: { [id: string]: string[] }
  setAnswers: Dispatch<SetStateAction<{ [question: string]: string[] }>>
  questionValue: QuestionValue
}

const CreateFormInputRedeem = ({
  questionNumber,
  slicerId,
  productId,
  answers,
  setAnswers,
  questionValue
}: Props) => {
  const [htmlContent, setHtmlContent] = useState("")
  const { question, hint } = questionValue

  const handleShowPreview = async () => {
    setHtmlContent(await markdownToHtml(hint))
  }

  const handleSetAnswer = (value: string) => {
    const answer = answers[`${slicerId}-${productId}`] || []
    answer[questionNumber] = value

    setAnswers({ ...answers, [`${slicerId}-${productId}`]: answer })
  }

  useEffect(() => {
    handleShowPreview()
  }, [])

  return (
    <>
      <div className="pb-2 text-sm text-left text-gray-500">
        <div className="relative flex items-center">
          <p className="pr-1 font-medium ">{question}</p>
        </div>
        {hint && (
          <div
            className="prose text-gray-500"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          ></div>
        )}
      </div>
      <Input
        value={
          answers[`${slicerId}-${productId}`] &&
          answers[`${slicerId}-${productId}`][questionNumber]
        }
        onChange={handleSetAnswer}
        required
      />
    </>
  )
}

export default CreateFormInputRedeem
