import { useState, useEffect, useRef, useContext } from "react";
import { Loader2, HeartPulse, ChevronDown, ChevronRight } from "lucide-react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import toast from "react-hot-toast";
import { AppContext } from "../layouts/DashboardLayout";
import { submitEntity } from "../api/HandleEntity";
import { getAppointment } from "../api/appointment";

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

function EntityCard({ title, items, open, toggleOpen }) {
  if (!items || items.length === 0) return null;

  const headers = Object.keys(items[0]);

  return (
    <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 mb-4">
      <button
        onClick={toggleOpen}
        className="w-full flex justify-between items-center px-4 py-2 rounded-t-xl font-medium hover:bg-gray-100"
      >
        <div className="flex items-center gap-2">
          {open ? (
            <ChevronDown className="w-4 h-4 text-indigo-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-indigo-600" />
          )}
          <span>{title}</span>
          <span className="text-xs text-gray-500">({items.length})</span>
        </div>
      </button>

      {open && (
        <div className="overflow-x-auto p-4">
          <table className="min-w-full text-sm text-left border rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                {headers.map((header) => (
                  <th key={header} className="px-3 py-2 border">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {headers.map((field) => (
                    <td key={field} className="px-3 py-2 border">
                      {typeof item[field] === "object"
                        ? JSON.stringify(item[field])
                        : String(item[field])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ClinicalProcessing() {
  // const { setLatestCurl } = useContext(AppContext);
  const [pdfList, setPdfList] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [appointmentInfo, setAppointmentInfo] = useState(null);
  const [entities, setEntities] = useState(null);
  const [showAbnormality, setShowAbnormality] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const isMounted = useRef(true);
  const { localEvents, setLocalEvents, setLatestCurl } = useContext(AppContext);

  const TIME_FACTOR = 4000; // milliseconds
  const pdfPlugin = defaultLayoutPlugin();

  useEffect(() => {
    isMounted.current = true;
    async function loadPdfList() {
      try {
        const res = await fetch(`${SAMPLE_BFF_URL}/clinicaldocuments`);
        const data = await res.json();
        setPdfList(data.documents || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load document list");
      }
    }
    loadPdfList();
    return () => (isMounted.current = false);
  }, []);

  const fetchPdfBase64 = async (name) => {
    const res = await fetch(
      `${SAMPLE_BFF_URL}/clinicaldocuments/${encodeURIComponent(name)}/pdf`
    );
    const data = await res.json();
    return `data:application/pdf;base64,${data.base64}`;
  };

  const handleSelectPdf = async (name) => {
    if (!name) return;
    setLoading(true);
    setShowAbnormality(false);
    setEntities(null);
    setAppointmentInfo(null);
    setOpenSections({});
    try {
      const fileUrl = await fetchPdfBase64(name);
      setSelectedPdf({ name, file: fileUrl });
      toast.success(`Loaded: ${name}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load PDF");
    } finally {
      setLoading(false);
    }
  };

  const getAbnormalitiesByFile = (name) => {
    if (!name) return [];
    if (name.toLowerCase().includes("hemo"))
      return ["Hemoglobin level is critically low"];
    if (name.toLowerCase().includes("pcv"))
      return ["Packed Cell Volume (PCV) is high"];
    if (name.toLowerCase().includes("rbc"))
      return ["Red Blood Cell (RBC) count is low"];
    return [];
  };

  // Sample entity data for different PDFs
  const pdfEntities = [
    {
      name: "hemo", // PDF name containing "hemo"
      entities: {
        Patient: [
          {
            id: "PID-555",
            name: "Yash M. Patel",
            gender: "Male",
            age: "21 Years",
            birthDate: "2004-02-28", // not in report
          },
        ],
        Observation: [
          {
            code: "718-7",
            display: "Hemoglobin [Mass/volume] in Blood",
            value: "8 g/dL",
            interpretation: "L (Low)",
          },
          {
            code: "4544-3",
            display: "Hematocrit [Volume Fraction] of Blood",
            value: "47.5 %",
            interpretation: "Normal",
          },
          {
            code: "789-8",
            display: "Red Blood Cell Count",
            value: "5.1 mill/cumm",
            interpretation: "Normal",
          },
          {
            code: "6690-2",
            display: "White Blood Cell Count",
            value: "9000 cells/mcL",
            interpretation: "Normal",
          },
          {
            code: "777-3",
            display: "Platelet Count",
            value: "320000 cells/mcL",
            interpretation: "Normal",
          },
        ],
        Practitioner: [
          {
            id: "pract-002",
            name: "Dr. Hiren Shah",
            role: "Cardiologist",
          },
        ],
        Organization: [
          {
            name: "Drlogy Pathology Lab",
            address:
              "105-108, Smart Vision Complex, Healthcare Road, Opp. Healthcare Complex, Mumbai - 689578",
          },
        ],
      },
    },
    {
      name: "pcv", // PDF name containing "pcv"
      entities: {
        Patient: [
          {
            id: "PID-555",
            name: "Yash M. Patel",
            gender: "Male",
            age: "21 Years",
            birthDate: "2004-02-28", // not in report
          },
        ],
        Observation: [
          {
            code: "718-7",
            display: "Hemoglobin [Mass/volume] in Blood",
            value: "14 g/dL",
            interpretation: "Normal",
          },
          {
            code: "4544-3",
            display: "Hematocrit [Volume Fraction] of Blood",
            value: "59.1 %",
            interpretation: "H (High)",
          },
          {
            code: "789-8",
            display: "Red Blood Cell Count",
            value: "5.1 mill/cumm",
            interpretation: "Normal",
          },
          {
            code: "6690-2",
            display: "White Blood Cell Count",
            value: "9000 cells/mcL",
            interpretation: "Normal",
          },
          {
            code: "777-3",
            display: "Platelet Count",
            value: "320000 cells/mcL",
            interpretation: "Normal",
          },
        ],
        Practitioner: [
          {
            id: "pract-002",
            name: "Dr. Hiren Shah",
            role: "Cardiologist",
          },
        ],
        Organization: [
          {
            name: "Drlogy Pathology Lab",
            address:
              "105-108, Smart Vision Complex, Healthcare Road, Opp. Healthcare Complex, Mumbai - 689578",
          },
        ],
      },
    },
    {
      name: "rbc", // PDF name containing "rbc"
      entities: {
        Patient: [
          {
            id: "PID-555",
            name: "Yash M. Patel",
            gender: "Male",
            age: "21 Years",
            birthDate: "2004-02-28", // not in report
          },
        ],
        Observation: [
          {
            code: "718-7",
            display: "Hemoglobin [Mass/volume] in Blood",
            value: "14 g/dL",
            interpretation: "Normal",
          },
          {
            code: "4544-3",
            display: "Hematocrit [Volume Fraction] of Blood",
            value: "47.5 %",
            interpretation: "Normal",
          },
          {
            code: "789-8",
            display: "Red Blood Cell Count",
            value: "3.1 mill/cumm",
            interpretation: "L (Low)",
          },
          {
            code: "6690-2",
            display: "White Blood Cell Count",
            value: "9000 cells/mcL",
            interpretation: "Normal",
          },
          {
            code: "777-3",
            display: "Platelet Count",
            value: "320000 cells/mcL",
            interpretation: "Normal",
          },
        ],
        Practitioner: [
          {
            id: "pract-002",
            name: "Dr. Hiren Shah",
            role: "Cardiologist",
          },
        ],
        Organization: [
          {
            name: "Drlogy Pathology Lab",
            address:
              "105-108, Smart Vision Complex, Healthcare Road, Opp. Healthcare Complex, Mumbai - 689578",
          },
        ],
      },
    },
  ];

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleProcess = async () => {
    if (!selectedPdf) return toast.error("Please select a PDF first.");
    setLoading(true);

    // Step 1: Processing PDF
    toast.loading("Processing PDF...");
    await new Promise((res) => setTimeout(res, 3000));
    toast.dismiss();
    toast.success("PDF processed successfully.");

    // Step 2: Show Abnormality
    if (isMounted.current) setShowAbnormality(true);
    await new Promise((res) => setTimeout(res, 1000));

    const selectedEntities = pdfEntities.find((pdf) =>
      selectedPdf.name.toLowerCase().includes(pdf.name)
    )?.entities;

    // Set entities
    if (isMounted.current && selectedEntities) {
      setEntities(selectedEntities);
      toast.success("Entities extracted successfully!");
    }
    // Step 4: Creating appointment

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
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-6 pb-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Clinical PDF Viewer
            </h1>
            <p className="text-sm text-gray-600">
              Select a PDF → Extract Entities → Schedule Appointment
            </p>
          </div>
        </div>
      </div>

      {/* PDF Selection */}
      <div className="flex-shrink-0 px-6 pb-3">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <select
            onChange={(e) => handleSelectPdf(e.target.value)}
            className="block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select PDF</option>
            {pdfList.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <button
            onClick={handleProcess}
            disabled={loading || !selectedPdf}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "Process PDF"
            )}
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      {selectedPdf && (
        <div className="flex-1 px-6 pb-6 pt-4 overflow-hidden">
          <div className="max-w-7xl mx-auto h-full flex gap-6">
            {/* Left: PDF (50%) */}
            <Card className="flex-[0.5] flex flex-col overflow-hidden p-4">
              <div className="w-full h-full rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                  <div style={{ height: "100%", width: "100%" }}>
                    <Viewer fileUrl={selectedPdf.file} plugins={[pdfPlugin]} />
                  </div>
                </Worker>
              </div>
            </Card>

            {/* Right: Abnormalities + Entities + Appointment (50%) */}
            <div className="flex-[0.5] flex flex-col gap-4 overflow-auto">
              {/* Abnormalities */}
              {showAbnormality &&
                getAbnormalitiesByFile(selectedPdf.name).length > 0 && (
                  <Card className="p-4 bg-red-100 border-red-400 text-red-800">
                    <h2 className="font-bold mb-2">Abnormality Detected</h2>
                    <ul className="list-disc pl-5">
                      {getAbnormalitiesByFile(selectedPdf.name).map(
                        (ab, idx) => (
                          <li key={idx}>{ab}</li>
                        )
                      )}
                    </ul>
                  </Card>
                )}

              {/* Entities */}
              {entities && (
                <Card className="p-4 bg-blue-50 border-blue-400 text-gray-800">
                  <h2 className="font-bold mb-3 text-gray-700 text-lg">
                    Entities
                  </h2>
                  {Object.entries(entities).map(([key, items]) => (
                    <EntityCard
                      key={key}
                      title={key}
                      items={items}
                      open={openSections[key]}
                      toggleOpen={() => toggleSection(key)}
                    />
                  ))}
                </Card>
              )}

              {/* Appointment Details */}
              {appointmentInfo && (
                <Card className="p-4 bg-green-100 border-green-400 text-green-800">
                  <h2 className="font-bold mb-2">Appointment Details</h2>
                  <p>
                    <strong>ID:</strong> {appointmentInfo.id}
                  </p>
                  <p>
                    <strong>Status:</strong> {appointmentInfo.status}
                  </p>
                  <p>
                    <strong>Start:</strong> {appointmentInfo.start}
                  </p>
                  <p>
                    <strong>End:</strong> {appointmentInfo.end}
                  </p>
                  <p>
                    <strong>Type:</strong>{" "}
                    {appointmentInfo.appointmentType?.text}
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
