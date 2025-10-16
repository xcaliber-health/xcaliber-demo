import { useState, useRef, useEffect, useContext } from "react";
import { submitEntity } from "../api/HandleEntity";
import { getAppointment } from "../api/appointment";
import {
  Loader2,
  HeartPulse,
  ChevronDown,
  ChevronRight,
  UploadCloud,
} from "lucide-react";
import toast from "react-hot-toast";
import { AppContext } from "../layouts/DashboardLayout";

export default function ClinicalProcessing() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [openSections, setOpenSections] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [appointmentInfo, setAppointmentInfo] = useState(null);
  const isMounted = useRef(true);
  const { setLatestCurl } = useContext(AppContext);

  // ⏱ configurable mock delay
  const TIME_FACTOR = 4000; // milliseconds

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
    return () => (isMounted.current = false);
  }, []);

  // 🧪 Mock entity data (only this part is fake)
  const mockEntities = {
    Patient: [
      {
        id: "P-001",
        name: "Jane Doe",
        gender: "female",
        birthDate: "1990-05-14",
      },
    ],
    Observation: [
      {
        code: "718-7",
        display: "Hemoglobin [Mass/volume] in Blood",
        value: "8.2 g/dL",
        interpretation: "L (Low)",
      },
      {
        code: "4544-3",
        display: "Hematocrit [Volume Fraction] of Blood",
        value: "49 %",
        interpretation: "H (High)",
      },
    ],
    Practitioner: [
      {
        id: "pract-002",
        name: "Dr. Arjun Mehta",
        role: "Cardiologist",
      },
    ],
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a PDF file first.");

    setLoading(true);
    toast.loading("Uploading PDF...");

    // ⏳ simulate upload delay
    await new Promise((res) => setTimeout(res, TIME_FACTOR));
    toast.dismiss();
    toast.success("PDF uploaded successfully. Processing...");

    // ⏳ simulate entity extraction delay
    await new Promise((res) => setTimeout(res, TIME_FACTOR));

    // ✅ mock entity data appears here
    if (isMounted.current) {
      setData(mockEntities);
      setEditedData(mockEntities);
      setActiveStep(1);
      toast.success("Entities extracted successfully!");

      // ✅ keep the real appointment creation logic
      toast.loading("Creating appointment...");
      const submitResult = await submitEntity(
        setLatestCurl
      );
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

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

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
              Custom Clinical Processing (Mock Entities)
            </h1>
            <p className="text-sm text-gray-600">
              Upload a clinical PDF → extract mock entities → real appointment
            </p>
          </div>
        </div>

        {/* Step 0: Upload */}
        {activeStep === 0 && (
          <div className="bg-white/95 p-6 shadow-xl rounded-3xl">
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
              <button
                onClick={handleUpload}
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Upload & Process"}
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Entities & Appointment Info */}
        {activeStep === 1 && data && (
          <div className="bg-white/95 p-4 shadow-xl rounded-3xl mt-4 max-h-[600px] overflow-auto">
            {/* Abnormalities */}
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
        )}
      </div>
    </div>
  );
}
