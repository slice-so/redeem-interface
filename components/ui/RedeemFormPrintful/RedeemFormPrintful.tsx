import Chevron from "@components/icons/Chevron"
import { countryCodes } from "@lib/countryCodes"
import Image from "next/future/image"
import { Dispatch, SetStateAction, useEffect, useRef } from "react"
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
  const product = linkedProducts.length != 0 && linkedProducts[0].product
  const variants = linkedProducts.length != 0 && linkedProducts[0].variants

  const deliveryQuestions: QuestionValue[] = [
    {
      question: "Receiver name",
      hint: ""
    },
    { question: "Delivery address", hint: "" },
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
    { question: "Email", hint: "Used to contact you about your order" }
  ]

  useEffect(() => {
    if (variants.length == 1) setSelectedProduct(variants[0].external_id)
  }, [variants])

  useEffect(() => {
    if (answers["State"] && deliveryQuestions[4].options.length == 0) {
      setAnswers((prev) => ({ ...prev, ["State"]: "" }))
    }
  }, [answers])

  return (
    product && (
      <div className="mb-6">
        <div className="flex justify-center">
          <Image
            src={product.thumbnail_url}
            width={200}
            height={200}
            alt={product.name + " image"}
            className="rounded-md"
          />
        </div>
        <p className="py-6 font-medium">{product.name}</p>
        {(variants.length != 1 || variants[0].name.split(" - ")[1]) && (
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
                    (variants.length == 1 && variant.name.split(" - ")[1]
                      ? " - "
                      : "") +
                    (variant.name.split(" - ")[1]
                      ? variant.name.split(" - ")[1]
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
        )}

        <div>
          <p>Delivery info</p>
          {deliveryQuestions.map(({ question, hint, options }, key) => {
            const handleSetAnswer = (answer: string) => {
              setAnswers((prev) => ({ ...prev, [question]: answer }))
            }

            return (
              <div key={key}>
                {options ? (
                  options.length != 0 && (
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
