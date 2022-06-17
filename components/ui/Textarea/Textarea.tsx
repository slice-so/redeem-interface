import React, { InputHTMLAttributes, useState } from "react"
import { Question } from ".."

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  value: string
  className?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  inverted?: boolean
  required?: boolean
  rows?: number
  previewBox?: string
  markdownView?: boolean
  question?: JSX.Element
  onChange?: (...args: any[]) => any
}

const Textarea: React.FC<Props> = (props) => {
  const {
    value,
    className,
    label,
    placeholder,
    disabled,
    inverted,
    required,
    rows = 3,
    previewBox,
    markdownView = true,
    question,
    onChange
  } = props
  const [showPreview, setShowPreview] = useState(false)
  const [htmlContent, setHtmlContent] = useState("")

  const handleShowPreview = async () => {
    const markdownToHtml = (await import("@lib/markdownToHtml")).default

    if (!showPreview) {
      setHtmlContent(await markdownToHtml(value))
    }
    setShowPreview((showPreview) => !showPreview)
  }

  const rootClassName = `peer py-2 mb-[-7px] pl-5 w-full appearance-none transition-all duration-150 rounded-t-sm shadow-light-focusable ease-in-out pr-3 border-t-0 border-r-0 border-l-0 border-b-[3px] focus:outline-none ${
    className ? className : ""
  } ${
    inverted
      ? "bg-black text-white border-blue-600 focus:border-sky-300 placeholder-gray-500 disabled:text-gray-400 disabled:border-blue-800 disabled:bg-gray-900"
      : "bg-white text-black border-blue-300 focus:border-sky-600 placeholder-gray-400 disabled:text-gray-500 disabled:border-blue-100 disabled:bg-gray-50"
  }`

  return (
    <label>
      {label && (
        <div className="relative flex items-center pb-2">
          <p
            className={`text-sm pr-1 font-semibold text-left ${
              inverted ? "text-gray-200" : "text-gray-700"
            }`}
          >
            {label}
          </p>

          {markdownView && !showPreview && (
            <Question
              text={
                <>
                  {question}
                  <p>
                    You can use{" "}
                    <a
                      className="highlight"
                      href="https://www.markdownguide.org/cheat-sheet/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      markdown syntax
                    </a>{" "}
                    to add elements such as headings, links or lists.{" "}
                  </p>
                </>
              }
            />
          )}
          {markdownView && value && (
            <a
              className="absolute top-0 right-0 flex items-center h-full pb-2 mr-1 text-sm text-blue-600"
              onClick={async () => await handleShowPreview()}
            >
              {!showPreview ? "Show preview" : "Hide preview"}
            </a>
          )}
        </div>
      )}
      {!showPreview ? (
        <div className="mb-3 overflow-hidden rounded-t-sm shadow-light-focusable">
          <textarea
            value={value}
            placeholder={placeholder}
            className={rootClassName}
            disabled={disabled}
            rows={rows}
            required={required}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      ) : (
        <div
          className={
            previewBox
              ? previewBox
              : "px-3 py-6 prose text-left bg-white rounded-sm shadow-light-focusable"
          }
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      )}
    </label>
  )
}

export default Textarea
