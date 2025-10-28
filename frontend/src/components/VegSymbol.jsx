export const VegSymbol = ({ isVeg, size = 4 }) => (
  <span
    role="img"
    aria-label={isVeg ? "Vegetarian" : "Non-Vegetarian"}
    className={`inline-block rounded-full mr-2 ${
      isVeg ? "bg-green-500" : "bg-red-600"
    }`}
    style={{ width: `${size}px`, height: `${size}px` }}
    title={isVeg ? "Vegetarian" : "Non-Vegetarian"}
  />
);
