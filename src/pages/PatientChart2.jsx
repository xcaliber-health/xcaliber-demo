
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { fhirFetch } from "../api/fhir";
import { usePatientTabs } from "../api/patienttab";
import { AppContext } from "../layouts/DashboardLayout";
import VitalsTab from "../pages/VitalsTab";
import AllergiesTab from "../pages/AllergiesTab";
import ImmunizationsTab from "../pages/ImmunizationsTab";

export default function PatientChart() {
  const navigate = useNavigate();

  const { id } = useParams();
  const { sourceId, departmentId } = useContext(AppContext);
  const patientTabs = usePatientTabs();

  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [data, setData] = useState({});
  const [tabErrors, setTabErrors] = useState({});
  const [activeTab, setActiveTab] = useState("vitals");

  // 👇 separate loading states
  const [patientLoading, setPatientLoading] = useState(false);
  const [tabLoading, setTabLoading] = useState({}); // { vitals: false, allergies: true, ... }

  const [error, setError] = useState(null);

  const [documentCategory, setDocumentCategory] = useState("VisitNotes");
  const [diagnosticCategory, setDiagnosticCategory] = useState("lab-results");
  const [basicCode, setBasicCode] = useState("risk-contract");

  // ---------------- Load patient + appointments ----------------
  useEffect(() => {
    if (!id || !sourceId) return;

    const loadPatient = async () => {
      setPatientLoading(true);
      try {
        const fhir = await fhirFetch(`/Patient/${id}`, {
          sourceId,
          headers: { "x-interaction-mode": "true" },
        });
        setPatient(parsePatient(fhir));
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load patient details");
      } finally {
        setPatientLoading(false);
      }
    };

    const loadAppointments = async () => {
      try {
        const bundle = await fhirFetch(
          `/Appointment?patient=${id}&departmentId=${departmentId}`,
          { sourceId, headers: { "x-interaction-mode": "true" } }
        );
        setAppointments(bundle.entry?.map((e) => e.resource) || []);
      } catch (err) {
        setTabErrors((prev) => ({ ...prev, appointments: err.message }));
        toast.error("Failed to load appointments");
      }
    };

    loadPatient();
    loadAppointments();
  }, [id, sourceId, departmentId]);

  // ---------------- Load tab data ----------------
  useEffect(() => {
    if (["vitals", "allergies", "immunizations"].includes(activeTab)) return;
    if (!id || !sourceId) return;

    const loadTabData = async () => {
      const config = patientTabs[activeTab];
      if (!config) return;

      setTabLoading((prev) => ({ ...prev, [activeTab]: true }));
      try {
        const headers = { ...(config.headersConfig || {}) };
        const url =
          activeTab === "documents"
            ? config.url(id, documentCategory)
            : activeTab === "diagnosticReports"
            ? config.url(id, diagnosticCategory)
            : activeTab === "basics"
            ? config.url(id, basicCode)
            : config.url(id);

        const bundle = await fhirFetch(url, { sourceId, headers });

        setData((prev) => ({
          ...prev,
          [activeTab]: bundle.entry?.map((e) => e.resource) || [],
        }));
        setTabErrors((prev) => ({ ...prev, [activeTab]: null }));
        toast.success(`${config.label} loaded successfully`);
      } catch (err) {
        setTabErrors((prev) => ({
          ...prev,
          [activeTab]: err.message || "Unknown error",
        }));
        toast.error(`Failed to load ${config.label}`);
      } finally {
        setTabLoading((prev) => ({ ...prev, [activeTab]: false }));
      }
    };

    loadTabData();
  }, [activeTab, id, sourceId, documentCategory, diagnosticCategory, basicCode]);

  // ---------------- Render ----------------
  if (error)
    return <div className="p-6 text-red-500 font-semibold">Error: {error}</div>;

  if (!patient || patientLoading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-600">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading patient...
      </div>
    );

  return (
    <div className="p-6 grid grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="col-span-1 space-y-4">
        <div className="bg-white p-4 shadow rounded-lg border">
          <h2 className="text-xl font-semibold">{patient.name}</h2>
          <p className="text-gray-600">
            {patient.gender?.toUpperCase()} | DOB: {patient.birthDate}
          </p>
          <p>Email: {patient.email || "—"}</p>
          <p>Phone: {patient.phone || "—"}</p>
          <p>Address: {patient.address || "—"}</p>
          <p>Status: {patient.status}</p>
        </div>

        <div className="bg-white p-4 shadow rounded-lg border">
          <h3 className="font-semibold mb-2">Upcoming Appointments</h3>
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {appointments.length > 0 ? (
              appointments.map((a) => (
                <li key={a.id} className="text-sm border-b pb-1">
                  {a.serviceType?.[0]?.text || "Appointment"} —{" "}
                  {a.start ? new Date(a.start).toLocaleString() : "No date"} (
                  {a.status})
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500">No appointments</li>
            )}
          </ul>
          {tabErrors.appointments && (
            <p className="text-red-500 text-sm mt-1">
              {tabErrors.appointments}
            </p>
          )}
        </div>
      </div>

      {/* Right Column */}
      <div className="col-span-2 bg-white p-4 shadow rounded-lg border">
        {/* Back button */}
<div className="mb-4">
  <button
    onClick={() => navigate("/patients")}
    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
  >
    <ArrowLeft className="h-4 w-4" />
    Back to Patients
  </button>
</div>

        {/* Tabs */}
        <div className="flex items-center space-x-4 border-b mb-4 overflow-x-auto no-scrollbar">
          {Object.entries(patientTabs).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`py-2 px-4 whitespace-nowrap transition-colors ${
                activeTab === key
                  ? "border-b-2 border-blue-500 font-semibold text-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="overflow-x-auto h-[calc(100vh-250px)]">
          {tabLoading[activeTab] ? (
            <div className="flex items-center justify-center py-12 text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading {patientTabs[activeTab]?.label}...
            </div>
          ) : activeTab === "vitals" ? (
            <VitalsTab patientId={id} sourceId={sourceId} />
          ) : activeTab === "allergies" ? (
            <AllergiesTab patientId={id} sourceId={sourceId} />
          ) : activeTab === "immunizations" ? (
            <ImmunizationsTab
              patientId={id}
              sourceId={sourceId}
              departmentId={departmentId}
            />
          ) : (
            <FHIRTable
              headers={patientTabs[activeTab]?.headers}
              rows={(data[activeTab] || []).map(
                patientTabs[activeTab]?.mapRow
              )}
              tab={activeTab}
              error={tabErrors[activeTab]}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------- Parsers ----------------
function parsePatient(fhir) {
  const name = fhir.name?.[0];
  const telecom = fhir.telecom || [];
  const address = fhir.address?.[0];

  return {
    id: fhir.id,
    name: name?.text || `${name?.given?.join(" ")} ${name?.family || ""}`,
    gender: fhir.gender,
    birthDate: fhir.birthDate,
    email: telecom.find((t) => t.system === "email")?.value,
    phone: telecom.find(
      (t) => t.system === "phone" && t.use === "mobile"
    )?.value,
    address: address
      ? `${address.line?.join(", ")}, ${address.city}, ${address.state}, ${address.postalCode}`
      : null,
    status: fhir.extension?.find(
      (e) =>
        e.url ===
        "http://xcaliber-fhir/structureDefinition/patient-status"
    )?.valueString,
  };
}

// ---------------- Generic Table ----------------
function FHIRTable({ headers, rows, tab, error }) {
  if (error)
    return (
      <div className="text-center py-6 text-red-500">
        Error loading {tab}: {error}
      </div>
    );
  if (!rows.length)
    return (
      <div className="text-center py-6 text-gray-500">
        No {tab} available
      </div>
    );

  return (
    <table className="w-full border border-gray-300 shadow rounded-lg overflow-hidden text-sm">
      <thead className="bg-gray-100">
        <tr>
          {headers.map((h, i) => (
            <th
              key={i}
              className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={i}
            className="hover:bg-gray-50 transition-colors"
          >
            {row.map((cell, j) => (
              <td
                key={j}
                className="border border-gray-300 px-3 py-2"
              >
                {cell || "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
