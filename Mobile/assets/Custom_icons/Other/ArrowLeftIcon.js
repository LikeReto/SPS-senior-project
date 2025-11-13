const ArrowLeftIcon = ({ size = 24, color = "currentColor", className = "" }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        name="ArrowLeftIcon"
        className={`lucide lucide-arrow-left ${className}`}
      >
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </svg>
    );
  };
  
  export default ArrowLeftIcon;
  