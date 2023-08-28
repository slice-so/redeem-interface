import { Dispatch, Fragment, SetStateAction, useState } from "react"
import { ProductDataExpanded, RedeemData } from "../HomeRedeem/HomeRedeem"
import { SelectedProducts } from "../SelectRedeems/SelectRedeems"
import { QuestionValue } from "../CreateFormInput/CreateFormInput"
import {
  RedeemFormDelivery,
  RedeemFormInputRedeem,
  RedeemFormPrintful
} from "../"
import { LinkedProducts } from "../PrintfulStore/PrintfulStore"

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
}

const RedeemForm = ({
  productData,
  selectedProducts,
  setIsFormView
}: Props) => {
  const [answers, setAnswers] = useState<Answers>({})

  const formsSelectedProducts: ProductDataExpanded[] = Object.keys(
    selectedProducts
  ).flatMap((id) => {
    if (selectedProducts[id] == 0) return []

    const slicerId = id.split("-")[0]
    const productId = id.split("-")[1]

    const redeemData = productData[slicerId].find(
      (product) => product.product.product_id == Number(productId)
    )

    redeemData["quantityToRedeem"] = selectedProducts[id]
    return redeemData
  })

  const showDeliveryForm = formsSelectedProducts.some(
    ({ form }) => !!form.linkedProducts
  )

  const submit = () => {}

  return (
    <form onSubmit={submit}>
      {formsSelectedProducts.map(({ product, form }) => {
        const { id: slicerId, name: slicerName } = product.Slicer
        const { name: productName, product_id: productId } = product
        const questions = form.questions as QuestionValue[]

        return (
          <Fragment key={`${slicerId}-${[productId]}`}>
            <h2 className="pb-3.5 pl-4 text-lg sm:text-xl flex text-gray-600 pt-2 font-medium items-center">
              {slicerName} / {productName}
            </h2>
            {questions.length != 0 &&
              questions.map((question, key) => {
                return (
                  <Fragment key={key}>
                    <RedeemFormPrintful
                      linkedProducts={form.linkedProducts as LinkedProducts}
                      answers={answers}
                      setAnswers={setAnswers}
                      slicerId={slicerId}
                      productId={productId}
                    />
                    <RedeemFormInputRedeem
                      key={key}
                      slicerId={slicerId}
                      productId={productId}
                      questionNumber={key}
                      questionValue={question}
                      answers={answers}
                      setAnswers={setAnswers}
                    />
                  </Fragment>
                )
              })}
          </Fragment>
        )
      })}
      {showDeliveryForm && (
        <div>
          <h2 className="pb-3.5 pl-4 text-lg sm:text-xl flex text-gray-600 pt-2 font-medium items-center">
            Delivery info
          </h2>
          <RedeemFormDelivery answers={answers} setAnswers={setAnswers} />
        </div>
      )}
      <a className="highlight" onClick={() => setIsFormView(false)}>
        Go back
      </a>
    </form>
  )
}

export default RedeemForm
