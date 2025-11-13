const LaptopMinimalIcon = ({ size = 24, fill, color = "currentColor", className = "" }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={fill ? color : "none"}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`lucide lucide-laptop-minimal-icon lucide-laptop-minimal ${className}`}
      >
        <rect width="18" height="12" x="3" y="4" rx="2" ry="2" />
        <line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    );
  };
  
  export default LaptopMinimalIcon;
  