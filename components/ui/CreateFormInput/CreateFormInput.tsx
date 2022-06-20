import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Input, Textarea } from "@components/ui"

export type QuestionValue = {
  question: string
  hint: string
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
    <div className="mb-4">
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
        onChange={setHint}
        placeholder="Add optional text or links to guide users in answering your question"
      />
      <hr className="w-20 mx-auto mt-12 mb-8 border-gray-300" />
    </div>
  )
}

export default CreateFormInput
