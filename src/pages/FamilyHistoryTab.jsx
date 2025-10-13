
import { useEffect, useState, useContext } from "react";
import { fetchFamilyHistory, createFamilyHistory } from "../api/FamilyHistoryApi";
import { AppContext } from "../layouts/DashboardLayout";
import { Loader2, Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function FamilyHistoryTab({ patientId }) {
  const { sourceId, departmentId, setLatestCurl } = useContext(AppContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    relation: "",
    condition: ""
  });

  const relationships = [
    "Mother",
    "Father",
    "Brother",
    "Sister",
    "Son",
    "Daughter",
    "Maternal Grandmother",
    "Maternal Grandfather",
    "Paternal Grandmother",
    "Paternal Grandfather",
    "Maternal Aunt",
    "Maternal Uncle",
    "Paternal Aunt",
    "Paternal Uncle",
    "Unspecified Relation"
  ];

  useEffect(() => {
  async function loadFamilyHistory() {
    if (!patientId || !sourceId || !departmentId) return;

    setLoading(true);
    try {
      const data = await fetchFamilyHistory(patientId, sourceId, departmentId, setLatestCurl);
      const entries = data?.entry || [];

      if (entries.length > 0) {
        setHistory(entries);
        toast.success(`Family history loaded successfully`);
      } else {
        setHistory([]);
        toast.error("No family history found for this patient");
      }

    } catch (err) {
      console.error("Error fetching family history:", err);
      toast.error(`Failed to load family history: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  loadFamilyHistory();
}, [patientId, sourceId, departmentId, setLatestCurl]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId || !sourceId || !departmentId) return;

    setLoading(true);
    try {
      await createFamilyHistory(patientId, sourceId, departmentId, formValues);
      toast.success("Family history entry created successfully");
      setFormValues({ relation: "", condition: "" });
      setOpen(false);

      const refreshed = await fetchFamilyHistory(patientId, sourceId, departmentId, setLatestCurl);
      setHistory(refreshed.entry || []);
    } catch (err) {
      console.error("Error creating family history:", err);
      toast.error("Failed to create family history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Family History</h2>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Family History
        </button>
      </div>

      {/* Add Family History Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add Family History</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block mb-1">Relation</label>
                <select
                  name="relation"
                  value={formValues.relation}
                  onChange={handleChange}
                  className="border p-2 rounded-lg w-full"
                  required
                >
                  <option value="">Select relation</option>
                  {relationships.map((rel, i) => (
                    <option key={i} value={rel}>
                      {rel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">Condition</label>
                <input
                  name="condition"
                  type="text"
                  value={formValues.condition}
                  onChange={handleChange}
                  placeholder="e.g. Diabetes"
                  className="border p-2 rounded-lg w-full"
                  required
                />
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {loading ? (
                    <span className="flex justify-center items-center">
                      <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      Saving...
                    </span>
                  ) : (
                    "Save"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 border py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Family History Table */}
      {loading ? (
        <div className="flex items-center justify-center py-8 text-gray-600">
          <Loader2 className="animate-spin w-5 h-5 mr-2" />
          Loading family history...
        </div>
      ) : history.length === 0 ? (
        <p className="text-gray-500">No family history found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 border-b">Relation</th>
                <th className="text-left px-4 py-2 border-b">Condition</th>
              </tr>
            </thead>
            <tbody>
              {history.map((e, i) => {
                const res = e.resource;
                const relation = res.relationship?.coding?.[0]?.display || "-";
                const conditions = res.condition
                  ?.map((c) => c.code?.coding?.map((code) => code.display).filter(Boolean).join(", "))
                  .filter(Boolean)
                  .join("; ") || "-";
                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{relation}</td>
                    <td className="px-4 py-2 border-b">{conditions}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
