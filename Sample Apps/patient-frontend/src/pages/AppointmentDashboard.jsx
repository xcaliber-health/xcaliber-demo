// pages/AppointmentDashboard.jsx
import { useEffect, useState } from "react";

export default function AppointmentDashboard() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/scheduling/appointments/?patient=patient-123")
      .then((res) => res.json())
      .then(setAppointments);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">My Appointments</h2>
      <table className="w-full text-sm border">
        <thead>
          <tr>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Provider</th>
            <th className="p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.id} className="border-t">
              <td className="p-2">{new Date(a.start).toLocaleString()}</td>
              <td className="p-2">{a.providerName}</td>
              <td className="p-2">{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
