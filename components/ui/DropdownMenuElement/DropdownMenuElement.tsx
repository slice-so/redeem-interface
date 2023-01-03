import Link from "next/link"

type Props = {
  image: JSX.Element
  label: string
  onClick: () => void
  href?: string
}

function DropdownMenu({ href, image, label, onClick }: Props) {
  return (
    <div onClick={onClick}>
      {href ? (
        <Link href={href}>
          <a>
            <div className="flex items-center p-3 dark:text-white hover:bg-blue-600 hover:text-white">
              <div className="ml-3">{image}</div>
              <p className="ml-4 font-normal">{label}</p>
            </div>
          </a>
        </Link>
      ) : (
        <div className="px-3 py-2.5 dark:text-white items-center hover:bg-blue-600 hover:text-white flex cursor-pointer">
          <div className="ml-3">{image}</div>
          <p className="ml-4 font-normal">{label}</p>
        </div>
      )}
    </div>
  )
}

export default DropdownMenu
