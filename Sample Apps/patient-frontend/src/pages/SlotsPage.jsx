// pages/SlotsPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function SlotsPage() {
  const { providerId } = useParams();
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/scheduling/slots?provider=${providerId}`)
      .then((res) => res.json())
      .then(setSlots);
  }, [providerId]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Available Slots</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {slots.map((s) => (
          <Link
            key={s.id}
            to={`/scheduling/confirm/${s.id}`}
            className="p-3 border rounded-xl bg-green-100 hover:bg-green-200 text-center"
          >
            {new Date(s.start).toLocaleString()}
          </Link>
        ))}
      </div>
    </div>
  );
}
