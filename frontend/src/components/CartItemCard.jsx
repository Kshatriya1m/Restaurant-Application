import React from "react";

const CartItemCard = ({ item, onAdd, onRemove }) => {
  const { name, quantity, price, id, _id } = item;

  const itemId = id || _id;

  return (
    <div className="flex justify-between items-center border p-3 rounded mb-2 shadow">
      <div>
        <h4 className="font-semibold text-lg">{name}</h4>
        <p className="text-sm text-gray-600">Quantity: {quantity}</p>
        <p className="text-sm font-medium">Total: ₹{(price * quantity).toFixed(2)}</p>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onRemove(itemId)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          aria-label={`Remove one ${name}`}
        >
          −
        </button>
        <span className="text-md">{quantity}</span>
        <button
          onClick={() =>
            onAdd({
              id: itemId,
              image: item.image,
              name: item.name,
              description: item.description,
              isVeg: item.isVeg,
              price: item.price,
            })
          }
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          aria-label={`Add one more ${name}`}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
