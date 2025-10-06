
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
  const { sourceId, departmentId } = useContext(AppContext);
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
        const pdfPromise = fetchDocumentPDF({ patientId, departmentId, category, sourceId }).catch(err => {
          console.error("PDF fetch error:", err);
          return null;
        });

        const jsonPromise = fetchDiagnosticReport({ patientId, departmentId, category, sourceId }).catch(err => {
          console.error("JSON fetch error:", err);
          return null;
        });

        const [pdf, json] = await Promise.all([pdfPromise, jsonPromise]);
        setPdfUrl(pdf);
        setJsonData(json);

        try {
          JSON.stringify(json); // quick validity check
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

  // const handleFullscreen = () => {
  //   document.documentElement.requestFullscreen();
  // };
  const jsonContainerRef = useRef(null);

const handleFullscreen = () => {
  if (jsonContainerRef.current) {
    jsonContainerRef.current.requestFullscreen();
  }
};


  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-4 pb-1">
        <div className="max-w-6xl mx-auto flex items-center gap-3 mb-2">
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

      <div className="flex gap-2 p-4">
        <Button className={activeTab === "text" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"} onClick={() => setActiveTab("text")}>
          PDF
        </Button>
        <Button className={activeTab === "json" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"} onClick={() => setActiveTab("json")}>
          JSON
        </Button>
      </div>

      <div className="flex-1 px-4 pb-2 overflow-hidden max-h-[500px]">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden relative">
            <div className="absolute top-4 right-4 text-sm font-medium text-gray-800">
              Patient ID: <span className="font-bold">{patientId}</span>
            </div>

            <div className="flex-1 flex flex-col p-3 overflow-hidden min-h-0">
              <div className="flex-1 overflow-hidden">
                <Card className="h-full p-3 overflow-auto ">
                  {loading ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="animate-spin h-6 w-6 text-indigo-500" />
                    </div>
                  ) : activeTab === "text" ? (
                    <iframe src={pdfUrl} title="PDF Viewer" className="w-full h-full border rounded-lg" />
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
                          }}
                        />
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
