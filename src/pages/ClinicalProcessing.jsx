
import { useState, useRef, useEffect } from "react";
import { uploadClinicalPdf } from "../api/clinicalProcessing";
import { Loader2, HeartPulse, ChevronDown, ChevronRight, UploadCloud } from "lucide-react";
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

export default function ClinicalProcessing() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [openSections, setOpenSections] = useState({});

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const pollStatus = async (requestId, retries = 50) => {
    if (!isMounted.current) return;

    if (retries <= 0) {
      toast.error("PDF processing timed out.");
      setLoading(false);
      return;
    }

    try {
      const statusResponse = await fetch(`https://blitz.xcaliberapis.com/sample/bff/api/request/${requestId}`);
      const statusData = await statusResponse.json();
      console.log("PDF Status Response:", statusData);

      if (!isMounted.current) return;

      if (statusData.status === "PROCESSING") {
        setTimeout(() => pollStatus(requestId, retries - 1), 5000);
      } else if (statusData.status === "SUCCESS") {
        // FIX: Parse entities before setting data
        let parsedEntities = {};
        try {
          parsedEntities = JSON.parse(statusData.entities);
        } catch (err) {
          console.error("Failed to parse entities JSON:", err);
          toast.error("Failed to parse processed data.");
        }

        console.log("Parsed Entities:", parsedEntities);

        setData(parsedEntities);
        toast.success("PDF processed successfully");
        setLoading(false);
      } else {
        toast.error("Failed to process PDF");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error polling status:", error);
      if (isMounted.current) {
        toast.error("Error while checking PDF status");
        setLoading(false);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a PDF file first.");
      return;
    }
    setLoading(true);

    try {
      const response = await uploadClinicalPdf(file);
      console.log("Upload response:", response);

      if (response.status === "ACCEPTED") {
        toast.success("PDF upload accepted. Processing started.");
        pollStatus(response.id);
      } else {
        toast.error("Failed to upload PDF");
        setLoading(false);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to process PDF");
      setLoading(false);
    }
  };

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 pb-1">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Custom Clinical Processing
              </h1>
              <p className="text-sm text-gray-600">Upload a clinical PDF and extract structured data</p>
            </div>
          </div>

          {/* Upload Section */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer bg-white border border-gray-300 px-4 py-2 rounded-2xl hover:bg-gray-50 shadow-sm">
                <UploadCloud className="w-5 h-5 text-indigo-500" />
                <span className="text-sm font-medium">Choose PDF</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-500">{file?.name || "No file selected"}</span>
              <Button
                onClick={handleUpload}
                disabled={loading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Upload & Process"}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-2 overflow-hidden min-h-0">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          {data && (
            <Card className="flex-1 flex flex-col overflow-hidden max-h-[600px]">
              <div className="flex-1 flex flex-col p-4 overflow-auto custom-scrollbar">
                {Object.entries(data).map(([key, items]) => (
                  <div key={key} className="py-2">
                    <button
                      onClick={() => toggleSection(key)}
                      className="flex justify-between items-center w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        {openSections[key] ? (
                          <ChevronDown className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-indigo-600" />
                        )}
                        <span className="font-medium capitalize">{key}</span>
                        <span className="text-xs text-gray-500">
                          ({Array.isArray(items) ? items.length : 0})
                        </span>
                      </div>
                    </button>

                    {openSections[key] && Array.isArray(items) && (
                      <div className="overflow-x-auto mt-2 pl-6">
                        <table className="min-w-full text-sm text-left border">
                          <thead className="bg-gray-100 text-gray-700">
                            <tr>
                              {items.length > 0 &&
                                Object.keys(items[0]).map((field) => (
                                  <th key={field} className="px-3 py-2 border">
                                    {field}
                                  </th>
                                ))}
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((item, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                {Object.entries(item).map(([field, value]) => (
                                  <td key={field} className="px-3 py-2 border">
                                    {typeof value === "object" ? JSON.stringify(value) : String(value)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Custom Scrollbar */}
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #e0e7ff #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e0e7ff;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c7d2fe;
        }
      `}</style>
    </div>
  );
}
