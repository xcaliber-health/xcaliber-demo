
import React, { useState, useEffect, useContext, useRef } from "react";
import { FileText, Loader2, Copy, Download, Maximize } from "lucide-react";
import Editor from "@monaco-editor/react";
import { AppContext } from "../layouts/DashboardLayout";
import { fetchDocumentPDF, fetchDiagnosticReport } from "../api/documentReference2";

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white/95 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 ${className}`}>
      {children}
    </div>
  );
}

function Button({ children, className = "", ...props }) {
  return (
    <button {...props} className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95 ${className}`}>
      {children}
    </button>
  );
}

export default function DocumentReference() {
  const { sourceId, departmentId, setLatestCurl } = useContext(AppContext);
  const patientId = "4406";
  const category = "lab-result";

  const [activeTab, setActiveTab] = useState("text");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jsonValid, setJsonValid] = useState(true);

  useEffect(() => {
    if (!sourceId || !departmentId) return;

    async function loadData() {
      setLoading(true);
      try {
        const pdfPromise = fetchDocumentPDF({ patientId, departmentId, category, sourceId, setLatestCurl }).catch(err => {
          console.error("PDF fetch error:", err);
          return null;
        });

        const jsonPromise = fetchDiagnosticReport({ patientId, departmentId, category, sourceId, setLatestCurl }).catch(err => {
          console.error("JSON fetch error:", err);
          return null;
        });

        const [pdf, json] = await Promise.all([pdfPromise, jsonPromise]);
        setPdfUrl(pdf);
        setJsonData(json);

        try {
          JSON.stringify(json);
          setJsonValid(true);
        } catch {
          setJsonValid(false);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [sourceId, departmentId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const jsonContainerRef = useRef(null);

  const handleFullscreen = () => {
    if (jsonContainerRef.current) {
      jsonContainerRef.current.requestFullscreen();
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden">
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
          <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md border border-gray-200">
            <span className="text-sm text-gray-600">Patient ID:</span>
            <span className="ml-2 text-sm font-bold text-indigo-600">{patientId}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 px-6">
        <Button className={activeTab === "text" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"} onClick={() => setActiveTab("text")}>
          PDF
        </Button>
        <Button className={activeTab === "json" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"} onClick={() => setActiveTab("json")}>
          JSON
        </Button>
      </div>

      <div className="flex-1 px-6 pb-6 pt-4 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden p-6">
              {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="animate-spin h-6 w-6 text-indigo-500" />
                  </div>
                ) : activeTab === "text" ? (
                  <div className="flex-1 flex flex-col h-full">
                    <iframe
                      src={pdfUrl}
                      title="PDF Viewer"
                      className="w-full h-full rounded-2xl border border-gray-200 shadow-lg"
                      style={{ backgroundColor: "white", border: "none" }}
                    />
                  </div>
            ) : activeTab === "text" ? (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 rounded-2xl p-4">
                <div className="w-full h-full relative max-w-5xl">
                  <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl transform transition-transform duration-300 hover:scale-[1.005]"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 rounded-2xl pointer-events-none"></div>
                  <div className="relative h-full rounded-2xl overflow-hidden border-4 border-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] ring-1 ring-gray-900/5">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 z-10"></div>
                    <iframe
                      src={pdfUrl}
                      title="PDF Viewer"
                      className="w-full h-full bg-white"
                      style={{
                        border: 'none',
                        display: 'block'
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
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
                  </div>
                  <div className={`text-sm font-medium ${jsonValid ? "text-green-600" : "text-red-600"}`}>
                    {jsonValid ? "✅ Valid JSON" : "❌ Invalid JSON"}
                  </div>
                </div>

                <div ref={jsonContainerRef} className="flex-1 overflow-hidden">
                  <Editor
                    height="100%"
                    defaultLanguage="json"
                    value={JSON.stringify(jsonData, null, 2)}
                    theme="vs-light"
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: "on",
                      formatOnPaste: true,
                      formatOnType: true,
                      wordWrap: "on",
                      stickyScroll: { enabled: false },
                    }}
                  />
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
