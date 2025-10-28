import React, { useState } from "react";

const EntryForm = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [tableNumber, setTableNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !tableNumber) {
      alert("Please enter your name and table number");
      return;
    }
    onSubmit({ name, tableNumber });
  };

  return (
    <div className="flex flex-col bg-white p-7 rounded-2xl border border-gray-200 shadow-md">
      <center>
        <h2 className="font-semibold text-2xl">Welcome!</h2>
        <small className="text-sm text-gray-500">
          Enter your details to start ordering.
        </small>
      </center>
      <form
        onSubmit={handleSubmit}
        className="max-w-full min-w-72 space-y-4 pt-4"
      >
        <div>
          <label htmlFor="name" className="block font-medium mb-1 text-md">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border text-red-400 bg-red-50 border-red-200 rounded-xl px-3 py-2"
            placeholder="Your Name"
            required
          />
        </div>
        <div>
          <label htmlFor="tableNumber" className="block font-medium mb-1">
            Table Number
          </label>
          <input
            id="tableNumber"
            type="number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="w-full border text-red-400 bg-rose-50 border-red-200 rounded-xl px-3 py-2"
            placeholder="Table Number"
            required
            min={1}
          />
        </div>
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded-xl w-full hover:bg-red-600"
        >
          Start Ordering
        </button>
      </form>
    </div>
  );
};

export default EntryForm;
