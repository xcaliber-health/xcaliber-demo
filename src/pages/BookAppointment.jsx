
import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../layouts/DashboardLayout";
import { createAppointment } from "../api/appointment";
import { Loader2, Calendar, ArrowRight, Bell } from "lucide-react";

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

const SAMPLE_BFF_URL = import.meta.env.VITE_SAMPLE_BFF_URL;
const NOTIFICATION_PHONE_NUMBER = import.meta.env.VITE_NOTIFICATION_PHONE_NUMBER;

// Reusable Components
function Card({ children, className = "" }) {
  return (
    <div className={`bg-white/95 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 ${className}`}>
      {children}
    </div>
  );
}

function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="border-2 border-gray-200/50 py-3 px-4 rounded-2xl w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 outline-none bg-white/80 backdrop-blur-sm transition-all duration-200 placeholder:text-gray-400"
    />
  );
}

export default function BookAppointment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sourceId, departmentId, patientName,setLatestCurl } = useContext(AppContext);

  const { provider } = location.state || {};
  if (!provider) return <p>Missing provider info</p>;

  const isAthena = sourceId && sourceId.startsWith("ef");
  const patientId = isAthena
    ? import.meta.env.VITE_ATHENA_PATIENT_ID
    : import.meta.env.VITE_ELATION_PATIENT_ID;

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
      setLatestCurl,
    });

    const notificationMessage = `📩 Your appointment (${typeInfo.display}) with ${provider.name} is confirmed for ${date} ${startTime} - ${endTime}`;

    setSuccessMsg(notificationMessage);

    // Send SMS to backend
   await fetch(`${SAMPLE_BFF_URL}/api/send-sms`, {
    //await fetch("http://localhost:3000/api/send-sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ to: NOTIFICATION_PHONE_NUMBER, body: notificationMessage }),
    });

    

    // Clear form
    setDate("");
    setStartTime("");
    setEndTime("");
    setAppointmentType("562");
  } catch (err) {
    //setErrorMsg(`Booking failed: ${err.message}`);
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden">
      
{/* Header */}
<div className="flex-shrink-0 p-4 pb-1">
  <div className="max-w-4xl mx-auto flex items-center justify-between">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
        <Calendar className="w-5 h-5 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Book Appointment
        </h1>
        <p className="text-sm text-gray-600">Confirm details and schedule your appointment</p>
      </div>
    </div>

    {/* ✅ Notifications Button */}
    <Button
      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md flex items-center gap-2 text-sm px-3 py-2"
      onClick={() => navigate("/notifications")}
    >
      <Bell className="w-4 h-4" /> Notifications
    </Button>
  </div>



      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-4 overflow-auto">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden p-6">
            {/* Provider Info */}
            <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 mb-4">
              <p><strong>Provider:</strong> {provider.name}</p>
              {patientName && <p><strong>Patient:</strong> {patientName}</p>}
            </div>

            {/* Form */}
            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
              
              <div>
  <label className="block font-medium mb-1">Select Date</label>
  <Input
    type="date"
    value={date}
    onChange={(e) => {
      setDate(e.target.value);
      e.target.blur(); // Close calendar immediately
    }}
  />
</div>

<div>
  <label className="block font-medium mb-1">Start Time</label>
  <Input
    type="time"
    value={startTime}
    onChange={(e) => {
      setStartTime(e.target.value);
      e.target.blur(); // Close time picker
    }}
  />
</div>

<div>
  <label className="block font-medium mb-1">End Time</label>
  <Input
    type="time"
    value={endTime}
    onChange={(e) => {
      setEndTime(e.target.value);
      e.target.blur(); // Close time picker
    }}
  />
</div>


              <div>
                <label className="block font-medium mb-1">Appointment Type</label>
                <select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  className="border-2 border-gray-200/50 py-3 px-4 rounded-2xl w-full focus:ring-2 focus:ring-indigo-500"
                >
                  {appointmentTypes.map((t) => (
                    <option key={t.code} value={t.code}>{t.display}</option>
                  ))}
                </select>
              </div>

              <Button
                onClick={handleBook}
                disabled={loading || !date || !startTime || !endTime || !appointmentType}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white w-full flex justify-center items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Confirm & Book"}
                <ArrowRight className="w-4 h-4" />
              </Button>

              {successMsg && (
                <div className="p-3 bg-green-100 text-green-700 rounded flex justify-between">
                  <span>{successMsg}</span>
                  <button onClick={() => setSuccessMsg("")} className="ml-2 font-bold">✕</button>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-red-100 text-red-700 rounded flex justify-between">
                  <span>{errorMsg}</span>
                  <button onClick={() => setErrorMsg("")} className="ml-2 font-bold">✕</button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <style >{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #e0e7ff #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e0e7ff;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c7d2fe;
        }
      `}</style>
    </div>
  );
}
