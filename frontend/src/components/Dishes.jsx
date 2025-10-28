import React, { useEffect, useState } from "react";
import Card from "./Card";

function Dishes({ category }) {
  const [allDishes, setAllDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/menu")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setAllDishes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to load dishes.");
        setAllDishes([]);
        setLoading(false);
      });
  }, []);

  // Filter dishes on frontend by category prop
  const filteredDishes = category
    ? allDishes.filter((dish) => dish.category === category)
    : allDishes;

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!filteredDishes.length)
    return <p>No dishes available for {category || "selected category"}.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredDishes.map((dish) => (
        <Card
          key={dish._id}
          _id={dish._id}
          image={dish.image}
          name={dish.name}
          description={dish.description}
          category={dish.category}
          price={dish.offerPrice != null ? dish.offerPrice : dish.price}
        />
      ))}
    </div>
  );
}

export default Dishes;
