import { useState, useEffect } from "react";
import API_BASE from "../api"; // make sure this exists

export function useDishes() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // flag to prevent setState if unmounted

    const fetchDishes = async () => {
      try {
        const response = await fetch(`${API_BASE}/menu`);
        if (!response.ok) throw new Error("Failed to fetch dishes");
        const data = await response.json();
        if (isMounted) setDishes(data);
      } catch (err) {
        console.error("❌ Error fetching dishes:", err);
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDishes();

    return () => {
      isMounted = false;
    };
  }, []);

  return { dishes, loading, error };
}
