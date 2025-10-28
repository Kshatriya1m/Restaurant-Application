import React, { useState, useEffect } from "react";

const initialFormState = {
  name: "",
  category: "veg",
  isOffer: false,
  image: "",
  price: "",
  offerPrice: "",
};

function ManageDishes() {
  const [dishes, setDishes] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDishes = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/menu");
      if (!res.ok) throw new Error("Failed to fetch dishes");
      const data = await res.json();
      setDishes(data);
    } catch (err) {
      setError(err.message || "Failed to fetch dishes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // Clear error on any change
    if (error) setError("");

    if (name === "image" && files?.length > 0) {
      setImageFile(files[0]);
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validations
    if (!form.name.trim() || !form.category || !form.price) {
      setError("Name, category, and price are required");
      return;
    }

    const priceNum = Number(form.price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError("Price must be a non-negative number");
      return;
    }

    if (form.isOffer) {
      const offerPriceNum = Number(form.offerPrice);
      if (!form.offerPrice) {
        setError("Offer price is required when 'Is Offer?' is checked");
        return;
      }
      if (isNaN(offerPriceNum) || offerPriceNum < 0) {
        setError("Offer price must be a non-negative number");
        return;
      }
      if (offerPriceNum >= priceNum) {
        setError("Offer price must be less than the regular price");
        return;
      }
    }

    setError("");
    setLoading(true);

    let imageUrl = form.image;

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      try {
        const uploadRes = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error("Image upload failed");
        }

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.imageUrl;
      } catch (uploadError) {
        setError("Image upload failed: " + uploadError.message);
        setLoading(false);
        return;
      }
    }

    const payload = {
      name: form.name.trim(),
      category: form.category,
      isOffer: form.isOffer,
      image: imageUrl,
      price: priceNum,
      offerPrice: form.isOffer ? Number(form.offerPrice) : undefined,
    };

    try {
      let res;
      if (editingId) {
        res = await fetch(`http://localhost:5000/api/menu/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("http://localhost:5000/api/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Request failed");
      }

      await fetchDishes();
      setForm(initialFormState);
      setEditingId(null);
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (dish) => {
    setForm({
      name: dish.name,
      category: dish.category,
      isOffer: dish.isOffer,
      image: dish.image,
      price: dish.price.toString(),
      offerPrice: dish.offerPrice ? dish.offerPrice.toString() : "",
    });
    setEditingId(dish._id);
    setImageFile(null);
    setImagePreview(null);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dish?")) return;

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/menu/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete dish");
      }

      await fetchDishes();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4" id="form-title">
        {editingId ? "Edit Dish" : "Add New Dish"}
      </h2>

      {error && (
        <p
          className="text-red-600 mb-2"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-4 rounded shadow"
        aria-labelledby="form-title"
      >
        <div>
          <label htmlFor="name" className="block mb-1 font-semibold">
            Name *
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
            aria-required="true"
          />
        </div>

        <div>
          <label htmlFor="category" className="block mb-1 font-semibold">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
            aria-required="true"
          >
            <option value="veg">Veg</option>
            <option value="non-veg">Non-Veg</option>
            <option value="drinks">Drinks</option>
            <option value="offer">Offer</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isOffer"
            checked={form.isOffer}
            onChange={handleChange}
            id="isOffer"
          />
          <label htmlFor="isOffer">Is Offer?</label>
        </div>

        <div>
          <label htmlFor="image" className="block mb-1 font-semibold">
            Upload Image
          </label>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full border p-2 rounded"
            aria-describedby="imagePreview"
          />
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview of selected"
              className="mt-2 h-24 object-cover rounded"
              id="imagePreview"
            />
          ) : form.image ? (
            <img
              src={form.image}
              alt={`Current image of ${form.name}`}
              className="mt-2 h-24 object-cover rounded"
              id="imagePreview"
            />
          ) : null}
        </div>

        <div>
          <label htmlFor="price" className="block mb-1 font-semibold">
            Price (₹) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
            min="0"
            step="0.01"
            aria-required="true"
          />
        </div>

        <div>
          <label htmlFor="offerPrice" className="block mb-1 font-semibold">
            Offer Price (₹)
          </label>
          <input
            type="number"
            id="offerPrice"
            name="offerPrice"
            value={form.offerPrice}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${
              form.isOffer && !form.offerPrice ? "border-red-500" : ""
            }`}
            min="0"
            step="0.01"
            placeholder={
              form.isOffer ? "Required when 'Is Offer?' is checked" : ""
            }
            required={form.isOffer}
            disabled={!form.isOffer}
            aria-required={form.isOffer}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center justify-center"
          aria-busy={loading}
          aria-disabled={loading}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          )}
          {editingId ? "Update Dish" : "Add Dish"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setForm(initialFormState);
              setEditingId(null);
              setError("");
              setImageFile(null);
              setImagePreview(null);
            }}
            className="ml-4 px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
      </form>

      <h2 className="text-2xl font-bold mt-10 mb-4">Dishes List</h2>

      {loading && <p>Loading...</p>}
      {!loading && dishes.length === 0 && <p>No dishes found.</p>}

      <ul className="space-y-4">
        {dishes.map((dish) => (
          <li
            key={dish._id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{dish.name}</p>
              <p className="text-sm text-gray-600">{dish.category}</p>
              <p className="text-sm">
                {dish.isOffer && dish.offerPrice !== dish.price ? (
                  <>
                    <span className="text-red-600 font-bold">
                      ₹{dish.offerPrice.toFixed(2)}
                    </span>{" "}
                    <span className="line-through text-gray-400 ml-2">
                      ₹{dish.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <>Price: ₹{dish.price.toFixed(2)}</>
                )}
              </p>
              {dish.image && (
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="mt-2 h-16 rounded object-cover"
                />
              )}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(dish)}
                className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                aria-label={`Edit ${dish.name}`}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(dish._id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                aria-label={`Delete ${dish.name}`}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageDishes;
