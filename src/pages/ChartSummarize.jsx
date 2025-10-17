import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function ChartSummarizer() {
  const  id  = "7002";
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const PATIENTS = [
    {
      "id": "7002",
      "fullName": "Amina Patel",
      "birthDate": "1988-05-22",
      "gender": "F",
      "telecom": [
        { "system": "phone", "value": "6465550189" },
        { "system": "email", "value": "amina.patel@example.com" }
      ],
      "address": [
        {
          "line": ["250 Park Ave S", "Floor 10"],
          "city": "New York",
          "state": "NY",
          "postalCode": "10003",
        }
      ],
      "status": "active",
      "appointments": [
        { "id": "appt-301", "appointmentType": { "text": "Oncology consult" }, "start": "2025-10-30T11:00:00Z", "status": "booked" }
      ],
      "vitals": [
        { "code": { "coding": [{ "display": "Blood Pressure (Systolic)" }] }, "valueQuantity": { "value": 120, "unit": "mmHg" } },
        { "code": { "coding": [{ "display": "Heart Rate" }] }, "valueQuantity": { "value": 92, "unit": "bpm" } }
      ],
      "conditions": [
        { "code": { "coding": [{ "display": "Colon adenocarcinoma, sigmoid colon", "code": "C18.7" }] }, "status": "active", "onsetDateTime": "2025-02-10", "stage": "II" }
      ],
      "procedures": [
        { "code": { "display": "PICC line insertion (right basilic)" }, "status": "completed", "performedDate": "2025-02-14" },
        { "code": { "display": "Left hemicolectomy with primary anastomosis" }, "status": "completed", "performedDate": "2025-02-15" }
      ],
      "documents": [
        { "description": "Pathology Report - Colon adenocarcinoma", "date": "2025-02-17", "status": "final" },
        { "description": "Discharge Summary - colectomy admission", "date": "2025-02-20", "status": "final" }
      ],
      "medications": [
        { "medicationCodeableConcept": { "text": "FOLFOX (Oxaliplatin + Leucovorin + 5-FU) - planned" }, "status": "planned", "start": "2025-03-10" },
        { "medicationCodeableConcept": { "text": "Oxycodone PRN for post-op pain" }, "status": "completed", "start": "2025-02-15", "end": "2025-02-20" }
      ],
      "encounters": [
        { "type": "Inpatient admission", "period": { "start": "2025-02-14", "end": "2025-02-20" } },
        { "type": "Surgery - Left hemicolectomy", "period": { "start": "2025-02-15", "end": "2025-02-15" } }
      ],
      "allergies": [],
      "immunizations": [],
      "familyHistory": [],
      "questionnaireResponses": []
    }
  ];
  const handleChartSummarizer = async () => {
    setLoading(true);
    setSummary("");
    try {
      const input = "Please summarize the patient's history for review."; // sample input
      const response = await fetch(
        "https://stage-ray-serve.xcaliberhealth.io/provider-assistant/v1/chat/completions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [{ content: input }] }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const data = await response.json();

      const reply = data?.choices?.[0]?.message?.content || "⚠️ No response";
      setSummary(reply);
    } catch (error) {
      console.error("Error calling agent API:", error);
      setSummary("⚠️ Sorry, the assistant is unavailable right now.");
    } finally {
      setLoading(false);
    }
  };

  const patient = PATIENTS.find((p) => p.id === id);
  const [activeTab, setActiveTab] = useState("vitals");

  if (!patient) return <div className="p-6 text-red-500">Patient not found</div>;

  const tabs = {
    vitals: { label: "Vitals", headers: ["Name", "Value"], rows: patient.vitals.map(v => [v.code.coding[0].display, `${v.valueQuantity.value} ${v.valueQuantity.unit}`]) },
    conditions: { label: "Conditions", headers: ["Name", "Stage", "Status", "Onset"], rows: patient.conditions.map(c => [c.code.coding[0].display, c.stage, c.status, c.onsetDateTime]) },
    procedures: { label: "Procedures", headers: ["Name", "Status", "Date"], rows: patient.procedures.map(p => [p.code.display, p.status, p.performedDate]) },
    documents: { label: "Documents", headers: ["Description", "Date", "Status"], rows: patient.documents.map(d => [d.description, d.date, d.status]) },
    medications: { label: "Medications", headers: ["Name", "Status", "Start", "End"], rows: patient.medications.map(m => [m.medicationCodeableConcept.text, m.status, m.start || "-", m.end || "-"]) },
    encounters: { label: "Encounters", headers: ["Type", "Start", "End"], rows: patient.encounters.map(e => [e.type, e.period.start, e.period.end]) },
    allergies: { label: "Allergies", headers: ["Info"], rows: patient.allergies.map(a => [JSON.stringify(a)]) },
    immunizations: { label: "Immunizations", headers: ["Info"], rows: patient.immunizations.map(i => [JSON.stringify(i)]) },
    familyHistory: { label: "Family History", headers: ["Info"], rows: patient.familyHistory.map(f => [JSON.stringify(f)]) },
    questionnaireResponses: { label: "Questionnaires", headers: ["Info"], rows: patient.questionnaireResponses.map(q => [JSON.stringify(q)]) }
  };

  return (
<div className="p-6 grid grid-cols-3 gap-6">
  {/* Left Column */}
  <div className="col-span-1 space-y-4">
    {/* Chart Summarizer Button (above patient info) */}
    <div className="flex justify-center mb-4">
      <button
        onClick={handleChartSummarizer}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition-colors"
      >
        {loading ? "Summarizing..." : "Chart Summarizer"}
      </button>
    </div>

    <div className="bg-white p-4 shadow rounded-lg border flex flex-col">
      <h2 className="text-xl font-semibold">{patient.fullName}</h2>
      <p className="text-gray-600">{patient.gender} | DOB: {patient.birthDate}</p>
      <p>Email: {patient.telecom.find(t => t.system === "email")?.value || "-"}</p>
      <p>Phone: {patient.telecom.find(t => t.system === "phone")?.value || "-"}</p>
      <p>Address: {patient.address?.[0]?.line?.join(", ")}, {patient.address?.[0]?.city}, {patient.address?.[0]?.state}, {patient.address?.[0]?.postalCode}</p>
      <p>Status: {patient.status}</p>

      {/* Appointments */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Appointments</h3>
        {patient.appointments.length ? (
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1 text-left">Type</th>
                <th className="border px-2 py-1 text-left">Date</th>
                <th className="border px-2 py-1 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {patient.appointments.map((a, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border px-2 py-1">{a.appointmentType.text}</td>
                  <td className="border px-2 py-1">{new Date(a.start).toLocaleString()}</td>
                  <td className="border px-2 py-1">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="text-gray-500">No appointments</p>}
      </div>
    </div>
  </div>

  {/* Right Column */}
  <div className="col-span-2 bg-white p-4 shadow rounded-lg border flex flex-col">
    {/* Tabs Section */}
    <div className="flex items-center space-x-4 border-b mb-2 overflow-x-auto no-scrollbar">
      {Object.entries(tabs).map(([key, tab]) => (
        <button
          key={key}
          onClick={() => setActiveTab(key)}
          className={`py-2 px-4 whitespace-nowrap transition-colors ${
            activeTab === key ? "border-b-2 border-blue-500 font-semibold text-blue-600" : "text-gray-600 hover:text-blue-500"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>

    {/* Tab Content */}
    <div className="overflow-x-auto max-h-[60vh] mt-4">
      <table className="w-full border border-gray-300 shadow rounded-lg overflow-hidden text-sm">
        <thead className="bg-gray-100">
          <tr>
            {tabs[activeTab].headers.map((h, i) => (
              <th key={i} className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tabs[activeTab].rows.length ? tabs[activeTab].rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {row.map((cell, j) => <td key={j} className="border border-gray-300 px-3 py-2">{cell || "-"}</td>)}
            </tr>
          )) : (
            <tr>
              <td colSpan={tabs[activeTab].headers.length} className="text-center py-6 text-gray-500">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
{/* Summary Section below tabs */}
{summary && (
  <div className="mt-4">
    <h4 className="text-md font-semibold mb-2 text-blue-700">Chart Summary</h4>
    <div className="p-4 bg-blue-50 border border-blue-200 rounded text-sm text-center whitespace-pre-line w-full">
      {summary}
    </div>
  </div>
)}
  </div>
</div>


  );
}


// --- Tab Components ---

function Table({ headers, rows }) {
  return (
    <table className="w-full border border-gray-300 text-sm">
      <thead className="bg-gray-100">
        <tr>
          {headers.map((h) => (
            <th key={h} className="border px-3 py-2 text-left">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length ? (
          rows.map((r, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {r.map((cell, j) => (
                <td key={j} className="border px-3 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={headers.length}
              className="text-center text-gray-500 py-4"
            >
              No data
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

const VitalsTab = ({ data }) => (
  <Table
    headers={["Type", "Value", "Last Updated"]}
    rows={data.map((v) => [
      v.code.coding[0].display,
      `${v.valueQuantity.value} ${v.valueQuantity.unit}`,
      new Date(v.meta.lastUpdated).toLocaleString(),
    ])}
  />
);

const ConditionsTab = ({ data }) => (
  <Table
    headers={["Condition", "Code", "Stage", "Status", "Onset"]}
    rows={data.map((c) => [
      c.code.coding[0].display,
      c.code.coding[0].code,
      c.stage,
      c.status,
      new Date(c.onsetDateTime).toLocaleDateString(),
    ])}
  />
);

const MedicationsTab = ({ data }) => (
  <Table
    headers={["Medication", "Status", "Start", "End", "Notes"]}
    rows={data.map((m) => [
      m.medicationCodeableConcept.text,
      m.status,
      m.start || "—",
      m.end || "—",
      m.note || "—",
    ])}
  />
);

const ProceduresTab = ({ data }) => (
  <Table
    headers={["Procedure", "Status", "Performed Date", "Performer"]}
    rows={data.map((p) => [
      p.code.display,
      p.status,
      p.performedDate,
      p.performer?.map((x) => x.display).join(", "),
    ])}
  />
);

const DiagnosticReportsTab = ({ data }) => (
  <Table
    headers={["Title", "Status", "Date", "Results"]}
    rows={data.map((r) => [
      r.title,
      r.status,
      r.date,
      r.results
        ? Object.entries(r.results)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ")
        : "—",
    ])}
  />
);

const DocumentsTab = ({ data }) => (
  <Table
    headers={["Description", "Author", "Date", "Status", "Content"]}
    rows={data.map((d) => [
      d.description,
      d.author?.map((a) => a.display).join(", "),
      new Date(d.date).toLocaleString(),
      d.status,
      d.content || "—",
    ])}
  />
);

const EncountersTab = ({ data }) => (
  <Table
    headers={["Type", "Start", "End", "Location"]}
    rows={data.map((e) => [
      e.type,
      new Date(e.period.start).toLocaleString(),
      new Date(e.period.end).toLocaleString(),
      e.location?.display,
    ])}
  />
);

const ServiceRequestsTab = ({ data }) => (
  <Table
    headers={["Type", "Code", "Status", "Date"]}
    rows={data.map((s) => [s.type, s.code, s.status, s.date])}
  />
);

const AppointmentsTab = ({ data }) => (
  <Table
    headers={["Type", "Start", "Status"]}
    rows={data.map((a) => [
      a.appointmentType?.text,
      new Date(a.start).toLocaleString(),
      a.status,
    ])}
  />
);