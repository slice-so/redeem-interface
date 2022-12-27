import { FC } from "react"
import Spinner from "@components/icons/Spinner"
import Link from "next/link"
import { useAppContext } from "@components/ui/context"
import saEvent from "@utils/saEvent"

interface ButtonProps {
  loading?: boolean
  double?: boolean
  wrapperClassName?: string
  className?: string
  color?: string
  type?: "button" | "submit" | "reset"
  label?: string | JSX.Element
  href?: string
  external?: boolean
  disabled?: boolean
  onClick?: any
  saEventName?: string
}

const Button: FC<ButtonProps> = (props) => {
  const {
    wrapperClassName,
    className = "h-[40px] font-bold tracking-wide rounded-sm overflow-hidden border-white border-[3px] nightwind-prevent",
    color = "text-white bg-blue-600 hover:bg-blue-700 focus:bg-blue-700",
    type,
    label,
    href,
    onClick,
    loading = false,
    double = true,
    external = false,
    disabled = false,
    saEventName = "",
    ...rest
  } = props

  const { color1, color2 } = useAppContext()

  const rootClassName = `px-7 min-w-[150px] focus:outline-none ${className}`

  return (
    <div
      className={`relative inline-block ${wrapperClassName}`}
      onClick={() => (saEventName ? saEvent(saEventName) : null)}
    >
      {href ? (
        !external ? (
          <Link href={href} passHref>
            <button className={`peer relative z-10 ${rootClassName} ${color}`}>
              <div className="flex items-center justify-center">
                <p>{label}</p>
              </div>
            </button>
          </Link>
        ) : (
          <a href={href} target="_blank" rel="noreferrer">
            <button className={`peer relative z-10 ${rootClassName} ${color}`}>
              <div className="flex items-center justify-center">
                <p>{label}</p>
              </div>
            </button>
          </a>
        )
      ) : (
        <button
          className={`peer relative z-10 ${rootClassName} ${
            disabled ? "text-white bg-gray-600 cursor-wait" : color
          }`}
          type={type}
          onClick={!disabled && !loading ? onClick : null}
          disabled={disabled}
        >
          {loading ? (
            <div className="flex items-center justify-center w-full">
              <Spinner color="text-white nightwind-prevent" />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <p>{label}</p>
            </div>
          )}
        </button>
      )}
      {double && (
        <div
          className={`${rootClassName} shadow-light-random absolute top-0 mt-[0.6rem] ml-[0.6rem] mr-[-0.6rem] bg-gradient-to-br ${
            color1[3]
          } ${color2[4]} text-transparent ${
            !disabled
              ? "peer-hover:mt-0 peer-hover:ml-0 peer-hover:mr-0 peer-focus:mt-0 peer-focus:ml-0 peer-focus:mr-0 transition-all duration-150"
              : ""
          }`}
        >
          <div className="relative flex items-center justify-center -z-10">
            <p>{label}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Button
