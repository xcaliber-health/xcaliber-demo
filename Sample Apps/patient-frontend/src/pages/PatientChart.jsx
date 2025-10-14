import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PatientChart() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [problems, setProblems] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [immunizations, setImmunizations] = useState([]);
  const [medications, setMedications] = useState([]);
  const [medicationsOrders, setMedicationsOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("vitals");

  const [showVitalForm, setShowVitalForm] = useState(false);
const [newVital, setNewVital] = useState({ name: "", value: "", date: "", year: "" });


  useEffect(() => {
    fetch(`http://localhost:5000/api/patients/${id}`)
      .then(r => r.json())
      .then(data => {
        setPatient(data);
        setAppointments(data.appointments || []);
        setVitals(data.vitals || []);
        setProblems(data.problems || []);
        setAllergies(data.allergies || []);
        setImmunizations(data.immunizations || []);
        setMedications(data.medications || []);
        setMedicationsOrders(data.medicationsOrder || []);
        setRequests(data.requests || []);

        
      });
  }, [id]);

  if (!patient) return <div className="p-6">Loading...</div>;

  const tabs = [
    "vitals",
    "problems",
    "allergies",
    "immunizations",
    "medications",
    "medication Orders",
    "visits",
    "notes",
    "requests"
  ];

  return (
    <div className="p-6 grid grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="col-span-1 space-y-4">
        <div className="bg-white p-4 shadow rounded-lg border">
          <h2 className="text-xl font-semibold">{patient.name}</h2>
          <p>{patient.gender.toUpperCase()} | DOB: {patient.birthDate}</p>
          <p>Email: {patient.email}</p>
        </div>

        <div className="bg-white p-4 shadow rounded-lg border">
          <h3 className="font-semibold mb-2">Upcoming Appointments</h3>
          <ul className="space-y-2">
            {appointments.map((a, i) => (
              <li key={i} className="text-sm border-b pb-1">
                {a.type} — {new Date(a.date).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Column */}
      <div className="col-span-2 bg-white p-4 shadow rounded-lg border">
        {/* Tabs with scroll + arrows */}
        <div className="relative">
          <div
            className="flex space-x-4 border-b mb-4 overflow-x-auto no-scrollbar"
            id="tab-container"
          >
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 whitespace-nowrap ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 font-semibold text-blue-600"
                    : "text-gray-600 hover:text-blue-500"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Left Arrow */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow p-1 rounded-full"
            onClick={() => {
              document
                .getElementById("tab-container")
                .scrollBy({ left: -150, behavior: "smooth" });
            }}
          >
          </button>

          {/* Right Arrow */}
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow p-1 rounded-full"
            onClick={() => {
              document
                .getElementById("tab-container")
                .scrollBy({ left: 150, behavior: "smooth" });
            }}
          >
          </button>
        </div>

        {/* Table Renderer */}
        <div className="overflow-x-auto">
          {activeTab === "vitals" && (
            <div>
              {/* Add Button */}
              <button
                onClick={() => setShowVitalForm(true)}
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded shadow"
              >
                + Add Vital
              </button>

              {/* Add Vital Form */}
              {showVitalForm && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    // save to backend
                    const res = await fetch(`http://localhost:5000/api/patients/${id}/vitals`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(newVital),
                    });
                    const saved = await res.json();

                    // update state
                    setVitals([...vitals, saved]);
                    setShowVitalForm(false);
                    setNewVital({ name: "", value: "", date: "", year: "" });
                  }}
                  className="space-y-2 bg-gray-100 p-4 rounded shadow mb-4"
                >
                  <input
                    type="text"
                    placeholder="Name (e.g. Blood Pressure)"
                    value={newVital.name}
                    onChange={(e) => setNewVital({ ...newVital, name: e.target.value })}
                    className="border p-2 w-full"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 120/80)"
                    value={newVital.value}
                    onChange={(e) => setNewVital({ ...newVital, value: e.target.value })}
                    className="border p-2 w-full"
                    required
                  />
                  <input
                    type="date"
                    value={newVital.date}
                    onChange={(e) => setNewVital({ ...newVital, date: e.target.value })}
                    className="border p-2 w-full"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Year (e.g. 2025)"
                    value={newVital.year}
                    onChange={(e) => setNewVital({ ...newVital, year: e.target.value })}
                    className="border p-2 w-full"
                  />
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded shadow">
                    Save Vital
                  </button>
                </form>
              )}

              {/* Reusable Table */}
              <Table
                headers={["Vitals", "Value", "Date", "Year"]}
                rows={vitals.map(a => [a.name, a.value, a.date, a.year])}
              />

            </div>
          )}

          {activeTab === "problems" && (
            <Table
              headers={["Problems", "Synopsis", "Date", "Year"]}
              rows={problems.map(a => [a.name, a.synopsis, a.date, a.year])}
            />
          )}

          {activeTab === "allergies" && (
            <Table
              headers={["Allergy", "Status", "Date", "Year"]}
              rows={allergies.map(a => [a.name, a.status, a.date, a.year])}
            />
          )}

          {activeTab === "immunizations" && (
            <Table
              headers={["Immunization", "Date", "Year"]}
              rows={immunizations.map(a => [a.name, a.date, a.year])}
            />
          )}

          {activeTab === "medications" && (
            <Table
              headers={["Medication", "Date", "Year"]}
              rows={medications.map(a => [a.name, a.date, a.year])}
            />
          )}

          {activeTab === "medication Orders" && (
            <Table
              headers={["Medication Order", "Date", "Year"]}
              rows={medicationsOrders.map(a => [a.name, a.date, a.year])}
            />
          )}

          {activeTab === "visits" && (
            <Table headers={["Visit Type", "Date"]} rows={[]} />
          )}

          {activeTab === "notes" && (
            <Table headers={["Note", "Date"]} rows={[]} />
          )}

          {activeTab === "requests" && (
            <Table
              headers={["Time", "Request"]}
              rows={requests.map(a => [a.time, a.request])}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* Reusable Table Component */
function Table({ headers, rows }) {
  return (
    <table className="w-full border border-gray-300 shadow rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          {headers.map((h, i) => (
            <th
              key={i}
              className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length > 0 ? (
          rows.map((row, i) => (
            <tr
              key={i}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="border border-gray-300 px-3 py-2 text-sm text-gray-700"
                >
                  {cell || "-"}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={headers.length}
              className="text-center py-4 text-gray-500"
            >
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
