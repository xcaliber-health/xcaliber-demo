// pages/ProviderSearch.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ProviderSearch() {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/scheduling/providers")
      .then((res) => res.json())
      .then(setProviders);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Find a Provider</h2>
      <ul className="space-y-2">
        {providers.map((p) => (
          <li key={p.id} className="p-3 border rounded-lg flex justify-between">
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-gray-600">{p.specialty}</p>
            </div>
            <Link
              to={`/scheduling/slots/${p.id}`}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg"
            >
              View Slots
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
