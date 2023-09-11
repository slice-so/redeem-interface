import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Input } from "@components/ui"
import { QuestionValue } from "../CreateFormInput/CreateFormInput"
import markdownToHtml from "@lib/markdownToHtml"
import { Answers } from "../RedeemForm/RedeemForm"

type Props = {
  questionNumber: number
  slicerId: number
  productId: number
  answers: Answers
  setAnswers: Dispatch<SetStateAction<Answers>>
  questionValue: QuestionValue
}

const RedeemFormInputRedeem = ({
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
    const answer = answers[`${slicerId}-${productId}`] || {}
    const questionAnswers = answer.questionAnswers || []
    questionAnswers[questionNumber] = value

    setAnswers((prev) => ({
      ...prev,
      [`${slicerId}-${productId}`]: {
        questionAnswers,
        choosenVariants: answer.choosenVariants,
        onSiteRedemption: answer.onSiteRedemption
      }
    }))
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

export default RedeemFormInputRedeem
