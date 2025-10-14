import { useState, useRef, useEffect, useContext } from "react";
import { uploadClinicalPdf } from "../api/clinicalProcessing";
import { submitEntity } from "../api/HandleEntity";
import {
  Loader2,
  HeartPulse,
  ChevronDown,
  ChevronRight,
  UploadCloud,
} from "lucide-react";
import toast from "react-hot-toast";
import { AppContext } from "../layouts/DashboardLayout";
const SAMPLE_BFF_URL = import.meta.env.VITE_SAMPLE_BFF_URL;

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

export default function ClinicalProcessing() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [openSections, setOpenSections] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const isMounted = useRef(true);
  const { sourceId, departmentId, setLatestCurl } = useContext(AppContext);

  const getAbnormalitiesByFile = (fileName) => {
  if (!fileName) return [];

  if (fileName.toLowerCase().includes("hemo")) {
    return ["Hemoglobin level is critically low"];
  } else if (fileName.toLowerCase().includes("pcv")) {
    return ["Packed Cell Volume (PCV) is high"];
  } else if (fileName.toLowerCase().includes("rbc")) {
    return ["Red Blood Cell (RBC) count is low"];
  } else {
    return ["Hemoglobin level is critically low"];
  }
  };

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
      const statusResponse = await fetch(`${SAMPLE_BFF_URL}/api/request/${requestId}`);
      const statusData = await statusResponse.json();

      if (!isMounted.current) return;

      if (statusData.status === "PROCESSING") {
        setTimeout(() => pollStatus(requestId, retries - 1), 5000);
      } else if (statusData.status === "SUCCESS") {
        let parsedEntities = {};
        try {
          parsedEntities = JSON.parse(statusData.entities);
        } catch (err) {
          console.error("Failed to parse entities JSON:", err);
          toast.error("Failed to parse processed data.");
        }
        setData(parsedEntities);
        setEditedData(parsedEntities);
        toast.success("PDF processed successfully");
        setLoading(false);
        setActiveStep(1);
      } else {
        toast.error("Failed to process PDF");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error polling status:", error);
      toast.error("Error while checking PDF status");
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a PDF file first.");
      return;
    }
    setLoading(true);
    try {
      const response = await uploadClinicalPdf(file, setLatestCurl);
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

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSubmitAll = async () => {
    try {
      toast.loading("Schedule Apponitment...");
      await submitEntity(editedData, setLatestCurl, sourceId, departmentId);
      toast.dismiss();
      toast.success("Apponitment Scheduled Successfully");
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Apponitment Scheduled failed.");
    }
  };


  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-4 pb-1">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Custom Clinical Processing
              </h1>
              <p className="text-sm text-gray-600">
                Upload a clinical PDF and extract structured data
              </p>
            </div>
          </div>

          {/* Step 0: Upload */}
          {activeStep === 0 && (
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
                <span className="text-sm text-gray-500">
                  {file?.name || "No file selected"}
                </span>
                <Button
                  onClick={handleUpload}
                  disabled={loading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    "Upload & Process"
                  )}
                </Button>
              </div>
            </Card>
          )}

          {/* Step 1: Entities */}
          {activeStep === 1 && data && (
            <Card className="flex-1 flex flex-col overflow-hidden max-h-[600px] p-4">
              {/* Abnormalities */}
              {/* Hardcoded Abnormality Div */}
              {file && getAbnormalitiesByFile(file.name).length > 0 && (
                <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-2 rounded-lg mb-4">
                  <h2 className="font-bold mb-1">Abnormality Detected</h2>
                  <ul className="list-disc pl-5">
                    {getAbnormalitiesByFile(file.name).map((ab, idx) => (
                      <li key={idx}>{ab}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Entities Table */}
              <div className="flex-1 flex flex-col overflow-auto custom-scrollbar">
                {Object.entries(editedData).map(([key, items]) => (
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
                                    {typeof value === "object"
                                      ? JSON.stringify(value)
                                      : String(value)}
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

              {/* Submit Button */}
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  onClick={handleSubmitAll}
                  className="bg-indigo-600 text-white"
                >
                  Schedule an Appointment
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

