
import React, { useState, useEffect } from "react";
import { FileText, Loader2 } from "lucide-react";
import EntitiesTable from "./EntitiesTable";
import samplePDF from "../assets/sample.pdf";

// ✅ Reusable UI Components
function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white/95 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 ${className}`}
    >
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
  const [activeTab, setActiveTab] = useState("text"); // "text" | "entities"
  const [entities, setEntities] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load entities.json
  useEffect(() => {
    fetch("/entities.json")
      .then((res) => res.json())
      .then((data) => setEntities(data))
      .catch((err) => console.error("Error loading entities:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 pb-1">
        <div className="max-w-6xl mx-auto flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Document Processing Demo
            </h1>
            <p className="text-sm text-gray-600">
              Simulating workflow for unstructured data
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-2 overflow-hidden min-h-0">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden relative">
            {/* Patient ID - top right */}
            <div className="absolute top-4 right-4 text-sm font-medium text-gray-800">
              Patient ID: <span className="font-bold">4406</span>
            </div>

            <div className="flex-1 flex flex-col p-3 overflow-hidden min-h-0">
              {/* Tab Buttons */}
              <div className="flex-shrink-0 flex gap-2 mb-3">
                <Button
                  className={`${
                    activeTab === "text"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  } text-sm`}
                  onClick={() => setActiveTab("text")}
                >
                  PDF
                </Button>
                <Button
                  className={`${
                    activeTab === "entities"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  } text-sm`}
                  onClick={() => setActiveTab("entities")}
                >
                  Entities
                </Button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-hidden">
                <Card className="h-full p-3 overflow-auto">
                  {activeTab === "text" ? (
                    <>
                      {loading ? (
                        <Loader2 className="animate-spin h-6 w-6 text-indigo-500" />
                      ) : (
                        // <iframe
                        //   src={`${import.meta.env.BASE_URL}sample.pdf`}
                        //   title="PDF Viewer"
                        //   className="w-full h-full border rounded-lg"
                        // />
                        

                        <iframe
                        src={samplePDF}
                        title="PDF Viewer"
                        className="w-full h-full border rounded-lg"
                        />

                      )}
                    </>
                  ) : (
                    <>
                      <h2 className="font-semibold text-indigo-700 mb-3 text-lg">
                        Extracted Entities
                      </h2>
                      {loading ? (
                        <Loader2 className="animate-spin h-6 w-6 text-indigo-500" />
                      ) : (
                        <EntitiesTable entities={entities} />
                      )}
                    </>
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
