


import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}

const MetadataSection = ({ metadata }) => {
  if (!metadata) return null;

  const obj = metadata;
  const fields = [
    { key: "document_class", label: "Document Class" },
    { key: "document_status", label: "Document Status" },
    { key: "confidence_score", label: "Confidence Score" },
    { key: "assigned_to", label: "Assigned To" },
    { key: "provider_user_name", label: "Provider" },
    { key: "servicing_facility", label: "Facility" },
    { key: "created_date", label: "Created Date" },
    { key: "last_modified_datetime", label: "Last Modified" },
    { key: "is_phi", label: "Contains PHI" },
    { key: "sign_off", label: "Signed Off" },
  ];

  const formatValue = (key, val) => {
    if (val === null || val === undefined) return null;
    if (typeof val === "boolean") return val ? "Yes" : "No";
    if (key.includes("date")) return new Date(val).toLocaleDateString();
    return val;
  };


  return (
  <div className="text-xs">
    {fields.map((f) => {
      const val = formatValue(f.key, obj[f.key]);
      if (!val) return null;
      return (
        <div key={f.key} className="mb-1">
          <div className="text-xs text-gray-600">{f.label}</div>
          <div className="text-sm font-semibold">{val}</div>
        </div>
      );
    })}
  </div>
);

};


const EntitiesSection = ({ entities }) => {
  if (!entities) return null;

  return (
    //<div className="bg-white rounded-lg border border-gray-200 shadow p-2 mb-2 text-xs">
    <div className="text-xs">
      {Object.keys(entities).map((section) => {
        // Skip rendering this section if no entities present or empty array
        if (
          !entities[section] ||
          !Array.isArray(entities[section]) ||
          entities[section].length === 0
        ) {
          return null; // do not show "No section found" text, just skip entirely
        }

        return (
          <div key={section} className="mb-2">
            <h3 className="font-semibold mb-1 text-sm">
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </h3>
            {entities[section].map((item, idx) => (
              <div key={idx} className="mb-1">
                {item.entity_value && (
                  <div className="text-xs text-gray-600">{item.entity_value}</div>
                )}
                {item.lab_test_findings && (
                  <div className="text-sm font-semibold">{item.lab_test_findings}</div>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};


export default function DocumentLabeling() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [entities, setEntities] = useState(null);
  const [activeTab, setActiveTab] = useState("metadata");

  const [loadingPdf, setLoadingPdf] = useState(true);
const [loadingMetadata, setLoadingMetadata] = useState(true);
const [loadingEntities, setLoadingEntities] = useState(true);


  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const fetchPdfList = async () => {
      try {
        const res = await fetch(
          "https://blitz.xcaliberapis.com/sample/bff/labeldocuments"
        );
        const data = await res.json();
        setPdfFiles(data.documents || []);
        if (data.documents?.length > 0) setSelectedPdf(data.documents[0]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPdfList();
  }, []);

  useEffect(() => {
    if (!selectedPdf) return;

    const fetchPdfData = async () => {
      try {
        const resPdf = await fetch(
          `https://blitz.xcaliberapis.com/sample/bff/labeldocuments/${selectedPdf}/pdf`
        );
        const dataPdf = await resPdf.json();
        setPdfData(dataPdf.base64);

        const resMeta = await fetch(`/metadata/${selectedPdf}.json`);
        const dataMeta = await resMeta.json();
        setMetadata(dataMeta);

        const resEntities = await fetch(`/entities/${selectedPdf}.json`);
        const dataEntities = await resEntities.json();
        setEntities(dataEntities);
      } catch (err) {
        console.error(err);
      }
    };

    

    fetchPdfData();
  }, [selectedPdf]);

  const pdfDisplayNames = pdfFiles.reduce((acc, file, index) => {
    if (index === 0) acc[file] = "Diagnostic Report";
    else if (index === 1) acc[file] = "Discharge Summary";
    else acc[file] = file;
    return acc;
  }, {});

  return (
    <div className="h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      <div className="flex-shrink-0 p-4 pb-2">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI-Ready Labeled Dataset
            </h1>
            <p className="text-sm text-gray-600">View and label PDF documents</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 pb-4 overflow-hidden min-h-0">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PDF Viewer */}
          <div className="flex flex-col overflow-hidden flex-1 max-h-[750px]">
            <div className="flex gap-3 mb-3 flex-wrap">
              {pdfFiles.map((file) => (
                <Button
                  key={file}
                  onClick={() => setSelectedPdf(file)}
                  className={
                    file === selectedPdf
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700"
                  }
                >
                  {pdfDisplayNames[file] || file}
                </Button>
              ))}
            </div>

            <div className="flex-1 border rounded-lg overflow-auto bg-white shadow-xl min-h-0">
              {pdfData ? (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                  <div className="h-full min-h-[500px]">
                    <Viewer
                      fileUrl={`data:application/pdf;base64,${pdfData}`}
                      plugins={[defaultLayoutPluginInstance]}
                      style={{ height: "100%" }}
                    />
                  </div>
                </Worker>
              ) : (
                <p className="p-4 text-gray-500">Loading PDF...</p>
              )}
            </div>
          </div>

          {/* Metadata / Entities */}
          
            <div className="flex flex-col overflow-hidden flex-1 max-h-[750px]">
  <div className="flex gap-2 mb-3">
    <Button
      className={activeTab === "metadata" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}
      onClick={() => setActiveTab("metadata")}
    >
      Labels
    </Button>
    <Button
      className={activeTab === "entities" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}
      onClick={() => setActiveTab("entities")}
    >
      Entities
    </Button>
  </div>

  {/* Single card container wraps both sections */}
  <div className="flex-1 overflow-y-auto p-2 bg-white border border-gray-200 rounded-lg shadow min-h-0">
    {activeTab === "metadata" && <MetadataSection metadata={metadata} />}
    {activeTab === "entities" && <EntitiesSection entities={entities} />}
  </div>


          </div>
        </div>
      </div>
    </div>
  );
}
