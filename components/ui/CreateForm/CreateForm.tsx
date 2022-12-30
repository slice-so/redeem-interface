import Add from "@components/icons/Add"
import Delete from "@components/icons/Delete"
import { useState } from "react"
import { useAppContext } from "../context"
import { CreateFormInput, Button, CreateFormPrintful } from "@components/ui"
import { Account, Form } from "@prisma/client"
import { QuestionValue } from "../CreateFormInput/CreateFormInput"

type Props = {
  id: string
  productCreator: string
  initData: Form
  stateValue: string
  accounts: Account[]
}

const CreateForm = ({
  id,
  productCreator,
  initData,
  stateValue,
  accounts
}: Props) => {
  const { account } = useAppContext()
  const questions = initData?.questions as QuestionValue[]
  const initVariants = initData?.linkedProducts as any[]

  const [questionsNumber, setQuestionsNumber] = useState(questions?.length || 0)
  const [questionValues, setQuestionValues] = useState(questions || [])
  const [productVariants, setProductVariants] = useState(initVariants || {})
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const submit = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const fetcher = (await import("@utils/fetcher")).default

      const cleanedValues = questionValues.filter((val) => val.question != "")
      const body = {
        body: JSON.stringify({
          slicerId: id.split("-")[0],
          productId: id.split("-")[1],
          creator: account,
          questions: cleanedValues,
          productVariants
        }),
        method: "POST"
      }

      await fetcher(`/api/form/create`, body)
      setIsSuccess(true)
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

  const removeLastQuestion = () => {
    const updatedQuestions = questionValues
    updatedQuestions.splice(questionsNumber - 1, 1)
    setQuestionValues(updatedQuestions)
    setQuestionsNumber(questionsNumber - 1)
  }

  console.log(productVariants)

  return !isSuccess ? (
    productCreator == account.toLowerCase() ? (
      <>
        <CreateFormPrintful
          stateValue={stateValue}
          accounts={accounts}
          productVariants={productVariants}
          setProductVariants={setProductVariants}
        />

        <form onSubmit={(e) => submit(e)}>
          <div className="px-2 py-8 mt-12 mb-8 bg-white border border-blue-600 shadow-lg sm:px-4 rounded-xl">
            <p className="pb-2 font-semibold text-gray-700">
              Questions to buyers
            </p>
            <p className="pb-6 text-sm text-gray-500">
              Ask information you need to process the purchase, such as contact
              details or a physical address.
            </p>
            {[...Array(questionsNumber)].map((i, key) => (
              <CreateFormInput
                key={key}
                questionNumber={key + 1}
                initData={questions}
                questionValues={questionValues}
                setQuestionValues={setQuestionValues}
                // disabled={initData?.questions.length > key}
              />
            ))}

            <div className="flex justify-around">
              <div className="inline-flex justify-start mt-6 space-x-3 text-green-500 cursor-pointer group">
                <Add onClick={() => setQuestionsNumber(questionsNumber + 1)} />
                <p
                  className="inline-block font-semibold opacity-75 group-hover:opacity-100"
                  onClick={() => setQuestionsNumber(questionsNumber + 1)}
                >
                  Add
                </p>
              </div>
              {questionsNumber != 0 && (
                // TODO: Fix unwanted state changes that cause questions to update on children state changes
                /* questionsNumber > questions?.length && */ <div className="inline-flex justify-start mt-6 space-x-3 text-red-500 cursor-pointer group">
                  <Delete onClick={() => removeLastQuestion()} />
                  <p
                    className="inline-block font-semibold opacity-75 group-hover:opacity-100"
                    onClick={() => removeLastQuestion()}
                  >
                    Remove
                  </p>
                </div>
              )}
            </div>
          </div>
          <p className="pb-12 text-sm text-gray-500">
            Buyers will choose how many units they want to redeem
          </p>
          {/* <p className="pb-8 font-semibold text-yellow-600">
            Note that you cannot change question names after saving the form.
          </p> */}
          <Button label="Create form" loading={loading} type="submit" />
        </form>
      </>
    ) : (
      <p>
        You&apos;re not the creator of this product. Verify you are connected
        with the correct account.
      </p>
    )
  ) : (
    <p>Form created successfully! 🎉</p>
  )
}

export default CreateForm

// TODO: Fix initData
