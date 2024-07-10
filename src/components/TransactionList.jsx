import React, { useState, useEffect } from "react";
import AddTransactionModal from "./AddTransactionModal";
import EditTransactionModal from "./EditTransactionModal";
import DeleteTransaction from "./DeleteTransaction";
import UploadCSVModal from "./UploadCSVModal";
import { MdOutlineEdit } from "react-icons/md";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/transactions/getPaginatedTransactions?page=${page}`
      );

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const fetchTransactionById = async (transactionId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/transactions/getSingleTransaction/${transactionId}`
      );
      const data = await res.json();
      setEditingTransaction(data);
      setIsEditModalOpen(true);
    } catch (err) {
      console.error("Error fetching transaction:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="container  mx-auto p-4 text-sm">
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        refreshTransactions={fetchTransactions}
      />
      <EditTransactionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        transaction={editingTransaction}
        refreshTransactions={fetchTransactions}
      />
      <UploadCSVModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        refreshTransactions={fetchTransactions}
      />
      <div className="flex justify-center ">
        <div className="">
          <div className="flex-col items-center justify-center min-w-full ">
            <div className="flex justify-between bg-slate-150  border-solid border border-gray-200 max-w-[763px] p-2">
              <h1 className=" text-gray-500">Transactions</h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsCSVModalOpen(true)}
                  className="px-4 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Upload CSV
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Transaction
                </button>
              </div>
            </div>
            <table className=" bg-white border border-gray-300  shadow-2xl ">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-4 border-b-2  ">Date</th>
                  <th className="px-4 py-4 border-b-2">Description</th>
                  <th className="px-4 py-4 border-b-2">Original Amount ($)</th>
                  <th className="px-4 py-4 border-b-2">Amount in INR</th>
                  <th className="px-4 py-4 border-b-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  
                  <tr
                    key={transaction.id}
                    className=" relative group transition duration-200 ease-in hover:scale-105 hover:bg-slate-200"
                  >
                    <td className="px-4 py-4 border-b">
                      {transaction.transaction_date.split("-").reverse().join("-") }
                    </td>
                    <td className="px-4 py-4 border-b max-w-[200px] truncate">
                      {transaction.description}
                    </td>
                    <td className="px-4 py-4 border-b">
                      <div className="flex items-center">
                        <span className="mr-1">$</span>
                        <span>{transaction.amount}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 border-b">
                      <div className="flex items-center">
                        <span>{(transaction.amount * 80).toFixed(2)}</span>
                        <span className="ml-1">INR</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 border-b">
                      <div className="flex space-x-2 absolute right-0 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100  transition-opacity">
                        <button
                          onClick={() => fetchTransactionById(transaction.id)}
                          className="hover:bg-white rounded-full p-4"
                        >
                          <MdOutlineEdit />
                        </button>
                        <DeleteTransaction
                          transactionId={transaction.id}
                          refreshTransactions={fetchTransactions}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between bg-slate-150 bg-white  border-solid border border-gray-200 max-w-[763px] p-2">
              {/* <h1 className=" text-gray-500">Transactions</h1> */}
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="py-1 px-4 bg-gray-300 rounded mr-2 hover:bg-gray-400"
              >
                Previous
              </button>
              <div className=" shadow-2xl bg-slate-200 px-2 py-1">
                Page - {page}
              </div>
              <button
                onClick={handleNextPage}
                className="py-1 px-4 bg-gray-300 rounded hover:bg-gray-400"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4"></div>
    </div>
  );
};

export default TransactionList;
