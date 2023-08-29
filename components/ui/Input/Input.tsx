import Arrow from "@components/icons/Arrow"
import Spinner from "@components/icons/Spinner"
import React, { InputHTMLAttributes } from "react"
import { Question } from ".."

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  label?: string
  prefix?: string
  after?: string
  error?: boolean
  loading?: boolean
  inverted?: boolean
  submit?: boolean
  question?: JSX.Element
  questionPosition?: string
  onClickLabel?: string
  prefixAction?: (...args: any[]) => any
  onClick?: (...args: any[]) => any
  onChange?: (...args: any[]) => any
  handleOnChangeCustom?: (...args: any[]) => any
}

const Input: React.FC<Props> = (props) => {
  const {
    className,
    label,
    prefix = "",
    after,
    children,
    error,
    loading,
    disabled,
    inverted,
    submit,
    question,
    questionPosition = "bottom-[20px] left-[-40px] xs:left-0",
    prefixAction,
    onClick,
    onClickLabel,
    onChange,
    handleOnChangeCustom,
    ...rest
  } = props

  const rootClassName = `peer py-2 pl-5 w-full appearance-none transition-shadow duration-100 rounded-t-sm ${
    !prefix && !error ? "shadow-light-focusable" : ""
  } ease-in-out pr-3 border-t-0 border-r-0 border-l-0 border-b-[2px] focus:outline-none ${className} ${
    error
      ? "text-red-500 border-red-400 bg-white focus:border-red-400 shadow-error"
      : inverted
      ? "bg-black text-white border-blue-600 focus:border-sky-300 placeholder-gray-500 disabled:text-gray-400 disabled:border-blue-800 disabled:bg-gray-900"
      : "bg-white text-black border-blue-300 focus:border-sky-600 placeholder-gray-400 disabled:text-gray-500 disabled:border-blue-100 disabled:bg-gray-50"
  }`

  const handleOnChange = (e: any) => {
    if (onChange) {
      onChange(e.target.value)
    }
    return null
  }

  return (
    <label>
      {label && (
        <>
          <div className="relative flex items-center pb-1">
            <p className="pr-1 text-sm font-medium text-left text-gray-500">
              {label}
            </p>
            {question && (
              <Question position={questionPosition} text={question} />
            )}
          </div>
        </>
      )}
      <div
        className={`flex flex-row-reverse mb-4 rounded-t-sm ${
          prefix && !error ? "shadow-light-focusable overflow-hidden" : ""
        }`}
      >
        {onClick && (
          <div
            className={`relative text-sm font-medium group flex items-center justify-center px-5 transition-colors duration-150 text-white nightwind-prevent ${
              error
                ? "cursor-pointer shadow-error bg-red-500"
                : `bg-blue-600 ${
                    !disabled && !loading
                      ? "cursor-pointer hover:bg-blue-700"
                      : ""
                  }`
            }`}
            onClick={!disabled && !loading ? onClick : null}
          >
            {onClickLabel && (
              <span className={`mr-1 ${loading ? "-z-10" : ""}`}>
                {onClickLabel}
              </span>
            )}{" "}
            <div
              className={`w-[1.2rem] h-[1.2rem] text-white nightwind-prevent transition-transform duration-150 group-hover:translate-x-1 ${
                loading ? "-z-10" : ""
              }`}
            >
              <Arrow />
            </div>
            {loading && (
              <div className="absolute flex items-center justify-center w-full h-full">
                <Spinner />
              </div>
            )}
          </div>
        )}
        <input
          className={rootClassName}
          onChange={
            handleOnChangeCustom
              ? (e: any) => handleOnChangeCustom(e)
              : handleOnChange
          }
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          disabled={disabled || loading}
          onWheel={(e) => e.currentTarget.blur()}
          {...rest}
        ></input>
        {prefix && (
          <div
            className={`flex transition duration-150 items-center justify-center px-5 text-gray-600 bg-gray-200 dark:bg-gray-700 border-b-[3px]  ${
              error
                ? "border-red-400 peer-focus:border-red-400 dark:peer-focus:border-red-500 shadow-error"
                : !disabled && !loading
                ? "border-blue-300 text-black peer-focus:border-sky-600 dark:peer-focus:border-sky-300"
                : ""
            } ${
              prefixAction && !disabled && !loading
                ? "cursor-pointer hover:bg-gray-100 hover:text-blue-600"
                : ""
            } ${
              disabled || loading
                ? "text-gray-400 border-blue-100 bg-gray-100"
                : ""
            }`}
            onClick={
              prefixAction && !disabled && !loading
                ? () => prefixAction()
                : null
            }
          >
            {prefix}
          </div>
        )}
      </div>
    </label>
  )
}

export default Input
