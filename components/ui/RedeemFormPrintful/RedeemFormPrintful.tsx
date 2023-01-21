import Chevron from "@components/icons/Chevron"
import { countryCodes } from "@lib/countryCodes"
import Image from "next/future/image"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { QuestionValue } from "../CreateFormInput/CreateFormInput"
import { LinkedProducts } from "../HomeRedeem/HomeRedeem"
import Input from "../Input"

type Props = {
  linkedProducts: LinkedProducts
  selectedProduct: string
  setSelectedProduct: Dispatch<SetStateAction<string>>
  answers: { [question: string]: string }
  setAnswers: Dispatch<SetStateAction<{ [question: string]: string }>>
}

const RedeemFormPrintful = ({
  linkedProducts,
  selectedProduct,
  setSelectedProduct,
  answers,
  setAnswers
}: Props) => {
  const [chosenProduct, setChosenProduct] = useState(
    linkedProducts.length != 0 ? linkedProducts[0] : null
  )

  const product = chosenProduct?.product
  const variants = chosenProduct?.variants

  console.log(variants)

  const deliveryQuestions: QuestionValue[] = [
    {
      question: "Name",
      hint: ""
    },
    { question: "Address", hint: "" },
    { question: "City", hint: "" },
    {
      question: "Country",
      hint: "",
      options: countryCodes
        .map(({ name, code }) => ({ name, value: code }))
        .sort((a, b) => a.name.localeCompare(b.name))
    },
    {
      question: "State",
      hint: "",
      options:
        (answers["Country"] &&
          countryCodes
            .find(({ code }) => code == answers["Country"])
            .states?.map(({ name, code }) => ({ name, value: code }))
            .sort((a, b) => a.name.localeCompare(b.name))) ||
        []
    },
    { question: "Postal code", hint: "" },
    { question: "Email", hint: "" }
  ]

  useEffect(() => {
    if (variants?.length == 1) setSelectedProduct(variants[0].external_id)
  }, [variants, setSelectedProduct])

  useEffect(() => {
    if (answers["State"] && deliveryQuestions[4].options.length == 0) {
      setAnswers((prev) => ({ ...prev, ["State"]: "" }))
    }
  }, [answers])

  return (
    linkedProducts.length != 0 && (
      <div className="mb-6">
        <div className="flex justify-center">
          <Image
            src={product.thumbnail_url}
            width={260}
            height={260}
            alt={product.name + " image"}
            className="rounded-lg"
          />
        </div>
        {linkedProducts.length == 1 ? (
          <p className="py-6 font-medium">{product.name}</p>
        ) : (
          <div className="py-6">
            <p className="pb-1 pr-1 text-sm font-medium text-left text-gray-500">
              Product to redeem
            </p>
            <div className="relative">
              <select
                className="w-full py-2 pl-5 pr-4 text-black transition-shadow duration-150 ease-in-out bg-white border-blue-300 rounded-sm appearance-none focus:outline-none shadow-light-focusable focus:border-blue-200"
                value={chosenProduct.product.external_id}
                // TODO: Might need to handle differently
                onChange={(e) => setChosenProduct(JSON.parse(e.target.value))}
                required
              >
                {linkedProducts.map(({ product }) => (
                  <option key={product.id} value={product}>
                    {product.name}
                  </option>
                ))}
              </select>
              <div className="absolute top-0 right-[16px] w-4 h-full -rotate-90">
                <Chevron />
              </div>
            </div>
          </div>
        )}
        {(variants.length != 1 ||
          variants[0].name.split(product.name + " - ")[1]) && (
          <>
            <p className="pb-1 pr-1 text-sm font-medium text-left text-gray-500">
              Color / size
            </p>
            <div className="relative">
              <select
                className="w-full py-2 pl-5 pr-4 text-black transition-shadow duration-150 ease-in-out bg-white border-blue-300 rounded-sm appearance-none focus:outline-none shadow-light-focusable focus:border-blue-200 disabled:text-gray-500 disabled:border-blue-100 disabled:bg-gray-50"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                disabled={variants.length == 1}
                required
              >
                <option value="">Pick option...</option>
                {variants.map((variant) => (
                  <option key={variant.id} value={variant.external_id}>
                    {(variants.length == 1 ? "Unique" : "") +
                      (variants.length == 1 &&
                      variant.name.split(product.name + " - ")[1]
                        ? " - "
                        : "") +
                      (variant.name.split(product.name + " - ")[1]
                        ? variant.name.split(product.name + " - ")[1]
                        : "")}
                  </option>
                ))}
              </select>
              {variants.length != 1 && (
                <div className="absolute top-0 right-[16px] w-4 h-full -rotate-90">
                  <Chevron />
                </div>
              )}
            </div>
          </>
        )}

        <div className="px-2 py-6 my-6 text-left rounded-md shadow-lg bg-gray-50 sm:px-4">
          <div className="pb-4">
            <p className="font-medium">Delivery info</p>
            <p className="text-sm">
              The item will be delivered to the address specified below.
            </p>
          </div>
          {deliveryQuestions.map(({ question, hint, options }, key) => {
            const handleSetAnswer = (answer: string) => {
              setAnswers((prev) => ({ ...prev, [question]: answer }))
            }

            return (
              <div key={key}>
                {options ? (
                  options.length != 0 && (
                    <>
                      <p className="pb-1 pr-1 text-sm font-medium text-left text-gray-500">
                        {question}
                      </p>
                      <div className="relative mb-4">
                        <select
                          className="w-full py-2 pl-5 pr-4 text-black transition-shadow duration-150 ease-in-out bg-white border-blue-300 rounded-sm appearance-none focus:outline-none shadow-light-focusable focus:border-blue-200 disabled:text-gray-500 disabled:border-blue-100 disabled:bg-gray-50"
                          value={answers[question]}
                          onChange={(e) => handleSetAnswer(e.target.value)}
                          required
                        >
                          <option value="">Pick option...</option>
                          {options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute top-0 right-[16px] w-4 h-full -rotate-90">
                          <Chevron />
                        </div>
                      </div>
                    </>
                  )
                ) : (
                  <Input
                    label={question}
                    value={answers[question] || ""}
                    onChange={handleSetAnswer}
                    required
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  )
}

export default RedeemFormPrintful
