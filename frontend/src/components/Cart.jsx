import React from "react";
import CartItemCard from "./CartItemCard.jsx";
import { useCartContext } from "../context/CartProvider.jsx";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, addToCart, removeFromCart } = useCartContext();
  const navigate = useNavigate();

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div
          className="flex overflow-x-auto space-x-4"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {cartItems.map((item) => (
            <div
              key={item.id}
              style={{ scrollSnapAlign: "start", flex: "0 0 auto" }}
            >
              <CartItemCard
                item={item}
                // For adding, pass minimal item data required
                onAdd={() =>
                  addToCart({
                    id: item.id,
                    image: item.image,
                    name: item.name,
                    description: item.description,
                    isVeg: item.isVeg,
                    price: item.price,
                  })
                }
                onRemove={() => removeFromCart(item.id)}
              />
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate("/checkout/review")}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        disabled={cartItems.length === 0}
        title={cartItems.length === 0 ? "Your cart is empty" : "Go to Order Review"}
      >
        Go to Checkout
      </button>
    </div>
  );
};

export default Cart;
