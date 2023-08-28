import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { QuestionValue } from "../CreateFormInput/CreateFormInput"
import { useAccount } from "wagmi"
import Input from "../Input"
import Chevron from "@components/icons/Chevron"
import { countryCodes } from "@lib/countryCodes"
import { Answers } from "../RedeemForm/RedeemForm"

type Props = {
  answers: Answers
  setAnswers: Dispatch<SetStateAction<Answers>>
}

const RedeemForm = ({ answers, setAnswers }: Props) => {
  const { connector } = useAccount()

  const deliveryQuestions: QuestionValue[] = [
    {
      question: "Full name",
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
  const isCoinbaseWallet = connector?.id == "coinbaseWallet"
  if (isCoinbaseWallet) {
    deliveryQuestions.pop()
  }

  const deliveryInfo = answers?.deliveryInfo

  // useEffect(() => {
  //   if (deliveryInfo["State"] && deliveryQuestions[4].options.length == 0) {
  //     setAnswers((prev) => ({
  //       ...prev,
  //       deliveryInfo: { ...prev.deliveryInfo, [`State`]: "" }
  //     }))
  //   }
  // }, [answers])

  const handleSetAnswer = (question: string, value: string) => {
    // const answer = answers || {}
    // const deliveryInfo = answer.deliveryInfo || []
    // deliveryInfo[question] = value
    const deliveryInfo = answers?.deliveryInfo || {}
    deliveryInfo[`${question}`] = value

    console.log({ question, value })

    setAnswers((prev) => ({ ...prev, deliveryInfo }))
  }

  return (
    <>
      {deliveryQuestions.map(({ question, hint, options }, key) => {
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
                      value={deliveryInfo && deliveryInfo[question]}
                      onChange={(e) =>
                        handleSetAnswer(question, e.target.value)
                      }
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
                value={(deliveryInfo && deliveryInfo[question]) || ""}
                handleOnChangeCustom={(e) =>
                  handleSetAnswer(question, e.target.value)
                }
                required
              />
            )}
          </div>
        )
      })}

      {isCoinbaseWallet && (
        <p className="pt-4 text-sm text-blue-600">
          Order details and tracking information will be notifyed on your <br />{" "}
          <strong>Coinbase Wallet</strong>
        </p>
      )}
    </>
  )
}

export default RedeemForm
