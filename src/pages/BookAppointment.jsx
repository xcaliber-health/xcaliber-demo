
import { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "../layouts/DashboardLayout";
import { createAppointment } from "../api/appointment";

// Appointment type mappings
const appointmentMappings = {
  "562": { display: "Nurse Visit", location: "Location/150" },
  "502": { display: "XRAY", location: "Location/1" },
  "62": { display: "Consult", location: "Location/1" },
  "423": { display: "Collaborative 2", location: "Location/1" },
  "962": { display: "Health History Checkup", location: "Location/1" },
  "1064": { display: "Any angela", location: "Location/1" },
  "443": { display: "Hearing Eval", location: "Location/1" },
};

export default function BookAppointment() {
  const location = useLocation();
  const { sourceId, departmentId, patientName } = useContext(AppContext);

  const { provider } = location.state || {};
  if (!provider) return <p>Missing provider info</p>;

  const isAthena = sourceId && sourceId.startsWith("ef");
  const patientId = isAthena
    ? import.meta.env.VITE_ATHENA_PATIENT_ID
    : import.meta.env.VITE_ELATION_PATIENT_ID;

  // Local state
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("562");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const appointmentTypes = Object.entries(appointmentMappings).map(
    ([code, info]) => ({ code, display: info.display })
  );

  async function handleBook() {
    setErrorMsg("");
    setSuccessMsg("");

    if (!date || !startTime || !endTime || !appointmentType) {
      setErrorMsg("Please select date, start/end time, and appointment type.");
      return;
    }

    const start = new Date(`${date}T${startTime}:00Z`);
    const end = new Date(`${date}T${endTime}:00Z`);

    if (end <= start) {
      setErrorMsg("End time must be later than start time.");
      return;
    }

    const typeInfo = appointmentMappings[appointmentType];

    try {
      setLoading(true);
      await createAppointment({
        patientId,
        providerId: provider.id,
        sourceId,
        departmentId,
        start: start.toISOString(),
        end: end.toISOString(),
        appointmentType: { code: appointmentType, display: typeInfo.display },
      });

      setSuccessMsg(
        `✅ Appointment (${typeInfo.display}) successfully booked for ${date} ${startTime} - ${endTime}`
      );

      // reset only on success
      setDate("");
      setStartTime("");
      setEndTime("");
      setAppointmentType("562");
    } catch (err) {
      setErrorMsg(`Booking failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-6">
      {/* Card */}
      <div className="bg-white shadow-md rounded-2xl overflow-hidden">
        {/* Card Header */}
        <div className="bg-gray-100 px-4 py-3 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Book Appointment
          </h2>
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-4">
          {/* Patient + Provider */}
          <div className="bg-gray-50 p-3 rounded border text-sm">
            {/*<p>
              <strong>Patient:</strong> {patientName}
            </p>*/}
            <p>
              <strong>Provider:</strong> {provider.name}
            </p>
          </div>

          {/* Date input */}
          <div>
            <label className="block font-medium mb-1">Select Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Start time input */}
          <div>
            <label className="block font-medium mb-1">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* End time input */}
          <div>
            <label className="block font-medium mb-1">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Appointment type dropdown */}
          <div>
            <label className="block font-medium mb-1">Appointment Type</label>
            <select
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value)}
              className="border p-2 rounded w-full"
            >
              {appointmentTypes.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.display}
                </option>
              ))}
            </select>
          </div>

          {/* Confirm button */}
          <button
            onClick={handleBook}
            disabled={
              loading || !date || !startTime || !endTime || !appointmentType
            }
            className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Booking..." : "Confirm & Book"}
          </button>

          {/* Success message */}
          {successMsg && (
            <div className="mt-2 p-3 bg-green-100 text-green-700 rounded flex justify-between">
              <span>{successMsg}</span>
              <button
                onClick={() => setSuccessMsg("")}
                className="ml-2 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Error message */}
          {errorMsg && (
            <div className="mt-2 p-3 bg-red-100 text-red-700 rounded flex justify-between">
              <span>{errorMsg}</span>
              <button
                onClick={() => setErrorMsg("")}
                className="ml-2 font-bold"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
