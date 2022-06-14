import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Input from "../Input"

type Props = {
  questionNumber: number
  questionValues: string[]
  setQuestionValues: Dispatch<SetStateAction<string[]>>
  label?: string
  initData?: string[] | undefined
}

const CreateFormInput = ({
  questionNumber,
  questionValues,
  setQuestionValues,
  label,
  initData
}: Props) => {
  const [value, setValue] = useState(
    (initData && initData[questionNumber - 1]) || ""
  )

  useEffect(() => {
    const updatedQuestions = questionValues
    updatedQuestions[questionNumber - 1] = value
    setQuestionValues(updatedQuestions)
  }, [value])

  return (
    <div className="mb-4">
      <Input
        label={label || `Question ${questionNumber}`}
        value={value}
        onChange={setValue}
        required
      />
    </div>
  )
}

export default CreateFormInput
