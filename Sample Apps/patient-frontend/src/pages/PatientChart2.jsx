import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PatientChart() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [data, setData] = useState({
    vitals: [],
    problems: [],
    allergies: [],
    immunizations: [],
    medications: [],
    medicationOrders: [],
    requests: [],
  });
  const [activeTab, setActiveTab] = useState("vitals");
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState({});

  useEffect(() => {
    fetch(`http://localhost:5000/api/patients/${id}`)
      .then(r => r.json())
      .then(d => {
        setPatient(d);
        setAppointments(d.appointments || []);
        setData({
          vitals: d.vitals || [],
          problems: d.problems || [],
          allergies: d.allergies || [],
          immunizations: d.immunizations || [],
          medications: d.medications || [],
          medicationOrders: d.medicationsOrder || [],
          requests: d.requests || [],
        });
      })
      .catch(err => console.error("Failed to load patient", err));
  }, [id]);

  if (!patient) return <div className="p-6">Loading...</div>;

  const tabs = [
    "vitals",
    "problems",
    "allergies",
    "immunizations",
    "medications",
    "medicationOrders",
    "visits",
    "notes",
    "requests",
  ];

  // Define fields for each tab
  const fields = {
    vitals: ["name", "value", "date", "year"],
    problems: ["name", "synopsis", "date", "year"],
    allergies: ["name", "status", "date", "year"],
    immunizations: ["name", "date", "year"],
    medications: ["name", "date", "year"],
    medicationOrders: ["name", "date", "year"],
    requests: ["time", "request"],
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/patients/${id}/${activeTab}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });
      const saved = await res.json();
      setData(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], saved],
      }));
      setShowForm(false);
      setNewEntry({});
    } catch (err) {
      console.error("Save failed", err);
    }
  };

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
        {/* Tabs */}
        <div className="flex space-x-4 border-b mb-4 overflow-x-auto no-scrollbar" id="tab-container">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setShowForm(false); }}
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

        {/* Add Button */}
        {fields[activeTab] && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-4 bg-blue-500 text-white px-4 py-2 rounded shadow"
          >
            + Add {activeTab}
          </button>
        )}

        {/* Add Form */}
        {showForm && (
          <div className="space-y-2 bg-gray-100 p-4 rounded shadow mb-4">
            {fields[activeTab].map(f => (
              <input
                key={f}
                type={f === "date" ? "date" : f === "year" ? "number" : "text"}
                placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                value={newEntry[f] || ""}
                onChange={(e) => setNewEntry({ ...newEntry, [f]: e.target.value })}
                className="border p-2 w-full"
                required
              />
            ))}
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded shadow"
            >
              Save
            </button>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          {fields[activeTab] ? (
            <Table
              headers={fields[activeTab].map(h => h.charAt(0).toUpperCase() + h.slice(1))}
              rows={data[activeTab].map(item =>
                fields[activeTab].map(f =>
                  f === "date" ? new Date(item[f]).toLocaleDateString() : item[f]
                )
              )}
            />
          ) : (
            <Table headers={["Note"]} rows={[]} />
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
            <th key={i} className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length > 0 ? (
          rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors duration-200">
              {row.map((cell, j) => (
                <td key={j} className="border border-gray-300 px-3 py-2 text-sm text-gray-700">
                  {cell || "-"}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={headers.length} className="text-center py-4 text-gray-500">
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
