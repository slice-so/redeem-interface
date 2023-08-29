import Chevron from "@components/icons/Chevron"
import Image from "next/image"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { LinkedProducts } from "../PrintfulStore/PrintfulStore"
import { Answers } from "../RedeemForm/RedeemForm"
import ListElement from "../ListElement"
import ShoppingBag from "@components/icons/ShoppingBag"

type Props = {
  slicerId: number
  productId: number
  quantityToRedeem: number
  linkedProducts: LinkedProducts
  answers: Answers
  setAnswers: Dispatch<SetStateAction<Answers>>
}

const RedeemFormPrintful = ({
  slicerId,
  productId,
  quantityToRedeem,
  linkedProducts,
  answers,
  setAnswers
}: Props) => {
  const allVariants = linkedProducts.map(({ variants }) => variants).flat()
  const id = `${slicerId}-${productId}`

  // const [chosenProduct, setChosenProduct] = useState(
  //   linkedProducts.length != 0 ? linkedProducts[0] : null
  // )

  // const product = chosenProduct?.product
  // const variants = chosenProduct?.variants

  // const handleSetChosenProduct = (externalId: string) => {
  //   const product = linkedProducts.find(
  //     ({ product }) => product.external_id == externalId
  //   )
  //   setChosenProduct(product)
  // }

  useEffect(() => {
    if (allVariants?.length == 1) {
      const answer = answers[id] || {}
      const choosenVariants = answer.choosenVariants || []
      choosenVariants[0] = {
        quantity: quantityToRedeem,
        variantId: allVariants[0].external_id
      }

      setAnswers((prev) => ({
        ...prev,
        [id]: { questionAnswers: answer.questionAnswers, choosenVariants }
      }))
    }
  }, [allVariants])

  return (
    <>
      {allVariants.map(({ product }, key) => {
        const { image, name } = product
        return (
          <ListElement
            image={image}
            name={name}
            isSelected={false}
            onClick={() => null}
            key={productId}
          ></ListElement>
        )
      })}
    </>
  )
}

export default RedeemFormPrintful
