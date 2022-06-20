import Link from "next/link"
import Add from "@components/icons/Add"
import Delete from "@components/icons/Delete"
import { useState } from "react"
import { useAppContext } from "../context"
import { CreateFormInput, Button } from "@components/ui"
import { ProductForm } from "@prisma/client"
// import { QuestionValue } from "../CreateFormInput/CreateFormInput"

type Props = {
  id: string
  productCreator: string
  initData: ProductForm
}

const CreateForm = ({ id, productCreator, initData }: Props) => {
  const { account } = useAppContext()
  const questions: any[] = initData?.questions

  const [questionsNumber, setQuestionsNumber] = useState(questions?.length || 0)
  const [questionValues, setQuestionValues] = useState(questions || [])
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
          questions: cleanedValues
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

  return !isSuccess ? (
    productCreator == account.toLowerCase() ? (
      <>
        <p>
          Buyers by default will be asked how many units they want to redeem,
          but you can also add additional questions if needed.{" "}
        </p>
        <p className="pt-2 pb-6 text-sm">
          You will be able to review submissions in{" "}
          <Link href="/products">
            <a className="highlight">Your Products</a>
          </Link>
          .
        </p>
        <form onSubmit={(e) => submit(e)}>
          <div className="px-2 py-8 mt-4 mb-12 bg-white border border-blue-600 shadow-lg sm:px-4 rounded-xl">
            <p className="pb-2 font-semibold text-yellow-600">
              Add custom questions to buyers
            </p>
            <p className="pb-6 text-sm">
              Here you can ask for any info you need to process the purchase,
              such as an email or physical address.
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
          {/* <p className="pb-8 font-semibold text-yellow-600">
            Note that you cannot change question names after saving the form.
          </p> */}
          <Button label="Create form" loading={loading} type="submit" />
        </form>
      </>
    ) : (
      <p>
        The connected address is not the creator of this product. Verify you are
        the creator of this product and you are connected with the correct
        address.
      </p>
    )
  ) : (
    <p>Form created successfully! 🎉</p>
  )
}

export default CreateForm

// TODO: Fix initData
