import { Dispatch, Fragment, SetStateAction, useState } from "react"
import { ProductDataExpanded, RedeemData } from "../HomeRedeem/HomeRedeem"
import { SelectedProducts } from "../SelectRedeems/SelectRedeems"
import { QuestionValue } from "../CreateFormInput/CreateFormInput"
import {
  Button,
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

  const submit = () => {}

  return (
    <form onSubmit={submit}>
      <p className="text-lg leading-8 pb-12 text-gray-600">
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
                <h2 className="text-lg sm:text-xl flex text-gray-600 font-medium items-center">
                  {slicerName} / {productName}
                </h2>
                <p className="text-gray-500 font-semibold text-sm">
                  Redeem up to {quantityToRedeem}
                </p>
              </div>
              <RedeemFormPrintful
                slicerId={slicerId}
                productId={productId}
                quantityToRedeem={quantityToRedeem}
                linkedProducts={form.linkedProducts as LinkedProducts}
                answers={answers}
                setAnswers={setAnswers}
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
            <h2 className="pb-4 text-xl sm:text-2xl flex text-gray-600 font-medium">
              Delivery info
            </h2>
            <RedeemFormDelivery answers={answers} setAnswers={setAnswers} />
          </div>
        </>
      )}

      <div className="pt-4 pb-8">
        <Button label="Continue" type="submit" />
      </div>
      <a className="highlight" onClick={() => setIsFormView(false)}>
        Go back
      </a>
    </form>
  )
}

export default RedeemForm
