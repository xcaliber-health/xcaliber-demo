import { useState, useRef, useEffect, useContext } from "react";
import { submitEntity } from "../api/HandleEntity";
import { getAppointment } from "../api/appointment";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import { Loader2, HeartPulse, ChevronDown, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { AppContext } from "../layouts/DashboardLayout";

// Mock PDF list from /public/pdfs
const pdfList = [
  { name: "Hemoglobin Report", file: "/pdfs/lowhemo.pdf" },
  { name: "PCV Report", file: "/pdfs/highPCV.pdf" },
  { name: "RBC Report", file: "/pdfs/lowRBC.pdf" },
];

export default function ClinicalProcessing() {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [openSections, setOpenSections] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [appointmentInfo, setAppointmentInfo] = useState(null);
  const isMounted = useRef(true);
  const { localEvents, setLocalEvents,setLatestCurl } = useContext(AppContext);

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
          // Add appointment to local events
          if (setLocalEvents) {
          const newEvent = {
            id: appointmentId,
            eventType: "Appointment.save",
            createdTime: new Date().toISOString(),
            provider: appointmentData.provider?.name || "Unknown provider",
          };
          setLocalEvents([newEvent, ...localEvents]);
        }
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
      <div className="p-4 pb-1 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
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

        {/* Step 0: PDF Selection */}
        {activeStep === 0 && (
          <div className="bg-white/95 p-6 shadow-xl rounded-3xl flex flex-col gap-4">
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

              <button
                onClick={handleProcess}
                disabled={loading || !selectedPdf}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Process PDF"}
              </button>
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
          </div>
        )}

        {/* Step 1: Entities & Appointment Info */}
        {activeStep === 1 && data && (
          <div className="bg-white/95 p-4 shadow-xl rounded-3xl mt-4 max-h-[600px] overflow-auto">
            {/* Abnormalities */}
            {selectedPdf && getAbnormalitiesByFile(selectedPdf.name).length > 0 && (
              <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-2 rounded-lg mb-4">
                <h2 className="font-bold mb-1">Abnormality Detected</h2>
                <ul className="list-disc pl-5">
                  {getAbnormalitiesByFile(selectedPdf.name).map((ab, idx) => (
                    <li key={idx}>{ab}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Appointment Info */}
            {appointmentInfo && (
              <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg mb-4">
                <h2 className="font-bold mb-1">Appointment Details</h2>
                <p><strong>ID:</strong> {appointmentInfo.id}</p>
                <p><strong>Status:</strong> {appointmentInfo.status}</p>
                <p><strong>Start:</strong> {appointmentInfo.start}</p>
                <p><strong>End:</strong> {appointmentInfo.end}</p>
                <p><strong>Type:</strong> {appointmentInfo.appointmentType?.text}</p>
              </div>
            )}

            {/* Entities Table */}
            <div>
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
          </div>
        )}
      </div>
    </div>
  );
}
