
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Brain, FileText, Loader2 } from "lucide-react";
const SAMPLE_BFF_URL = import.meta.env.VITE_SAMPLE_BFF_URL;
export default function ChartSummarizer() {
  const id = "7002";
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const PATIENTS = [
    {
      id: "7002",
      fullName: "Amina Patel",
      birthDate: "1988-05-22",
      gender: "F",
      telecom: [
        { system: "phone", value: "6465550189" },
        { system: "email", value: "amina.patel@example.com" },
      ],
      address: [
        {
          line: ["250 Park Ave S", "Floor 10"],
          city: "New York",
          state: "NY",
          postalCode: "10003",
        },
      ],
      status: "active",
      appointments: [
        {
          id: "appt-301",
          appointmentType: { text: "Oncology consult" },
          start: "2025-10-30T11:00:00Z",
          status: "booked",
        },
      ],
      vitals: [
        {
          code: { coding: [{ display: "Blood Pressure (Systolic)" }] },
          valueQuantity: { value: 120, unit: "mmHg" },
        },
        {
          code: { coding: [{ display: "Heart Rate" }] },
          valueQuantity: { value: 92, unit: "bpm" },
        },
      ],
      conditions: [
        {
          code: {
            coding: [
              {
                display: "Colon adenocarcinoma, sigmoid colon",
                code: "C18.7",
              },
            ],
          },
          status: "active",
          onsetDateTime: "2025-02-10",
          stage: "II",
        },
      ],
      procedures: [
        {
          code: { display: "PICC line insertion (right basilic)" },
          status: "completed",
          performedDate: "2025-02-14",
        },
        {
          code: { display: "Left hemicolectomy with primary anastomosis" },
          status: "completed",
          performedDate: "2025-02-15",
        },
      ],
      documents: [
        {
          description: "Pathology Report - Colon adenocarcinoma",
          date: "2025-02-17",
          status: "final",
        },
        {
          description: "Discharge Summary - colectomy admission",
          date: "2025-02-20",
          status: "final",
        },
      ],
      medications: [
        {
          medicationCodeableConcept: {
            text: "FOLFOX (Oxaliplatin + Leucovorin + 5-FU) - planned",
          },
          status: "planned",
          start: "2025-03-10",
        },
        {
          medicationCodeableConcept: {
            text: "Oxycodone PRN for post-op pain",
          },
          status: "completed",
          start: "2025-02-15",
          end: "2025-02-20",
        },
      ],
      encounters: [
        {
          type: "Inpatient admission",
          period: { start: "2025-02-14", end: "2025-02-20" },
        },
        {
          type: "Surgery - Left hemicolectomy",
          period: { start: "2025-02-15", end: "2025-02-15" },
        },
      ],
      allergies: [],
      immunizations: [],
      familyHistory: [],
      questionnaireResponses: [],
    },
  ];

const handleChartSummarizer = async () => {
  setLoading(true);
  setSummary("");

  try {
    const url = `${SAMPLE_BFF_URL}/api/chartsummary/${id}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error ${response.status}`);

    const data = await response.json();
    setSummary(data.summary || "⚠️ No summary available");
  } catch (error) {
    console.error("Error fetching chart summary:", error);
    setSummary("⚠️ Sorry, the assistant is unavailable right now.");
  } finally {
    setLoading(false);
  }
};

  const patient = PATIENTS.find((p) => p.id === id);
  const [activeTab, setActiveTab] = useState("vitals");

  if (!patient)
    return <div className="p-6 text-red-500">Patient not found</div>;

  const tabs = {
    vitals: {
      label: "Vitals",
      headers: ["Name", "Value"],
      rows: patient.vitals.map((v) => [
        v.code.coding[0].display,
        `${v.valueQuantity.value} ${v.valueQuantity.unit}`,
      ]),
    },
    conditions: {
      label: "Conditions",
      headers: ["Name", "Stage", "Status", "Onset"],
      rows: patient.conditions.map((c) => [
        c.code.coding[0].display,
        c.stage,
        c.status,
        c.onsetDateTime,
      ]),
    },
    procedures: {
      label: "Procedures",
      headers: ["Name", "Status", "Date"],
      rows: patient.procedures.map((p) => [
        p.code.display,
        p.status,
        p.performedDate,
      ]),
    },
    documents: {
      label: "Documents",
      headers: ["Description", "Date", "Status"],
      rows: patient.documents.map((d) => [d.description, d.date, d.status]),
    },
    medications: {
      label: "Medications",
      headers: ["Name", "Status", "Start", "End"],
      rows: patient.medications.map((m) => [
        m.medicationCodeableConcept.text,
        m.status,
        m.start || "-",
        m.end || "-",
      ]),
    },
    encounters: {
      label: "Encounters",
      headers: ["Type", "Start", "End"],
      rows: patient.encounters.map((e) => [
        e.type,
        e.period.start,
        e.period.end,
      ]),
    },
    allergies: {
      label: "Allergies",
      headers: ["Info"],
      rows: patient.allergies.map((a) => [JSON.stringify(a)]),
    },
    immunizations: {
      label: "Immunizations",
      headers: ["Info"],
      rows: patient.immunizations.map((i) => [JSON.stringify(i)]),
    },
    familyHistory: {
      label: "Family History",
      headers: ["Info"],
      rows: patient.familyHistory.map((f) => [JSON.stringify(f)]),
    },
    questionnaireResponses: {
      label: "Questionnaires",
      headers: ["Info"],
      rows: patient.questionnaireResponses.map((q) => [JSON.stringify(q)]),
    },
  };

  return (
    <div className="h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-4 pb-2">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Chart Summary
              </h1>
              <p className="text-sm text-gray-600">
                Comprehensive summary and data review
              </p>
            </div>
          </div>

          <button
            onClick={handleChartSummarizer}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md transition-all hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Summarizing...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" /> Generate Summary
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 px-4 pb-2 overflow-hidden min-h-0">
        <div className="max-w-6xl mx-auto h-full grid grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-xl rounded-3xl p-6 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-gray-800">
                  {patient.fullName}
                </h2>
                <p className="text-gray-500 text-sm">
                  {patient.gender} | DOB: {patient.birthDate}
                </p>

                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {patient.telecom.find((t) => t.system === "email")?.value ||
                      "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {patient.telecom.find((t) => t.system === "phone")?.value ||
                      "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    {patient.address?.[0]?.line?.join(", ")},{" "}
                    {patient.address?.[0]?.city}, {patient.address?.[0]?.state},{" "}
                    {patient.address?.[0]?.postalCode}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {patient.status}
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-2 text-gray-800 text-lg">
                    Appointments
                  </h3>
                  {patient.appointments.length ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-200 rounded-lg shadow-sm text-sm">
                        <thead className="bg-indigo-50">
                          <tr>
                            <th className="p-2 text-left font-semibold text-gray-700 rounded-tl-lg">
                              Type
                            </th>
                            <th className="p-2 text-left font-semibold text-gray-700">
                              Date
                            </th>
                            <th className="p-2 text-left font-semibold text-gray-700 rounded-tr-lg">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {patient.appointments.map((a, i) => (
                            <tr
                              key={i}
                              className="border-b border-gray-100 hover:bg-indigo-50"
                            >
                              <td className="p-2">{a.appointmentType.text}</td>
                              <td className="p-2">
                                {new Date(a.start).toLocaleString()}
                              </td>
                              <td className="p-2">{a.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No appointments</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2 bg-white/95 backdrop-blur-sm shadow-xl border border-white/20 rounded-3xl p-6 flex flex-col overflow-hidden">
            <div className="flex items-center mb-4 border-b border-gray-200 pb-3">
              <button
                onClick={() => {
                  const container = document.getElementById("tabs-container");
                  container?.scrollBy({ left: -150, behavior: "smooth" });
                }}
                className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div
                id="tabs-container"
                className="flex-1 flex items-center space-x-4 overflow-x-auto hide-scrollbar px-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {Object.entries(tabs).map(([key, tab]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`py-2 px-4 whitespace-nowrap transition-colors text-sm ${
                      activeTab === key
                        ? "border-b-2 border-indigo-500 font-semibold text-indigo-600"
                        : "text-gray-600 hover:text-indigo-500"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  const container = document.getElementById("tabs-container");
                  container?.scrollBy({ left: 150, behavior: "smooth" });
                }}
                className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>

            <div className="overflow-y-auto hide-scrollbar" style={{ scrollbarWidth: "none", msOverflowStyle: "none", maxHeight: "35vh" }}>
              <table className="w-full border-collapse text-sm">
                <thead className="bg-indigo-50 border-b border-gray-200 sticky top-0 z-10">
                  <tr>
                    {tabs[activeTab].headers.map((h, i) => (
                      <th
                        key={i}
                        className="p-3 text-left text-gray-700 font-semibold uppercase text-xs tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tabs[activeTab].rows.length ? (
                    tabs[activeTab].rows.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-gray-100 hover:bg-indigo-50 transition-colors"
                      >
                        {row.map((cell, j) => (
                          <td key={j} className="p-3 text-gray-800">
                            {cell || "-"}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={tabs[activeTab].headers.length}
                        className="text-center py-8 text-gray-500"
                      >
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {summary && (
              <div className="mt-5 pt-5 border-t border-gray-200 flex-shrink-0">
                <h4 className="text-xl font-bold mb-3 text-indigo-700">
                  Chart Summary
                </h4>
                {/* <div className="p-5 bg-indigo-50 border border-indigo-200 rounded-2xl text-sm text-gray-800 leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                  {summary}
                </div> */}
<div className="p-6 bg-indigo-50 border border-indigo-200 rounded-2xl text-base text-gray-800 leading-relaxed max-h-[50vh] overflow-y-auto shadow-md">
  <ReactMarkdown
    children={summary}
  />
</div>


              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
