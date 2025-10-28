import React from "react";
import { useDishes } from "./useDishes";
import { VegSymbol } from "./VegSymbol";

function Offers() {
  const dishes = useDishes();

  // Defensive fallback if dishes is not an array yet
  const dishesArray = Array.isArray(dishes) ? dishes : [];

  const offerDishes = dishesArray.filter((dish) => dish.isOffer);

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {offerDishes.length === 0 ? (
        <p className="text-center text-gray-500">No offers available right now.</p>
      ) : (
        offerDishes.map(({ _id, id, name, image, price, offerPrice, category }) => {
          const dishId = id || _id;
          const finalOfferPrice = typeof offerPrice === "number" ? offerPrice : price;
          const finalPrice = typeof price === "number" ? price : finalOfferPrice;

          return (
            <div
              key={dishId}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={image}
                alt={name}
                className="w-full h-40 object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <div className="flex items-center mb-2 space-x-2">
                  <VegSymbol isVeg={category === "veg"} size={12} />
                  <h3 className="text-lg font-semibold">{name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-red-600 font-bold text-lg">
                    ₹{finalOfferPrice.toFixed(2)}
                  </span>
                  {finalOfferPrice !== finalPrice && (
                    <span className="line-through text-gray-400">
                      ₹{finalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Offers;
