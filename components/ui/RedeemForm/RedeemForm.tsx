import { Dispatch, SetStateAction, useState } from "react"
import { ProductDataExpanded, RedeemData } from "../HomeRedeem/HomeRedeem"
import { SelectedProducts } from "../SelectRedeems/SelectRedeems"
import { QuestionValue } from "../CreateFormInput/CreateFormInput"
import {
  RedeemFormDelivery,
  RedeemFormInputRedeem,
  RedeemFormPrintful
} from "../"

export type Answers = {
  deliveryInfo?: {
    [key: string]: string
  }
  [id: string]: {
    questionAnswers?: string[]
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

  const formsToDisplay = {}

  const submit = () => {}

  console.log(answers)

  return (
    <form onSubmit={submit}>
      {/* TODO: fix unique key prop bug */}
      {formsSelectedProducts.map(({ product, form }) => {
        const { id: slicerId, name: slicerName } = product.Slicer
        const { name: productName, product_id: productId } = product
        const questions = form.questions as QuestionValue[]

        return (
          <div key={`${slicerId}-${[productId]}`}>
            <h2 className="pb-3.5 pl-4 text-lg sm:text-xl flex text-gray-600 pt-2 font-medium items-center">
              {slicerName} / {productName}
            </h2>
            {questions.length != 0 &&
              questions.map((question, key) => {
                return (
                  <>
                    {/*  <RedeemFormPrintful
               linkedProducts={linkedProducts}
               selectedProduct={selectedProduct}
               setSelectedProduct={setSelectedProduct}
               answers={answers}
               setAnswers={setAnswers}
             /> */}
                    <RedeemFormInputRedeem
                      key={key}
                      slicerId={slicerId}
                      productId={productId}
                      questionNumber={key}
                      questionValue={question}
                      answers={answers}
                      setAnswers={setAnswers}
                    />
                  </>
                )
              })}
          </div>
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
