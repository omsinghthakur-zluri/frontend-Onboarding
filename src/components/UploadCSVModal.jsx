import React, { useState } from "react";

const UploadCSVModal = ({ isOpen, onClose, refreshTransactions }) => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle"); // States: idle, uploading, success, failure

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      setUploadStatus("uploading"); // Set state to indicate uploading

      const formData = new FormData();
      formData.append("file", file);

      fetch("http://localhost:5000/api/transactions/uploadCSV", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.message) {
            setUploadStatus("success"); // Set state to indicate upload success
            refreshTransactions(); // Refresh transactions after upload
            setTimeout(() => {
              onClose(); // Close the modal after successful upload
              setUploadStatus("idle"); // Reset state to idle after some delay
            }, 2000); // Close modal after 2 seconds
          } else {
            setUploadStatus("failure"); // Set state to indicate upload failure
            console.error("Error uploading CSV:", data.error);
          }
        })
        .catch((error) => {
          setUploadStatus("failure"); // Set state to indicate upload failure
          console.error("Error uploading CSV:", error);
        });
    }
  };

  if (!isOpen) return null;

  let statusMessage = "";
  switch (uploadStatus) {
    case "uploading":
      statusMessage = "Uploading...";
      break;
    case "success":
      statusMessage = "Uploaded successfully!";
      break;
    case "failure":
      statusMessage = "Upload failed. Please try again.";
      break;
    default:
      break;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-96">
        <h2 className="text-xl mb-4">Upload CSV</h2>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Upload
          </button>
        </div>
        {uploadStatus !== "idle" && (
          <div className="mt-4 text-center text-sm text-gray-600">
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadCSVModal;
