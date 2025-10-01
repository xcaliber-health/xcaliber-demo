// src/pages/PdfViewer.jsx

import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// ✅ Set workerSrc to avoid worker loading errors
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfViewer({
  url,
  className = "",
  initialPage = 1,
  initialScale = 1.0,
}) {
  const [numPages, setNumPages] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [scale, setScale] = useState(initialScale);
  const [loadingError, setLoadingError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(initialPage);
    setScale(initialScale);
    setNumPages(null);
    setLoadingError(null);
    setLoading(true);
  }, [url, initialPage, initialScale]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (err) => {
    console.error("PDF load error:", err);
    setLoading(false);
    setLoadingError(err?.message || "Failed to load PDF");
  };

  return (
    <div className={`w-full h-full flex flex-col ${className}`}>
      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded border"
            disabled={page <= 1}
          >
            ◀ Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(numPages || p + 1, p + 1))}
            className="px-3 py-1 rounded border"
            disabled={numPages ? page >= numPages : false}
          >
            Next ▶
          </button>
          <span>
            Page{" "}
            <input
              type="number"
              value={page}
              onChange={(e) => {
                const v = Number(e.target.value || 1);
                if (v >= 1 && (!numPages || v <= numPages)) setPage(v);
              }}
              className="w-12 px-1 border rounded"
            />{" "}
            / {numPages ?? "?"}
          </span>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 border rounded bg-white"
        >
          Open PDF
        </a>
      </div>

      {loading && (
        <div className="text-center p-4 text-gray-500">Loading PDF…</div>
      )}
      {loadingError && (
        <div className="text-center p-4 text-red-600">
          Error: {loadingError}
        </div>
      )}

      {!loadingError && (
        <div className="overflow-auto flex-1 p-2 bg-gray-100 rounded">
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
          >
            <Page pageNumber={page} scale={scale} />
          </Document>
        </div>
      )}
    </div>
  );
}
