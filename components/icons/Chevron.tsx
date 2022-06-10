const Chevron = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-chevron-left w-full h-full"
      {...props}
    >
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  )
}

export default Chevron
