import { useState } from "react"
import { useAppContext } from "../context"
import { CreateFormInputRedeem, Button, Input } from "@components/ui"
import useQuery from "@utils/subgraphQuery"
import decimalToHex from "@utils/decimalToHex"
import Spinner from "@components/icons/Spinner"
import usePrismaQuery from "@utils/prismaQuery"
import { QuestionValue } from "../CreateFormInput/CreateFormInput"

type Props = {
  questions: QuestionValue[]
  slicerId: number
  productId: number
}

const RedeemForm = ({ questions, slicerId, productId }: Props) => {
  const { account } = useAppContext()

  const [units, setUnits] = useState(0)
  const [answerValues, setAnswerValues] = useState([])
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const hexId = `${decimalToHex(Number(slicerId))}-${decimalToHex(
    Number(productId)
  )}-${account.toLowerCase()}`

  const tokensQuery = /* GraphQL */ `
      productPurchase (id: "${hexId}") {
        totalQuantity
      }
    `
  let subgraphData = useQuery(tokensQuery, [account])
  const purchaseData = subgraphData?.productPurchase
  const data = usePrismaQuery(
    `/api/submissions?buyer=${account}&slicerId=${slicerId}&productId=${productId}`
  )
  console.log(data)

  const formId = data?.formId
  const submissions = data?.submissions as { redeemedUnits: number }[]
  const redeemedUnits = submissions?.reduce(
    (acc, val) => acc + val.redeemedUnits,
    0
  )

  const submit = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const fetcher = (await import("@utils/fetcher")).default

      const body = {
        body: JSON.stringify({
          formId,
          buyer: account,
          redeemedUnits: units,
          answers: answerValues
        }),
        method: "POST"
      }

      await fetcher(`/api/submissions/create`, body)
      setIsSuccess(true)
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

  const maxUnits = purchaseData?.totalQuantity - redeemedUnits

  return !isSuccess ? (
    !subgraphData || !submissions ? (
      <div className="flex justify-center">
        <Spinner size="w-10 h-10" />
      </div>
    ) : !purchaseData ? (
      <p className="font-semibold text-yellow-600">
        You haven&apos;t purchased this product yet
      </p>
    ) : maxUnits != 0 ? (
      <>
        <p className="pb-6">
          Choose how many units you wish to redeem, and answer the required
          questions.{" "}
        </p>
        <form onSubmit={(e) => submit(e)}>
          <div className="pb-4">
            <div className="mb-8">
              <Input
                label="Units to redeem"
                type="number"
                value={units > 0 ? units : ""}
                onChange={setUnits}
                min={1}
                max={maxUnits}
                placeholder={`Up to ${maxUnits}`}
                required
              />
            </div>
            {[...Array(questions.length)].map((i, key) => (
              <CreateFormInputRedeem
                key={key}
                questionNumber={key + 1}
                questionValue={questions[key]}
                answerValues={answerValues}
                setAnswerValues={setAnswerValues}
              />
            ))}
          </div>
          <Button label="Submit" loading={loading} type="submit" />
        </form>
      </>
    ) : (
      <p className="font-semibold text-yellow-600">
        You already redeemed all purchased units
      </p>
    )
  ) : (
    <p>Product redeemed successfully! 🎉</p>
  )
}

export default RedeemForm
