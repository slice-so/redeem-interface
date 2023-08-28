import { Dispatch, SetStateAction, useState } from "react"
import { useAppContext } from "../context"
import { ProductDataExpanded, RedeemData } from "../HomeRedeem/HomeRedeem"
import { SelectedProducts } from "../SelectRedeems/SelectRedeems"
import RedeemFormPrintful from "../RedeemFormPrintful"
import { QuestionValue } from "../CreateFormInput/CreateFormInput"
import CreateFormInputRedeem from "../CreateFormInputRedeem"

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
  const [answers, setAnswers] = useState({})

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

  return (
    <form onSubmit={submit}>
      {showDeliveryForm && (
        <>
          {/*  <RedeemFormPrintful
               linkedProducts={linkedProducts}
               selectedProduct={selectedProduct}
               setSelectedProduct={setSelectedProduct}
               answers={answers}
               setAnswers={setAnswers}
             /> */}
        </>
      )}
      {formsSelectedProducts.map(({ product, form }, key) => {
        const { id: slicerId, name: slicerName } = product.Slicer
        const { name: productName, product_id: productId } = product
        const questions = form.questions as QuestionValue[]

        return (
          <div key={key}>
            <h2 className="pb-3.5 pl-4 text-lg sm:text-xl flex text-gray-600 pt-2 font-medium items-center">
              {slicerName} / {productName}
            </h2>
            {questions.length &&
              questions.map((question, key) => {
                return (
                  <CreateFormInputRedeem
                    key={key}
                    slicerId={slicerId}
                    productId={productId}
                    questionNumber={key}
                    questionValue={question}
                    answers={answers}
                    setAnswers={setAnswers}
                  />
                )
              })}
          </div>
        )
      })}
      <a className="highlight" onClick={() => setIsFormView(false)}>
        Go back
      </a>
    </form>
  )
}

export default RedeemForm
