
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewClaim() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState("");
  const [coverage, setCoverage] = useState("");
  const [items, setItems] = useState([
    { code: "", description: "", quantity: 1, unitPrice: 0 }
  ]);

  const handleSubmit = async () => {
    const newClaim = {
      patient: { id: patient, name: patient },
      provider: { id: "pr1", name: "Demo Provider" },
      coverage: { id: coverage, plan: coverage },
      serviceDate: new Date().toISOString(),
      totalBilled: items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
      items
    };

    const res = await fetch("http://localhost:5000/api/claims", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newClaim)
    });

    const saved = await res.json();
    navigate(`/claims/${saved.id}`);
  };

  const totalBilled = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">New Claim</h1>

      <div className="bg-white shadow rounded-2xl p-6 space-y-6">
        {/* Patient & Coverage */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Patient Name</label>
            <input
              value={patient}
              onChange={(e) => setPatient(e.target.value)}
              className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Coverage Plan</label>
            <input
              value={coverage}
              onChange={(e) => setCoverage(e.target.value)}
              className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
        </div>

        {/* Services Table */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Services</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border divide-y divide-gray-200">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-2">CPT Code</th>
                  <th className="p-2">Description</th>
                  <th className="p-2 w-20">Qty</th>
                  <th className="p-2 w-24">Unit Price</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-2">
                      <input
                        value={item.code}
                        onChange={(e) =>
                          setItems(items.map((it, i) =>
                            i === idx ? { ...it, code: e.target.value } : it
                          ))
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        value={item.description}
                        onChange={(e) =>
                          setItems(items.map((it, i) =>
                            i === idx ? { ...it, description: e.target.value } : it
                          ))
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          setItems(items.map((it, i) =>
                            i === idx ? { ...it, quantity: Number(e.target.value) } : it
                          ))
                        }
                        className="border rounded px-2 py-1 w-full text-center"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          setItems(items.map((it, i) =>
                            i === idx ? { ...it, unitPrice: Number(e.target.value) } : it
                          ))
                        }
                        className="border rounded px-2 py-1 w-full text-right"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={() =>
              setItems([...items, { code: "", description: "", quantity: 1, unitPrice: 0 }])
            }
            className="mt-2 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded shadow-sm"
          >
            + Add Item
          </button>
        </div>

        {/* Total & Submit */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-lg font-medium">
            Total Billed: ${totalBilled.toFixed(2)}
          </div>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow"
          >
            Submit Claim
          </button>
        </div>
      </div>
    </div>
  );
}
