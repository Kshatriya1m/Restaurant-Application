import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faSearch,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function Header({
  name = "",
  tableNumber = "—",
  selectedCategory,
  onSelectCategory,
  onCartToggle,
  onSearch,
}) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const menuItems = [
    { label: "Offer", value: "offer" },
    { label: "Drinks", value: "drinks" },
    { label: "Veg", value: "veg" },
    { label: "Non-Veg", value: "non-veg" },
  ];

  const handleBack = () => {
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  return (
    <>
      <div className="flex justify-between text-3xl p-1 pl-0 m-2 ml-0 items-center">
        <button aria-label="Go back" className="p-2" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="text-center">
          <h1 className="text-2xl">Welcome, {name || "Guest"}</h1>
          <p className="text-xs">Table {tableNumber}</p>
        </div>
        <button aria-label="View cart" className="p-2" onClick={onCartToggle}>
          <FontAwesomeIcon icon={faShoppingCart} size="sm" />
        </button>
      </div>

      <div className="flex justify-center mt-1 relative">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-600"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          className="rounded-xl border border-gray-700 text-base p-2 pl-10 min-w-[320px] bg-gray-100 placeholder-gray-800"
          placeholder="Search for dishes..."
          aria-label="Search for dishes"
          autoComplete="off"
        />
      </div>

      <nav className="mt-4 ml-3">
        <ul className="flex space-x-4">
          {menuItems.map(({ label, value }) => (
            <li
              key={value}
              onClick={() => onSelectCategory(value)}
              className={`cursor-pointer m-2 ${
                selectedCategory === value
                  ? "font-bold underline text-red-500"
                  : ""
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onSelectCategory(value);
                }
              }}
            >
              {label}
            </li>
          ))}
        </ul>
        <hr />
      </nav>
    </>
  );
}

export default Header;
