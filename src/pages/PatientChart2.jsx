import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { fhirFetch } from "../api/fhir";
import { usePatientTabs } from "../api/patienttab";
import { AppContext } from "../layouts/DashboardLayout";
import { ECW_MOCK_PATIENTS } from "../data/patientListMock";
import VitalsTab from "../pages/VitalsTab";
import AllergiesTab from "../pages/AllergiesTab";
import ImmunizationsTab from "../pages/ImmunizationsTab";
import EncountersTab from "../pages/EncountersTab";
import FamilyHistoryTab from "../pages/FamilyHistoryTab";
import DocumentTab from "../pages/DocumentTab";
import ConditionsTab from "./ConditionsTab";
import QuestionnaireTab from "./QuestionnaireTab";
import ProcedureTab from "../pages/ProcedureTab";

import { ChevronRight } from "lucide-react";
export default function PatientChart() {
  const tabsRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { sourceId, departmentId, setLatestCurl } = useContext(AppContext);
  const patientTabs = usePatientTabs();

  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [data, setData] = useState({});
  const [tabErrors, setTabErrors] = useState({});
  const [activeTab, setActiveTab] = useState("vitals");
  const [patientLoading, setPatientLoading] = useState(false);
  const [tabLoading, setTabLoading] = useState({});
  const [error, setError] = useState(null);

  const [documentCategory, setDocumentCategory] = useState("clinical-document");
  const [diagnosticCategory, setDiagnosticCategory] = useState("lab-result");
  const [basicCode, setBasicCode] = useState("risk-contract");

  // ---------------- Load patient + appointments ----------------
  useEffect(() => {
    if (!id || !sourceId) return;

    const isMockSource =
      sourceId !== import.meta.env.VITE_SOURCE_ID_ATHENA ;
      // &&
      // sourceId !== import.meta.env.VITE_SOURCE_ID_ELATION;

    const loadPatient = async () => {
      setPatientLoading(true);
      try {
        let fhir;
        if (isMockSource) {
          const delay = Math.floor(Math.random() * 400) + 800;
          await new Promise((resolve) => setTimeout(resolve, delay));
          fhir = ECW_MOCK_PATIENTS.find((p) => p.id === id);
          if (!fhir) throw new Error("Patient not found");
        } else {
          fhir = await fhirFetch(`/Patient/${id}`, {
            sourceId,
            headers: { "x-interaction-mode": "false" },
            setLatestCurl,
          });
        }
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
        let entries = [];
        if (isMockSource) {
          const delay = Math.floor(Math.random() * 400) + 800;
          await new Promise((resolve) => setTimeout(resolve, delay));
          const patientMock = ECW_MOCK_PATIENTS.find((p) => p.id === id);
          entries = patientMock?.appointments || [];
        } else {
          const bundle = await fhirFetch(
            `/Appointment?patient=${id}&departmentId=${departmentId}`,
            {
              sourceId,
              headers: { "x-interaction-mode": "false" },
              setLatestCurl,
            }
          );
          entries = bundle.entry?.map((e) => e.resource) || [];
        }

        entries.sort((a, b) => {
          const dateA = new Date(a.start || a.meta?.lastUpdated || 0);
          const dateB = new Date(b.start || b.meta?.lastUpdated || 0);
          return dateB - dateA;
        });

        setAppointments(entries);
      } catch (err) {
        setTabErrors((prev) => ({ ...prev, appointments: err.message }));
        toast.error("Failed to load appointments");
      }
    };

    loadPatient();
    loadAppointments();
  }, [id, sourceId, departmentId, setLatestCurl]);

  // ---------------- Load tab data ----------------
  useEffect(() => {
    if (
      [
        "vitals",
        "allergies",
        "immunizations",
        "documents",
        "conditions",
        "questionnaireResponses",
        "procedures",
        "familyHistory",
        "encounters",
      ].includes(activeTab)
    )
      return;
    if (!id || !sourceId) return;

    const isMockSource =
      sourceId !== import.meta.env.VITE_SOURCE_ID_ATHENA 
      // &&
      // sourceId !== import.meta.env.VITE_SOURCE_ID_ELATION;

    const loadTabData = async () => {
      const config = patientTabs[activeTab];
      if (!config) return;

      setTabLoading((prev) => ({ ...prev, [activeTab]: true }));
      try {
        let tabData = [];
        if (isMockSource) {
          const delay = Math.floor(Math.random() * 400) + 800;
          await new Promise((resolve) => setTimeout(resolve, delay));
          const patientMock = ECW_MOCK_PATIENTS.find((p) => p.id === id);
          tabData = patientMock?.[activeTab] || [];
        } else {
          const headers = { ...(config.headersConfig || {}) };
          const url =
            activeTab === "documents"
              ? config.url(id, documentCategory)
              : activeTab === "diagnosticReports"
              ? config.url(id, diagnosticCategory)
              : activeTab === "basics"
              ? config.url(id, basicCode)
              : config.url(id);

          const bundle = await fhirFetch(url, {
            sourceId,
            headers,
            setLatestCurl,
          });
          tabData = bundle.entry?.map((e) => e.resource) || [];
        }

        setData((prev) => ({ ...prev, [activeTab]: tabData }));
        setTabErrors((prev) => ({ ...prev, [activeTab]: null }));
        toast.success(`${patientTabs[activeTab]?.label} loaded successfully`);
      } catch (err) {
        setTabErrors((prev) => ({
          ...prev,
          [activeTab]: err.message || "Unknown error",
        }));
        toast.error(`Failed to load ${patientTabs[activeTab]?.label}`);
      } finally {
        setTabLoading((prev) => ({ ...prev, [activeTab]: false }));
      }
    };

    loadTabData();
  }, [
    activeTab,
    id,
    sourceId,
    documentCategory,
    diagnosticCategory,
    basicCode,
    patientTabs,
  ]);

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
    <div className="h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden ">
      <div className="flex-1 px-6 pb-4 overflow-hidden min-h-0 mt-8">
        <div className="max-w-7xl mx-auto h-full grid grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="col-span-1">
            <div className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-xl rounded-3xl p-6 flex flex-col justify-between h-full">
              <div className="space-y-3">
                {/* Patient Info */}
                <h2 className="text-2xl font-bold text-gray-800">
                  {patient.name}
                </h2>
                <p className="text-gray-500 text-sm">
                  {patient.gender?.toUpperCase()} | DOB: {patient.birthDate}
                </p>

                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {patient.email || "—"}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {patient.phone || "—"}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    {patient.address || "—"}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {patient.status}
                  </p>
                </div>

                {/* Appointments */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-2 text-gray-800 text-lg">
                    Appointments
                  </h3>
                  {appointments.length ? (
                    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                      <table className="w-full border-collapse text-sm">
                        <thead className="bg-indigo-50">
                          <tr>
                            <th className="p-2 text-left font-semibold text-gray-700">
                              Practitioner ID
                            </th>
                            <th className="p-2 text-left font-semibold text-gray-700">
                              Type
                            </th>
                            <th className="p-2 text-left font-semibold text-gray-700">
                              Date
                            </th>
                            <th className="p-2 text-left font-semibold text-gray-700">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments.map((a) => {
                            const practitioner = a.participant?.find((p) =>
                              p.actor?.reference?.startsWith("Practitioner/")
                            );
                            const practitionerId =
                              practitioner?.actor?.reference?.split("/")[1] ||
                              "Unknown";
                            return (
                              <tr
                                key={a.id}
                                className="border-b border-gray-100 hover:bg-indigo-50"
                              >
                                <td className="p-2">{practitionerId}</td>
                                <td className="p-2">
                                  {a.appointmentType?.text || "-"}
                                </td>
                                <td className="p-2">
                                  {a.start
                                    ? new Date(a.start).toLocaleString()
                                    : "-"}
                                </td>
                                <td className="p-2">{a.status || "-"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No appointments</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-2 bg-white/95 backdrop-blur-sm shadow-xl border border-white/20 rounded-3xl p-4 flex flex-col overflow-hidden">
            {/* Back button */}
            <div className="mb-4">
              <button
                onClick={() => navigate("/patients")}
                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Patients
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center mb-4">
              {/* Left arrow */}
              <button
                onClick={() =>
                  tabsRef.current?.scrollBy({ left: -150, behavior: "smooth" })
                }
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Tabs container */}
              <div
                ref={tabsRef}
                className="flex-1 flex items-center space-x-4 overflow-x-auto hide-scrollbar px-2"
              >
                {Object.entries(patientTabs).map(([key, tab]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`py-2 px-4 whitespace-nowrap transition-colors  ${
                      activeTab === key
                        ? "border-b-2 border-indigo-500 font-semibold text-indigo-600"
                        : "text-gray-600 hover:text-indigo-500"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Right arrow */}
              <button
                onClick={() =>
                  tabsRef.current?.scrollBy({ left: 150, behavior: "smooth" })
                }
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Content */}
            <div className="overflow-y-auto hide-scrollbar flex-1 rounded-xl">
              {tabLoading[activeTab] ? (
                <div className="flex items-center justify-center py-12 text-gray-500">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Loading {patientTabs[activeTab]?.label}...
                </div>
              ) : activeTab === "vitals" ? (
                <VitalsTab patientId={id} sourceId={sourceId} />
              ) : activeTab === "allergies" ? (
                <AllergiesTab patientId={id} sourceId={sourceId} />
              ) : activeTab === "procedures" ? (
                <ProcedureTab patientId={id} />
              ) : activeTab === "encounters" ? (
                <EncountersTab
                  patientId={id}
                  sourceId={sourceId}
                  departmentId={departmentId}
                />
              ) : activeTab === "questionnaireResponses" ? (
                <QuestionnaireTab patientId={id} />
              ) : activeTab === "documents" ? (
                <DocumentTab patientId={id} category={documentCategory} />
              ) : activeTab === "conditions" ? (
                <ConditionsTab patientId={id} />
              ) : activeTab === "immunizations" ? (
                <ImmunizationsTab
                  patientId={id}
                  sourceId={sourceId}
                  departmentId={departmentId}
                />
              ) : activeTab === "familyHistory" ? (
                <FamilyHistoryTab
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
    phone: telecom.find((t) => t.system === "phone" )
      ?.value,
    address: address
      ? `${address.line?.join(", ")}, ${address.city}, ${address.state}, ${
          address.postalCode
        }`
      : null,
    status: fhir.extension?.find(
      (e) => e.url === "http://xcaliber-fhir/structureDefinition/status"
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
      <div className="text-center py-6 text-gray-500">No {tab} available</div>
    );

  return (
    <table className="w-full border-collapse text-sm">
      <thead className="bg-indigo-50 border-b border-gray-200 sticky top-0 z-10">
        <tr>
          {headers.map((h, i) => (
            <th
              key={i}
              className="p-2 text-left text-gray-700 font-semibold uppercase text-xs"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-gray-100 hover:bg-indigo-50">
            {row.map((cell, j) => (
              <td key={j} className="p-2 text-gray-800">
                {cell || "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
