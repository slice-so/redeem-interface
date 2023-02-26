const Logo = ({ className = "" }) => {
  return (
    <svg
      width="494"
      height="487"
      viewBox="0 0 494 487"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className || "w-full h-full"}
    >
      <path
        d="M7.68172 101.341L221.162 471.253C232.764 491.357 261.779 491.357 273.381 471.253L487.024 101.06C500.52 77.6747 494.079 48.6217 469.23 38.0592C428.799 20.8731 357.183 3.49272e-05 247.816 0C138.428 -3.4934e-05 66.4275 20.8813 25.6908 38.0694C0.684814 48.6202 -5.88441 77.8345 7.68172 101.341Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default Logo
