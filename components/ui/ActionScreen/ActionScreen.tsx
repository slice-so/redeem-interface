import { FC } from "react"
import { Button } from "@components/ui"
import { NextSeo } from "next-seo"

export interface ActionScreenProps {
  highlightTitle?: string
  title?: string
  text?: JSX.Element | string
  helpText?: JSX.Element | string
  href?: string
  loading?: boolean
  buttonLabel?: string
  buttonLabelSecondary?: string
  onClick?: any
  onClickSecondary?: any
}

const ActionScreen: FC<ActionScreenProps> = ({
  text = "",
  buttonLabel = "",
  buttonLabelSecondary = "",
  highlightTitle = "",
  title = "",
  helpText = "",
  href = "",
  loading = false,
  onClick = () => null,
  onClickSecondary = () => null,
}) => {
  return (
    <main className="w-full max-w-screen-sm mx-auto">
      {title && <NextSeo title={title} />}
      <div className="flex flex-col items-center text-center">
        {highlightTitle && <h1>{highlightTitle}</h1>}
        {text && typeof text === "string" ? (
          <h3 className="font-semibold mb-7">{text}</h3>
        ) : (
          text
        )}
        {helpText && typeof helpText === "string" ? (
          <p className="opacity-70 mb-7">{helpText}</p>
        ) : (
          helpText
        )}
        {(buttonLabel || loading) && loading ? (
          <Button loading />
        ) : href ? (
          <Button label={buttonLabel} href={href} />
        ) : (
          <Button label={buttonLabel} onClick={onClick} />
        )}
        {buttonLabelSecondary && (
          <a className="mt-8 highlight" onClick={onClickSecondary}>
            {buttonLabelSecondary}
          </a>
        )}
      </div>
    </main>
  )
}

export default ActionScreen
