
// src/pages/ImmunizationsTab.jsx
import { useEffect, useState, useContext } from "react";
import { fetchImmunizations, createImmunization } from "../api/ImmunizationsApi";
import { AppContext } from "../layouts/DashboardLayout";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ImmunizationsTab({ patientId }) {
  const { sourceId, departmentId , setLatestCurl} = useContext(AppContext);
  const [immunizations, setImmunizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    vaccine: "",
    occurrenceDate: "",
  });

  // ✅ Fetch immunizations
  useEffect(() => {
    async function loadImmunizations() {
      if (!patientId || !departmentId || !sourceId) return;

      setLoading(true);
      try {
        const data = await fetchImmunizations(patientId, sourceId, departmentId, setLatestCurl);
        let entries = data.entry || [];

        // Sort by latest date
        entries.sort((a, b) => {
          const dateA = a.resource?.occurrenceDate
            ? new Date(a.resource.occurrenceDate)
            : new Date(a.resource?.meta?.lastUpdated || 0);
          const dateB = b.resource?.occurrenceDate
            ? new Date(b.resource.occurrenceDate)
            : new Date(b.resource?.meta?.lastUpdated || 0);
          return dateB - dateA;
        });

        setImmunizations(entries);
        toast.success("Immunizations loaded successfully");
      } catch (err) {
        console.error("Error fetching immunizations:", err);
        toast.error("Failed to load immunizations");
      } finally {
        setLoading(false);
      }
    }

    loadImmunizations();
  }, [patientId, sourceId, departmentId, setLatestCurl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId || !departmentId || !sourceId) return;

    setLoading(true);
    try {
      await createImmunization(patientId, sourceId, departmentId, formValues);
      toast.success("Immunization added successfully");

      setOpen(false);
      setFormValues({ vaccine: "", occurrenceDate: "" });

      const updated = await fetchImmunizations(patientId, sourceId, departmentId);
      setImmunizations(updated.entry || []);
    } catch (err) {
      console.error("Error creating immunization:", err);
      toast.error("Failed to add immunization");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Immunizations</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => setOpen(true)}
        >
          + Add Immunization
        </button>
      </div>

      {/* Dialog Form */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Add Immunization</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block mb-1">Vaccine</label>
                <input
                  type="text"
                  name="vaccine"
                  value={formValues.vaccine}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block mb-1">Occurrence Date</label>
                <input
                  type="date"
                  name="occurrenceDate"
                  value={formValues.occurrenceDate}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full focus:ring focus:ring-blue-200"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Saving...
                  </span>
                ) : (
                  "Save"
                )}
              </button>
              <button
                type="button"
                className="mt-2 w-full px-4 py-2 border rounded-lg hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Display immunizations list */}
      {loading ? (
        <div className="flex items-center justify-center py-6 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading immunizations...
        </div>
      ) : immunizations.length > 0 ? (
        <div className="space-y-2">
          {immunizations.map((i, idx) => {
            const dateValue = i.resource?.occurrenceDate
              ? new Date(i.resource.occurrenceDate)
              : i.resource?.meta?.lastUpdated
              ? new Date(i.resource.meta.lastUpdated)
              : null;

            return (
              <div
                key={idx}
                className="p-3 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
              >
                <p className="font-medium text-gray-800">
                  {i.resource?.vaccineCode?.coding?.[0]?.display || "Vaccine"}
                </p>
                <p className="text-sm text-gray-600">
                  Date: {dateValue ? dateValue.toLocaleDateString() : "-"}
                </p>
                <p className="text-sm text-gray-500">
                  Status: {i.resource?.status || "-"}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No immunizations found.</p>
      )}
    </div>
  );
}
