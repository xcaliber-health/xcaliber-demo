
// src/pages/AllergiesTab.jsx
import { useEffect, useState, useContext } from "react";
import { fetchAllergies, createAllergy } from "../api/AllergiesApi";
import { AppContext } from "../layouts/DashboardLayout";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AllergiesTab({ patientId }) {
  const { sourceId, departmentId, setLatestCurl } = useContext(AppContext);

  const [allergies, setAllergies] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    allergy: "",
    code: "",
    system: "athena",
    category: "medication",
    criticality: "",
    note: "",
    onsetDateTime: "",
    reaction: "",
    deactivatedDate: "",
    reactivatedDate: "",
    status: "",
  });

  // Fetch allergies
  useEffect(() => {
    async function loadAllergies() {
      setLoadingList(true);
      try {
        const data = await fetchAllergies(patientId, sourceId, departmentId, setLatestCurl);

        const sorted = (data.entry || []).sort((a, b) => {
          const timeA =
            new Date(a.resource?.meta?.created || a.resource?.meta?.lastUpdated).getTime() || 0;
          const timeB =
            new Date(b.resource?.meta?.created || b.resource?.meta?.lastUpdated).getTime() || 0;
          return timeB - timeA;
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
  }, [patientId, sourceId, departmentId, setLatestCurl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createAllergy(patientId, sourceId, departmentId, formValues, setLatestCurl);
      toast.success("Allergy created successfully");
      setOpen(false);
      setFormValues({
        allergy: "",
        code: "",
        system: "athena",
        category: "medication",
        criticality: "",
        note: "",
        onsetDateTime: "",
        reaction: "",
        deactivatedDate: "",
        reactivatedDate: "",
        status: "",
      });

      const updated = await fetchAllergies(patientId, sourceId, departmentId, setLatestCurl);

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

      {/* Add Allergy Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[500px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Add Allergy</h2>
            
            <form onSubmit={handleSubmit} className="space-y-3">
  {/* Allergy dropdown */}
  <label className="font-medium">Allergy</label>
  <select
    name="allergy"
    value={formValues.allergy}
    onChange={handleChange}
    className="border rounded-lg p-2 w-full"
    required
  >
    <option value="">Select an allergy</option>
    <option value="Penicillin">Penicillin</option>
    {/* You can add more allergy options here */}
  </select>

  {/* Hidden code field (auto set to 12345) */}
  <input
    type="hidden"
    name="code"
    value="12345"
  />

  {/* Category */}
  <label className="font-medium">Category</label>
  <select
    name="category"
    value={formValues.category}
    onChange={handleChange}
    className="border rounded-lg p-2 w-full"
  >
    <option value="medication">Medication</option>
    <option value="food">Food</option>
    <option value="environment">Environment</option>
    <option value="biologic">Biologic</option>
  </select>

  {/* Criticality */}
  <label className="font-medium">Criticality</label>
  <select
    name="criticality"
    value={formValues.criticality}
    onChange={handleChange}
    className="border rounded-lg p-2 w-full"
  >
    <option value="">Select Criticality</option>
    <option value="low">Low</option>
    <option value="high">High</option>
    <option value="unable-to-assess">Unable to assess</option>
  </select>

  {/* Note */}
  <label className="font-medium">Note</label>
  <input
    name="note"
    value={formValues.note}
    onChange={handleChange}
    placeholder="Note"
    className="border rounded-lg p-2 w-full"
  />

  {/* Onset Date */}
  <label className="font-medium">Onset Date</label>
  <input
    name="onsetDateTime"
    type="datetime-local"
    value={formValues.onsetDateTime}
    onChange={handleChange}
    className="border rounded-lg p-2 w-full"
  />

  {/* Deactivated Date */}
  <label className="font-medium">Deactivated Date</label>
  <input
    name="deactivatedDate"
    type="datetime-local"
    value={formValues.deactivatedDate}
    onChange={handleChange}
    className="border rounded-lg p-2 w-full"
  />

  {/* Reactivated Date */}
  <label className="font-medium">Reactivated Date</label>
  <input
    name="reactivatedDate"
    type="date"
    value={formValues.reactivatedDate}
    onChange={handleChange}
    className="border rounded-lg p-2 w-full"
  />

  {/* Save Button */}
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

  {/* Cancel Button */}
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
                <h3 className="text-lg font-bold text-blue-600 mb-2">
                  Allergy: {item.resource?.code?.coding?.[0]?.display || "Unknown"}
                </h3>
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
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Status:</span>{" "}
                  {item.resource?.clinicalStatus?.coding?.[0]?.code || "-"}
                </p>
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
