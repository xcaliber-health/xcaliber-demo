import React, { useState } from "react";

const PdfUploader = () => {
  const [file, setFile] = useState(null);
  const [requestId, setRequestId] = useState("");
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file first!");
      return;
    }

    const formData = new FormData();
    formData.append("pdfFile", file);

    try {
      setStatus("Uploading...");
      const res = await fetch("https://blitz.xcaliberapis.com/sample/bff/api/pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await res.json();
      console.log(data)
      setRequestId(data.id);
      setStatus("Upload successful!");
    } catch (err) {
      console.error(err);
      setStatus("Upload failed: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>Upload PDF</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        style={{ display: "block", marginTop: "10px" }}
      >
        Upload
      </button>

      {status && <p>{status}</p>}
      {requestId && <p>Request ID: <b>{requestId}</b></p>}
    </div>
  );
};

export default PdfUploader;
