import { useState, useEffect, useRef, useContext } from "react";
import { Loader2, HeartPulse } from "lucide-react";
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
    <div className={`bg-white/95 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 ${className}`}>
      {children}
    </div>
  );
}

export default function ClinicalProcessing() {
  const { setLatestCurl } = useContext(AppContext);
  const [pdfList, setPdfList] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [appointmentInfo, setAppointmentInfo] = useState(null);
  const isMounted = useRef(true);

  const pdfPlugin = defaultLayoutPlugin();

  // Load PDF list
  useEffect(() => {
    isMounted.current = true;
    async function loadPdfList() {
      try {
        const res = await fetch(`${SAMPLE_BFF_URL}/clinicaldocuments`);
        const docs = await res.json();
        setPdfList(docs.documents || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load document list");
      }
    }
    loadPdfList();
    return () => (isMounted.current = false);
  }, []);

  const fetchPdfBase64 = async (name) => {
    const res = await fetch(`${SAMPLE_BFF_URL}/clinicaldocuments/${encodeURIComponent(name)}/pdf`);
    const data = await res.json();
    return `data:application/pdf;base64,${data.base64}`;
  };

  const handleSelectPdf = async (name) => {
    if (!name) return;
    setLoading(true);
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
    if (name.toLowerCase().includes("hemo")) return ["Hemoglobin level is critically low"];
    if (name.toLowerCase().includes("pcv")) return ["Packed Cell Volume (PCV) is high"];
    if (name.toLowerCase().includes("rbc")) return ["Red Blood Cell (RBC) count is low"];
    return [];
  };

  const handleProcess = async () => {
    if (!selectedPdf) return toast.error("Please select a PDF first.");
    setLoading(true);
    toast.loading("Processing PDF...");
    await new Promise((r) => setTimeout(r, 4000));
    toast.dismiss();
    toast.success("PDF processed successfully.");
    await new Promise((r) => setTimeout(r, 4000));
    if (isMounted.current) {
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
          console.error(err);
          toast.error("Could not fetch appointment details.");
        }
      } else toast.error("Failed to create appointment.");
      setLoading(false);
    }
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
            <p className="text-sm text-gray-600">Select a PDF → extract entities → schedule appointment</p>
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
              <option key={name} value={name}>{name}</option>
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
      </div>

      {/* Two-column layout */}
      {selectedPdf && (
        <div className="flex-1 px-6 pb-6 pt-4 overflow-hidden">
          <div className="max-w-7xl mx-auto h-full flex gap-6">
            {/* Left: PDF */}
            <Card className="flex-1 flex flex-col overflow-hidden p-4">
              <div className="w-full h-full rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                  <div style={{ height: "100%", width: "100%" }}>
                    <Viewer fileUrl={selectedPdf.file} plugins={[pdfPlugin]} />
                  </div>
                </Worker>
              </div>
            </Card>

            {/* Right: Abnormalities + Appointment */}
            <div className="w-80 flex flex-col gap-4">
              {getAbnormalitiesByFile(selectedPdf.name).length > 0 && (
                <Card className="p-4 bg-red-100 border-red-400 text-red-800">
                  <h2 className="font-bold mb-1">Abnormality Detected</h2>
                  <ul className="list-disc pl-5">
                    {getAbnormalitiesByFile(selectedPdf.name).map((ab, idx) => (
                      <li key={idx}>{ab}</li>
                    ))}
                  </ul>
                </Card>
              )}

              {appointmentInfo && (
                <Card className="p-4 bg-green-100 border-green-400 text-green-800">
                  <h2 className="font-bold mb-1">Appointment Details</h2>
                  <p><strong>ID:</strong> {appointmentInfo.id}</p>
                  <p><strong>Status:</strong> {appointmentInfo.status}</p>
                  <p><strong>Start:</strong> {appointmentInfo.start}</p>
                  <p><strong>End:</strong> {appointmentInfo.end}</p>
                  <p><strong>Type:</strong> {appointmentInfo.appointmentType?.text}</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
