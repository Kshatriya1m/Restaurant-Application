const VegSymbol = ({ size = 24, color = "green" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Square border */}
    <rect
      x="5"
      y="5"
      width="90"
      height="90"
      fill="white"
      stroke={color}
      strokeWidth="10"
    />
    {/* Circle */}
    <circle cx="50" cy="50" r="30" fill={color} />
  </svg>
);

export default VegSymbol;