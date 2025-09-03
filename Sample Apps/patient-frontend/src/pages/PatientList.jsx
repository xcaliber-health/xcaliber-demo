import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../layouts/DashboardLayout";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();
  const { ehr, department } = useContext(AppContext);

  useEffect(() => {
    fetch(`http://localhost:5000/api/patients?ehr=${ehr}&department=${department}`)
      .then(res => res.json())
      .then(data => setPatients(data));
  }, [ehr, department]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Patient Directory ({ehr} - Dept {department})</h1>

      <div className="overflow-hidden rounded-2xl shadow bg-white">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Gender</th>
              <th className="p-3">DOB</th>
              <th className="p-3">EHR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {patients.map(p => (
              <tr 
                key={p.id}
                onClick={() => navigate(`/patients/${p.id}`)}
                className="hover:bg-blue-50 cursor-pointer transition"
              >
                <td className="p-3 font-medium text-gray-900">{p.name}</td>
                <td className="p-3">{p.gender}</td>
                <td className="p-3">{p.birthDate}</td>
                <td className="p-3">{p.ehr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
