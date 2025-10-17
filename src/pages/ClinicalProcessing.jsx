import { useState, useRef, useEffect, useContext } from "react";
import { submitEntity } from "../api/HandleEntity";
import { getAppointment } from "../api/appointment";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import { Loader2, HeartPulse, ChevronDown, ChevronRight, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import { AppContext } from "../layouts/DashboardLayout";

// Mock PDF list from /public/pdfs
const pdfList = [
  { name: "Hemoglobin Report", file: "/pdfs/lowhemo.pdf" },
  { name: "PCV Report", file: "/pdfs/highPCV.pdf" },
  { name: "RBC Report", file: "/pdfs/lowRBC.pdf" },
];

// Card and Button UI components
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
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [openSections, setOpenSections] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [appointmentInfo, setAppointmentInfo] = useState(null);
  const isMounted = useRef(true);
  const { setLatestCurl } = useContext(AppContext);

  const TIME_FACTOR = 4000; // milliseconds
  const pdfPlugin = defaultLayoutPlugin();

  const getAbnormalitiesByFile = (fileName) => {
    if (!fileName) return [];
    if (fileName.toLowerCase().includes("hemo")) return ["Hemoglobin level is critically low"];
    if (fileName.toLowerCase().includes("pcv")) return ["Packed Cell Volume (PCV) is high"];
    if (fileName.toLowerCase().includes("rbc")) return ["Red Blood Cell (RBC) count is low"];
    return ["Hemoglobin level is critically low"];
  };

  useEffect(() => {
    return () => (isMounted.current = false);
  }, []);

  const mockEntities = {
    Patient: [{ id: "P-001", name: "Jane Doe", gender: "female", birthDate: "1990-05-14" }],
    Observation: [
      { code: "718-7", display: "Hemoglobin [Mass/volume] in Blood", value: "8.2 g/dL", interpretation: "L (Low)" },
      { code: "4544-3", display: "Hematocrit [Volume Fraction] of Blood", value: "49 %", interpretation: "H (High)" },
    ],
    Practitioner: [{ id: "pract-002", name: "Dr. Arjun Mehta", role: "Cardiologist" }],
  };

  const handleProcess = async () => {
    if (!selectedPdf) return toast.error("Please select a PDF first.");

    setLoading(true);
    toast.loading("Processing PDF...");

    await new Promise((res) => setTimeout(res, TIME_FACTOR));
    toast.dismiss();
    toast.success("PDF processed successfully.");

    await new Promise((res) => setTimeout(res, TIME_FACTOR));

    if (isMounted.current) {
      setData(mockEntities);
      setEditedData(mockEntities);
      setActiveStep(1);
      toast.success("Entities extracted successfully!");

      toast.loading("Creating appointment...");
      const submitResult = await submitEntity(setLatestCurl);
      toast.dismiss();

      if (submitResult?.success) {
        toast.success("Appointment successfully created!");
        const appointmentId = submitResult?.appointmentId || "1045267";
        try {
          const appointmentData = await getAppointment(appointmentId);
          setAppointmentInfo(appointmentData);
        } catch (err) {
          console.error("Error fetching appointment info:", err);
          toast.error("Could not fetch appointment details.");
        }
      } else {
        toast.error("Failed to create appointment.");
      }

      setLoading(false);
    }
  };

  const toggleSection = (key) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 pb-1">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Custom Clinical Processing
              </h1>
              <p className="text-sm text-gray-600">Select a PDF → extract entities → schedule appointment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-2 overflow-hidden min-h-0">
        <div className="max-w-6xl mx-auto h-full flex flex-col gap-4">
          {/* Step 0: PDF Selection */}
          {activeStep === 0 && (
            <Card className="p-6 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <select
                  value={selectedPdf?.file || ""}
                  onChange={(e) => setSelectedPdf(pdfList.find((p) => p.file === e.target.value))}
                  className="block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select PDF</option>
                  {pdfList.map((pdf) => (
                    <option key={pdf.file} value={pdf.file}>
                      {pdf.name}
                    </option>
                  ))}
                </select>

                <Button
                  onClick={handleProcess}
                  disabled={loading || !selectedPdf}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Process PDF"}
                </Button>
              </div>

              {/* PDF Viewer */}
              {selectedPdf && (
                <div className="flex-1 min-h-[600px] border rounded-2xl shadow-lg overflow-hidden">
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                    <div className="h-full w-full">
                      <Viewer fileUrl={selectedPdf.file} plugins={[pdfPlugin]} />
                    </div>
                  </Worker>
                </div>
              )}
            </Card>
          )}

          {/* Step 1: Entities & Appointment Info */}
          {activeStep === 1 && data && (
            <Card className="flex-1 p-5 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Abnormalities */}
                {selectedPdf && getAbnormalitiesByFile(selectedPdf.name).length > 0 && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
                    <h2 className="font-semibold mb-1">Abnormality Detected</h2>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {getAbnormalitiesByFile(selectedPdf.name).map((ab, idx) => (
                        <li key={idx}>{ab}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Appointment Info */}
                {appointmentInfo && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4">
                    <h2 className="font-semibold mb-1">Appointment Details</h2>
                    <div className="text-sm space-y-0.5">
                      <p><strong>ID:</strong> {appointmentInfo.id}</p>
                      <p><strong>Status:</strong> {appointmentInfo.status}</p>
                      <p><strong>Start:</strong> {appointmentInfo.start}</p>
                      <p><strong>End:</strong> {appointmentInfo.end}</p>
                      <p><strong>Type:</strong> {appointmentInfo.appointmentType?.text}</p>
                    </div>
                  </div>
                )}

                {/* Entities Table */}
                <div>
                  {Object.entries(editedData).map(([key, items]) => (
                    <div key={key} className="py-2">
                      <button
                        onClick={() => toggleSection(key)}
                        className="flex justify-between items-center w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 transition"
                      >
                        <div className="flex items-center gap-2">
                          {openSections[key] ? (
                            <ChevronDown className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-indigo-600" />
                          )}
                          <span className="font-medium capitalize text-indigo-700">
                            {key}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({Array.isArray(items) ? items.length : 0})
                          </span>
                        </div>
                      </button>

                      {openSections[key] && Array.isArray(items) && (
                        <div className="overflow-x-auto mt-2 pl-6">
                          <table className="min-w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                            <thead className="bg-indigo-50 text-gray-700">
                              <tr>
                                {items.length > 0 &&
                                  Object.keys(items[0]).map((field) => (
                                    <th
                                      key={field}
                                      className="px-3 py-2 border-b text-left font-semibold text-gray-700"
                                    >
                                      {field}
                                    </th>
                                  ))}
                              </tr>
                            </thead>
                            <tbody>
                              {items.map((item, idx) => (
                                <tr key={idx} className="hover:bg-indigo-50">
                                  {Object.entries(item).map(([field, value]) => (
                                    <td key={field} className="px-3 py-2 border-b">
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
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
