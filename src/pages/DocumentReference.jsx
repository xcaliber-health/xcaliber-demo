
import React, { useState, useEffect, useContext, useRef } from "react";
import { FileText, Loader2, Copy, Download, Maximize } from "lucide-react";
import Editor from "@monaco-editor/react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { AppContext } from "../layouts/DashboardLayout";
import { fetchDocumentPDF, fetchDiagnosticReport } from "../api/documentReference2";
import toast from "react-hot-toast";

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white/95 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 ${className}`}>
      {children}
    </div>
  );
}

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

export default function DocumentReference() {
  const { sourceId, departmentId, setLatestCurl } = useContext(AppContext);

  const [patientId, setPatientId] = useState("4406");
  const [documentId, setDocumentId] = useState("231756");
  const category = "lab-result";

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const [activeTab, setActiveTab] = useState("text");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jsonValid, setJsonValid] = useState(true);

  const [resourceGroups, setResourceGroups] = useState({});
  const [selectedResourceType, setSelectedResourceType] = useState(null);
  const jsonContainerRef = useRef(null);

  useEffect(() => {
    if (!sourceId || !departmentId) return;

    async function loadData() {
      setLoading(true);

      let pdf = null;
      let json = null;

      try {
        try {
          pdf = await fetchDocumentPDF({ patientId, documentId, departmentId, category, sourceId, setLatestCurl });
        } catch (err) {
          console.error("PDF fetch error:", err);
          toast.error(`Failed to load PDF: ${err.message || "Server error"}`);
        }

        try {
          json = await fetchDiagnosticReport({ patientId, documentId, departmentId, category, sourceId, setLatestCurl });
        } catch (err) {
          console.error("JSON fetch error:", err);
          toast.error(`Failed to load JSON: ${err.message || "Server error"}`);
        }

        setPdfUrl(pdf);
        setJsonData(json);

        if (json && json.contained) {
          const grouped = {};
          json.contained.forEach((resource) => {
            const type = resource.resourceType || "Unknown";
            if (!grouped[type]) grouped[type] = [];
            grouped[type].push(resource);
          });
          setResourceGroups(grouped);
        }

        try {
          JSON.stringify(json);
          setJsonValid(true);
        } catch {
          setJsonValid(false);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        toast.error(`Unexpected error: ${err.message || "Something went wrong"}`);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [sourceId, departmentId, patientId, documentId, setLatestCurl]);

  const handleCopy = () => {
    if (selectedResourceType) {
      navigator.clipboard.writeText(JSON.stringify(resourceGroups[selectedResourceType], null, 2));
    } else {
      navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
    }
    toast.success("Copied to clipboard!");
  };

  const handleDownload = () => {
    const blob = new Blob(
      [JSON.stringify(selectedResourceType ? resourceGroups[selectedResourceType] : jsonData, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON downloaded!");
  };

  const handleFullscreen = () => {
    if (jsonContainerRef.current) {
      jsonContainerRef.current.requestFullscreen();
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-6 pb-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Document Viewer
              </h1>
              <p className="text-sm text-gray-600">Viewing PDF & JSON from FHIR APIs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs + Dropdowns */}
      <div className="flex-shrink-0 px-6 pb-3">
        <div className="max-w-7xl mx-auto flex items-end justify-between gap-4">
          <div className="flex gap-3">
            <Button
              className={activeTab === "text" ? "bg-indigo-600 text-white shadow-lg" : "bg-gray-100 text-gray-700"}
              onClick={() => setActiveTab("text")}
            >
              PDF
            </Button>
            <Button
              className={activeTab === "json" ? "bg-indigo-600 text-white shadow-lg" : "bg-gray-100 text-gray-700"}
              onClick={() => setActiveTab("json")}
            >
              JSON
            </Button>
          </div>

          <div className="flex gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Patient ID</label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="4406">4406</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Document ID</label>
              <select
                value={documentId}
                onChange={(e) => setDocumentId(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="231756">231756</option>
                <option value="247589">247589</option>
                <option value="6f5ed691-914d-4d7b-ba07-b33393c291e9">6f5ed691-914d-4d7b-ba07-b33393c291e9</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Viewer */}
      <div className="flex-1 px-6 pb-6 pt-4 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden p-6">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin h-6 w-6 text-indigo-500" />
              </div>
            ) : activeTab === "text" ? (
              pdfUrl ? (
                <div className="w-full h-full rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                    <div style={{ height: "100%" }}>
                      <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} />
                    </div>
                  </Worker>
                </div>
              ) : (
                <div className="flex justify-center items-center h-full text-gray-500">
                  ❌ PDF not available
                </div>
              )
            ) : jsonData ? (
              <div className="flex flex-col h-full">
                {!selectedResourceType ? (
                  Object.keys(resourceGroups).length > 0 ? (
                    <div className="overflow-auto">
                      <table className="min-w-full bg-white">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 border-b text-left">Resource Type</th>
                            <th className="px-4 py-2 border-b text-left">Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(resourceGroups).map(([type, resources]) => (
                            <tr key={type} className="hover:bg-gray-100 cursor-pointer" onClick={() => setSelectedResourceType(type)}>
                              <td className="px-4 py-2 border-b">{type}</td>
                              <td className="px-4 py-2 border-b">{resources.length}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-full text-gray-500">
                      ❌ No JSON resources available
                    </div>
                  )
                ) : (
                  <>
                    <div className="flex justify-between items-center bg-gray-50 border-b p-2">
                      <div className="flex gap-2">
                        <button onClick={handleCopy} className="flex items-center gap-1 text-sm px-2 py-1 rounded bg-gray-100 hover:bg-gray-200">
                          <Copy className="w-4 h-4" /> Copy
                        </button>
                        <button onClick={handleDownload} className="flex items-center gap-1 text-sm px-2 py-1 rounded bg-gray-100 hover:bg-gray-200">
                          <Download className="w-4 h-4" /> Download
                        </button>
                        <button onClick={handleFullscreen} className="flex items-center gap-1 text-sm px-2 py-1 rounded bg-gray-100 hover:bg-gray-200">
                          <Maximize className="w-4 h-4" /> Fullscreen
                        </button>
                        <button onClick={() => setSelectedResourceType(null)} className="flex items-center gap-1 text-sm px-2 py-1 rounded bg-indigo-100 hover:bg-indigo-200">
                          Back
                        </button>
                      </div>
                      <div className={`text-sm font-medium ${jsonValid ? "text-green-600" : "text-red-600"}`}>
                        {jsonValid ? "✅ Valid JSON" : "❌ Invalid JSON"}
                      </div>
                    </div>
                    <div ref={jsonContainerRef} className="flex-1 overflow-hidden">
                      <Editor
                        height="100%"
                        defaultLanguage="json"
                        value={JSON.stringify(resourceGroups[selectedResourceType], null, 2)}
                        theme="vs-light"
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          fontSize: 14,
                          lineNumbers: "on",
                          wordWrap: "on",
                          stickyScroll: { enabled: false },
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex justify-center items-center h-full text-gray-500">
                ❌ JSON data not available
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
