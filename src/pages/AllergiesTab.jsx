import { useEffect, useState, useContext } from "react";
import { fetchAllergies, createAllergy } from "../api/AllergiesApi";
import { AppContext } from "../layouts/DashboardLayout";
import { ECW_MOCK_PATIENTS } from "../data/patientListMock";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AllergiesTab({ patientId }) {
  const { sourceId, departmentId, setLatestCurl , localEvents, setLocalEvents} = useContext(AppContext);
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

  const isMockSource =
    sourceId !== import.meta.env.VITE_SOURCE_ID_ATHENA &&
    sourceId !== import.meta.env.VITE_SOURCE_ID_ELATION;

  const normalizeAllergy = (a) => {
    const resource = a.resource || a;
    return {
      code:
        resource?.code?.coding?.[0]?.display ||
        resource?.code ||
        "Unknown Allergy",
      clinicalStatus:
        resource?.clinicalStatus?.coding?.[0]?.code ||
        resource?.clinicalStatus ||
        "-",
      onsetDateTime: resource?.onsetDateTime || "",
      reaction:
        resource?.reaction?.map((r) => ({
          description: r.description || "",
          severity: r.severity || "-",
          onset: r.onset || "",
        })) || [],
      meta: resource?.meta || {},
    };
  };

  useEffect(() => {
    async function loadAllergies() {
      setLoadingList(true);
      try {
        let data = [];
        if (isMockSource) {
          const patientMock = ECW_MOCK_PATIENTS.find((p) => p.id === patientId);
          if (!patientMock) throw new Error("Patient not found in mock data");
          data = (patientMock.allergies || []).map((a) => ({ resource: a }));
        } else {
          const fetched = await fetchAllergies(
            patientId,
            sourceId,
            departmentId,
            setLatestCurl
          );
          data = fetched.entry || [];
        }
        const normalized = data.map(normalizeAllergy).sort((a, b) => {
          const timeA = new Date(a.onsetDateTime || 0).getTime();
          const timeB = new Date(b.onsetDateTime || 0).getTime();
          return timeB - timeA;
        });
        setAllergies(normalized);
      } catch (err) {
        console.error(err);
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
      if (!isMockSource) {
        await createAllergy(
          patientId,
          sourceId,
          departmentId,
          formValues,
          setLatestCurl
        );
      } else {
        const patientMock = ECW_MOCK_PATIENTS.find((p) => p.id === patientId);
        if (patientMock) {
          patientMock.allergies = patientMock.allergies || [];
          patientMock.allergies.push({
            code: formValues.allergy,
            reaction: formValues.reaction
              ? [
                  {
                    description: formValues.reaction,
                    severity: formValues.criticality,
                    onset: formValues.onsetDateTime,
                  },
                ]
              : [],
            clinicalStatus: formValues.status || "active",
            onsetDateTime: formValues.onsetDateTime,
            deactivatedDate: formValues.deactivatedDate,
            reactivatedDate: formValues.reactivatedDate,
            note: formValues.note,
            meta: { created: new Date().toISOString() },
          });
        }
      }

      toast.success("Allergy saved successfully");
      // ✅ Add to local events
if (setLocalEvents) {
  const newEvent = {
    id: `${Date.now()}`,
    eventType: "Allergy.save",
    createdTime: new Date().toISOString(),
    provider: "System", // or use providerName if available
    details: formValues.allergy || "Unknown Allergy",
  };
  setLocalEvents([newEvent, ...(localEvents || [])]);
}

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

      let updated = [];
      if (isMockSource) {
        const patientMock = ECW_MOCK_PATIENTS.find((p) => p.id === patientId);
        updated = (patientMock.allergies || []).map((a) => ({ resource: a }));
      } else {
        const fetched = await fetchAllergies(
          patientId,
          sourceId,
          departmentId,
          setLatestCurl
        );
        updated = fetched.entry || [];
      }

      const normalized = updated.map(normalizeAllergy).sort((a, b) => {
        const timeA = new Date(a.onsetDateTime || 0).getTime();
        const timeB = new Date(b.onsetDateTime || 0).getTime();
        return timeB - timeA;
      });
      setAllergies(normalized);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save allergy");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-indigo-700">Allergies</h2>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-all"
          onClick={() => setOpen(true)}
        >
          + Add Allergy
        </button>
      </div>

      {/* Add Allergy Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl w-[500px] max-h-[90vh] overflow-y-auto hide-scrollbar border border-indigo-100">
            <h2 className="text-lg font-semibold text-indigo-700 mb-4">
              Add Allergy
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Allergy */}
              <div>
                <label className="font-medium text-gray-700">Allergy</label>
                <select
                  name="allergy"
                  value={formValues.allergy}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  required
                >
                  <option value="">Select an allergy</option>
                  <option value="Penicillin">Carbamates</option>
                  <option value="Fish Containing Products">
                    Fish Containing Products
                  </option>
                  <option value="fish derived">Fish Derived</option>
                  <option value="fish oil">Fish Oil</option>
                  <option value="crayfish">Cray Fish</option>
                  <option value="shellfish derived">Shellfish Derived</option>
                </select>
              </div>

              <input type="hidden" name="code" value="12345" />

              {/* Category */}
              <div>
                <label className="font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={formValues.category}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                >
                  <option value="medication">Medication</option>
                  <option value="food">Food</option>
                  <option value="environment">Environment</option>
                  <option value="biologic">Biologic</option>
                </select>
              </div>

              {/* Criticality */}
              <div>
                <label className="font-medium text-gray-700">Criticality</label>
                <select
                  name="criticality"
                  value={formValues.criticality}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                >
                  <option value="">Select Criticality</option>
                  <option value="low">Low</option>
                  <option value="high">High</option>
                  <option value="unable-to-assess">Unable to assess</option>
                </select>
              </div>

              {/* Note */}
              <div>
                <label className="font-medium text-gray-700">Note</label>
                <input
                  name="note"
                  value={formValues.note}
                  onChange={handleChange}
                  placeholder="Note"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>

              {/* Onset Date */}
              <div>
                <label className="font-medium text-gray-700">Onset Date</label>
                <div className="flex gap-2">
                  <input
                    name="onsetDateTimeTemp"
                    type="datetime-local"
                    value={
                      formValues.onsetDateTimeTemp || formValues.onsetDateTime
                    }
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        onsetDateTimeTemp: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded-lg p-2 flex-1 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
                    onClick={() =>
                      setFormValues((prev) => ({
                        ...prev,
                        onsetDateTime: prev.onsetDateTimeTemp,
                      }))
                    }
                  >
                    OK
                  </button>
                </div>
              </div>

              {/* Deactivated Date */}
              <div>
                <label className="font-medium text-gray-700">
                  Deactivated Date
                </label>
                <div className="flex gap-2">
                  <input
                    name="deactivatedDateTemp"
                    type="datetime-local"
                    value={
                      formValues.deactivatedDateTemp ||
                      formValues.deactivatedDate
                    }
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        deactivatedDateTemp: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded-lg p-2 flex-1 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
                    onClick={() =>
                      setFormValues((prev) => ({
                        ...prev,
                        deactivatedDate: prev.deactivatedDateTemp,
                      }))
                    }
                  >
                    OK
                  </button>
                </div>
              </div>

              {/* Reactivated Date */}
              <div>
                <label className="font-medium text-gray-700">
                  Reactivated Date
                </label>
                <div className="flex gap-2">
                  <input
                    name="reactivatedDateTemp"
                    type="date"
                    value={
                      formValues.reactivatedDateTemp ||
                      formValues.reactivatedDate
                    }
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        reactivatedDateTemp: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded-lg p-2 flex-1 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
                    onClick={() =>
                      setFormValues((prev) => ({
                        ...prev,
                        reactivatedDate: prev.reactivatedDateTemp,
                      }))
                    }
                  >
                    OK
                  </button>
                </div>
              </div>

              {/* Submit + Cancel */}
              <button
                type="submit"
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition disabled:opacity-60"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
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
        <div className="space-y-4 overflow-y-auto hide-scrollbar max-h-[70vh]">
          {allergies.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-white/90 backdrop-blur-sm border border-indigo-100 rounded-xl shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-bold text-indigo-700 mb-2">
                Allergy: {item.code}
              </h3>
              <div className="mb-2">
                <h4 className="font-medium text-gray-700">Reactions:</h4>
                <ul className="list-disc list-inside text-sm text-gray-800">
                  {item.reaction.length > 0 ? (
                    item.reaction.map((r, i) => (
                      <li key={i}>
                        {r.description && (
                          <span className="font-semibold">
                            {r.description}
                          </span>
                        )}{" "}
                        — Severity: {r.severity}
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
                {item.clinicalStatus}
              </p>
              {item.meta?.created && (
                <p className="text-xs text-gray-400">
                  Created: {new Date(item.meta.created).toLocaleString()}
                </p>
              )}
              {item.onsetDateTime && (
                <p className="text-xs text-gray-400">
                  Onset Date: {new Date(item.onsetDateTime).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No allergies found.</p>
      )}
    </div>
  );
}
