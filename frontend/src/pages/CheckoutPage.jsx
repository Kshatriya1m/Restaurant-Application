import React, { useState } from "react";
import Header from "../components/Header";
import Dishes from "../components/Dishes";
import Offers from "../components/Offers"; // Make sure this matches the component name
import FullWidthCarousel from "../components/FullWidthCarousel";
import { useCartContext } from "../context/CartProvider";
import { useDishes } from "../components/useDishes";

function CheckoutPage({ userDetails = {}, onCartToggle }) {
  const [selectedCategory, setSelectedCategory] = useState("veg");
  const { cartItems } = useCartContext();
  const { dishes, loading, error } = useDishes();

  return (
    <div>
      <Header
        name={userDetails.name || "Guest"}
        tableNumber={userDetails.tableNumber || "—"}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onCartToggle={onCartToggle}
      />

      <main className="p-4">
        {loading && <p>Loading dishes...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && (
          <>
            {selectedCategory !== "offer" ? (
              <>
                <FullWidthCarousel dishes={dishes} category={selectedCategory} />
                <Dishes category={selectedCategory} />
              </>
            ) : (
              <Offers />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default CheckoutPage;
