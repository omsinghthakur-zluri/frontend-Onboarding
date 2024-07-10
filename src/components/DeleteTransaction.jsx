import React from "react";
import { RiDeleteBinLine } from "react-icons/ri";

const DeleteTransaction = ({ transactionId, refreshTransactions }) => {
  const handleDelete = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/transactions/deleteTransaction/${transactionId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        refreshTransactions();
      } else {
        console.error("Failed to delete transaction");
      }
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };

  return (
    <button onClick={handleDelete} className="hover:bg-white rounded-full p-4">
      <RiDeleteBinLine />
    </button>
  );
};

export default DeleteTransaction;
