
// src/pages/AllergiesTab.jsx
import { useEffect, useState, useContext } from "react";
import { fetchAllergies, createAllergy } from "../api/AllergiesApi";
import { AppContext } from "../layouts/DashboardLayout";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AllergiesTab({ patientId }) {
  const { sourceId, departmentId } = useContext(AppContext);

  const [allergies, setAllergies] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    allergy: "",
    reaction: "",
    severity: "",
    status: "",
    onsetDate: "",
  });

  useEffect(() => {
    async function loadAllergies() {
      setLoadingList(true);
      try {
        const data = await fetchAllergies(patientId, sourceId, departmentId);

        const sorted = (data.entry || []).sort((a, b) => {
          const timeA =
            new Date(a.resource?.meta?.created || a.resource?.meta?.lastUpdated).getTime() || 0;
          const timeB =
            new Date(b.resource?.meta?.created || b.resource?.meta?.lastUpdated).getTime() || 0;
          return timeB - timeA; // newest first
        });

        setAllergies(sorted);
        toast.success("Allergies loaded successfully");
      } catch (err) {
        console.error("Error fetching allergies:", err);
        toast.error("Failed to load allergies");
      } finally {
        setLoadingList(false);
      }
    }

    if (patientId && sourceId && departmentId) loadAllergies();
  }, [patientId, sourceId, departmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createAllergy(patientId, sourceId, departmentId, formValues);
      toast.success("Allergy added successfully");
      setOpen(false);
      setFormValues({
        allergy: "",
        reaction: "",
        severity: "",
        status: "",
        onsetDate: "",
      });

      const updated = await fetchAllergies(patientId, sourceId, departmentId);

      const sorted = (updated.entry || []).sort((a, b) => {
        const timeA =
          new Date(a.resource?.meta?.created || a.resource?.meta?.lastUpdated).getTime() || 0;
        const timeB =
          new Date(b.resource?.meta?.created || b.resource?.meta?.lastUpdated).getTime() || 0;
        return timeB - timeA;
      });

      setAllergies(sorted);
    } catch (err) {
      console.error("Error creating allergy:", err);
      toast.error("Failed to add allergy");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Allergies</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => setOpen(true)}
        >
          + Add Allergy
        </button>
      </div>

      {/* Add Allergy Dialog */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Add Allergy</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {["allergy", "reaction", "severity", "status"].map((field) => (
                <div key={field}>
                  <label className="block mb-1 capitalize">{field}</label>
                  <input
                    name={field}
                    value={formValues[field]}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full focus:ring focus:ring-blue-200"
                  />
                </div>
              ))}

              <div>
                <label className="block mb-1">Onset Date</label>
                <input
                  type="date"
                  name="onsetDate"
                  value={formValues.onsetDate}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full focus:ring focus:ring-blue-200"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                disabled={submitting}
              >
                {submitting ? (
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

      {/* Allergies List */}
      {loadingList ? (
        <div className="flex items-center justify-center py-6 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading allergies...
        </div>
      ) : allergies.length > 0 ? (
        <div className="space-y-4">
          {allergies.map((item, idx) => {
            const createdTime = item.resource?.meta?.created;
            const lastUpdated = item.resource?.meta?.lastUpdated;

            return (
              <div
                key={idx}
                className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
              >
                {/* Allergy Heading */}
                <h3 className="text-lg font-bold text-blue-600 mb-2">
                  Allergy: {item.resource?.code?.coding?.[0]?.display || "Unknown"}
                </h3>

                {/* Reactions as List */}
                <div className="mb-2">
                  <h4 className="font-medium text-gray-700">Reactions:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-800">
                    {item.resource?.reaction?.length > 0 ? (
                      item.resource.reaction.map((r, i) => (
                        <li key={i}>
                          {r.description ? (
                            <>
                              <span className="font-semibold">{r.description}</span> —{" "}
                            </>
                          ) : null}
                          Severity: {r.severity || "-"}
                          {r.onset && `, Onset: ${r.onset.split("T")[0]}`}
                        </li>
                      ))
                    ) : (
                      <li>No reactions recorded</li>
                    )}
                  </ul>
                </div>

                {/* Status */}
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Status:</span>{" "}
                  {item.resource?.clinicalStatus?.coding?.[0]?.code || "-"}
                </p>

                {/* Created & Updated */}
                {createdTime && (
                  <p className="text-xs text-gray-400">
                    Created: {new Date(createdTime).toLocaleString()}
                  </p>
                )}
                {lastUpdated && (
                  <p className="text-xs text-gray-400">
                    Last Updated: {new Date(lastUpdated).toLocaleString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No allergies found.</p>
      )}
    </div>
  );
}
