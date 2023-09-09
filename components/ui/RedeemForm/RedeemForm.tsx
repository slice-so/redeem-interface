import { Dispatch, SetStateAction, useState } from "react"
import { ProductDataExpanded, RedeemData } from "../HomeRedeem/HomeRedeem"
import { SelectedProducts } from "../SelectRedeems/SelectRedeems"
import { QuestionValue } from "../CreateFormInput/CreateFormInput"
import {
  Button,
  RedeemFormDelivery,
  RedeemFormInputRedeem,
  RedeemFormSelectProduct
} from "../"
import { LinkedProducts } from "../PrintfulStore/PrintfulStore"
import { useAppContext } from "../context"

export type Answers = {
  deliveryInfo?: {
    [key: string]: string
  }
  [id: string]: {
    questionAnswers?: string[]
    choosenVariants?: { quantity: number; variantId: string }[]
  }
}

type Props = {
  productData: RedeemData
  selectedProducts: SelectedProducts
  setIsFormView: Dispatch<SetStateAction<boolean>>
  setSuccess: Dispatch<SetStateAction<boolean>>
  error: string
  setError: Dispatch<SetStateAction<string>>
}

const RedeemForm = ({
  productData,
  selectedProducts,
  setIsFormView,
  setSuccess,
  error,
  setError
}: Props) => {
  const { account } = useAppContext()
  const [answers, setAnswers] = useState<Answers>({})
  const [loading, setLoading] = useState(false)

  const formsSelectedProducts: ProductDataExpanded[] = Object.keys(
    selectedProducts
  ).flatMap((id) => {
    if (selectedProducts[id] == 0) return []

    const slicerId = id.split("-")[0]
    const productId = id.split("-")[1]

    const redeemData = {
      ...productData[slicerId].find(
        (product) => product.product.product_id == Number(productId)
      )
    }

    redeemData["quantityToRedeem"] = selectedProducts[id]
    return redeemData
  })

  const showDeliveryForm = formsSelectedProducts.some(
    ({ form }) => !!form.linkedProducts
  )

  const submit = async (e) => {
    e.preventDefault()

    if (!loading) {
      try {
        setLoading(true)
        setError("")

        const response = await fetch("/api/submissions/create", {
          method: "POST",
          body: JSON.stringify({ account, answers })
        })

        const data = await response.json()

        if (response.ok) {
          setLoading(false)
          const { submissions, totalToRedeem } = data
          if (submissions.length != totalToRedeem) {
            setError(
              "Some products were not redeemed, please try again later or contact us"
            )
          }
          setSuccess(true)
        } else {
          setError(
            data.error
              .replaceAll("Recipient: ", "")
              .replaceAll(
                "Item 0: Sync variant not found",
                "Product unavailable, contact seller for more info"
              )
          )
          setLoading(false)
        }
      } catch (error) {
        console.log("in catch")
        console.log(error)
      }
    }
  }

  return (
    <form onSubmit={submit}>
      <p className="pb-12 text-lg leading-8 text-gray-600">
        Choose the products to redeem and fill in the required details
      </p>
      <div className="space-y-8">
        {formsSelectedProducts.map(({ product, form, quantityToRedeem }) => {
          const { id: slicerId, name: slicerName } = product.Slicer
          const { name: productName, product_id: productId } = product
          const questions = form.questions as QuestionValue[]

          return (
            <div key={`${slicerId}-${[productId]}`}>
              <div className="text-left pb-3.5 pl-4 sm:flex sm:flex-wrap justify-between items-center">
                <h2 className="flex items-center text-lg font-medium text-gray-600 sm:text-xl">
                  {slicerName} / {productName}
                </h2>
                <p className="text-sm font-semibold text-gray-500">
                  Redeem up to {quantityToRedeem}
                </p>
              </div>
              <RedeemFormSelectProduct
                slicerId={slicerId}
                productId={productId}
                quantityToRedeem={quantityToRedeem}
                linkedProducts={form.linkedProducts as LinkedProducts}
                answers={answers}
                setAnswers={setAnswers}
                product={product}
              />
              <div className="py-10">
                {questions.length != 0 &&
                  questions.map((question, key) => {
                    return (
                      <div key={key} className="space-y-12">
                        <RedeemFormInputRedeem
                          key={key}
                          slicerId={slicerId}
                          productId={productId}
                          questionNumber={key}
                          questionValue={question}
                          answers={answers}
                          setAnswers={setAnswers}
                        />
                      </div>
                    )
                  })}
              </div>
            </div>
          )
        })}
      </div>
      {showDeliveryForm && (
        <>
          <hr className="w-40 mx-auto my-6 border-gray-400 " />
          <div className="py-10">
            <h2 className="flex pb-4 text-xl font-medium text-gray-600 sm:text-2xl">
              Delivery info
            </h2>
            <RedeemFormDelivery answers={answers} setAnswers={setAnswers} />
          </div>
        </>
      )}

      <div className="pt-4 pb-8">
        {error && (
          <p className="pb-6 text-sm font-semibold text-red-500">{error}</p>
        )}
        <Button label="Submit" type="submit" loading={loading} />
      </div>
      <a className="highlight" onClick={() => setIsFormView(false)}>
        Go back
      </a>
    </form>
  )
}

export default RedeemForm
