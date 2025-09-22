// pages/ConfirmBooking.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ConfirmBooking() {
  const { slotId } = useParams();
  const [slot, setSlot] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/scheduling/slots/${slotId}`)
      .then((res) => res.json())
      .then(setSlot);
  }, [slotId]);

  function handleBook() {
    fetch("http://localhost:5000/api/scheduling/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId: "patient-123",
        slotId: slot.id,
        providerId: slot.providerId,
      }),
    })
      .then((res) => res.json())
      .then(() => navigate("/scheduling"));
  }

  if (!slot) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Confirm Appointment</h2>
      <p><strong>Provider:</strong> {slot.providerName}</p>
      <p><strong>Time:</strong> {new Date(slot.start).toLocaleString()}</p>
      <button
        onClick={handleBook}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Confirm Booking
      </button>
    </div>
  );
}
