import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Input, Textarea } from "@components/ui"

export type QuestionValue = {
  question: string
  hint: string
  options?: { value: string; name?: string }[]
}

type Props = {
  questionNumber: number
  questionValues: QuestionValue[]
  setQuestionValues: Dispatch<SetStateAction<QuestionValue[]>>
  initData?: QuestionValue[] | undefined
  // disabled?: boolean
}

const CreateFormInput = ({
  questionNumber,
  questionValues,
  setQuestionValues,
  initData // ,disabled
}: Props) => {
  const [question, setQuestion] = useState(
    (initData && initData[questionNumber - 1]?.question) || ""
  )
  const [hint, setHint] = useState(
    (initData && initData[questionNumber - 1]?.hint) || ""
  )

  useEffect(() => {
    const updatedQuestions = questionValues
    updatedQuestions[questionNumber - 1] = { question, hint }
    setQuestionValues(updatedQuestions)
  }, [question, hint])

  return (
    <>
      <Input
        label={`Question ${questionNumber}`}
        value={question}
        onChange={setQuestion}
        required
        // disabled={disabled}
      />
      <Textarea
        label={`Hint ${questionNumber}`}
        value={hint}
        rows={1}
        onChange={setHint}
        placeholder="Add optional text or links to guide users in answering your question"
      />
      <hr className="w-20 mx-auto mt-12 mb-8 border-gray-300" />
    </>
  )
}

export default CreateFormInput
