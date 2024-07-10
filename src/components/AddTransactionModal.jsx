import React, { useState } from "react";

const AddTransactionModal = ({ isOpen, onClose, refreshTransactions }) => {
  const [form, setForm] = useState({
    transaction_date: "",
    description: "",
    amount: "",
    currency: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "http://localhost:5000/api/transactions/addTransaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (res.ok) {
        refreshTransactions();
        onClose();
      } else {
        console.error("Failed to add transaction");
      }
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  return (
    isOpen && (
      <div className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-md relative w-96">
          <button
            className="absolute top-2 right-2 text-xl font-bold"
            onClick={onClose}
          >
            &times;
          </button>
          <h2 className="text-xl mb-4">Add Transaction</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">Date</label>
              <input
                type="date"
                name="transaction_date"
                value={form.transaction_date}
                onChange={handleChange}
                className="w-full p-2 border"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Description</label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full p-2 border"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full p-2 border"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Currency</label>
              <input
                type="text"
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full p-2 border"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-4 p-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddTransactionModal;
