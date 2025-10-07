
// // src/pages/AllergiesTab.jsx
// import { useEffect, useState, useContext } from "react";
// import { fetchAllergies, createAllergy } from "../api/AllergiesApi";
// import { AppContext } from "../layouts/DashboardLayout";
// import { Loader2, Plus } from "lucide-react";
// import toast from "react-hot-toast";

// export default function AllergiesTab({ patientId }) {
//   const { sourceId, departmentId } = useContext(AppContext);
//   const [allergies, setAllergies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [values, setValues] = useState({
//     allergy: "",
//     code: "",
//     system: "athena",
//     category: "medication",
//     criticality: "",
//     note: "",
//     onsetDateTime: "",
//     reaction: "",
//     deactivatedDate: "",
//     reactivatedDate: "",
//   });

//   // ✅ Fetch all allergies
//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       try {
//         const res = await fetchAllergies(patientId, sourceId, departmentId);
//         setAllergies(res?.entry || []);
//       } catch (err) {
//         toast.error("Failed to load allergies");
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [patientId, sourceId, departmentId]);

//   // ✅ Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setValues((prev) => ({ ...prev, [name]: value }));
//   };

//   // ✅ Submit new allergy
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       await createAllergy(patientId, sourceId, departmentId, values);
//       toast.success("Allergy created successfully!");
//       setValues({
//         allergy: "",
//         code: "",
//         system: "athena",
//         category: "medication",
//         criticality: "",
//         note: "",
//         onsetDateTime: "",
//         reaction: "",
//         deactivatedDate: "",
//         reactivatedDate: "",
//       });
//       const res = await fetchAllergies(patientId, sourceId, departmentId);
//       setAllergies(res?.entry || []);
//     } catch (err) {
//       toast.error("Failed to create allergy");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="flex flex-col gap-4 p-4">
//       {/* ✅ Allergy List */}
//       <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-4 max-h-[400px] overflow-y-auto">
//         <h2 className="text-xl font-semibold mb-3">Allergies</h2>
//         {loading ? (
//           <div className="flex items-center justify-center py-6 text-gray-500">
//             <Loader2 className="animate-spin w-5 h-5 mr-2" /> Loading allergies...
//           </div>
//         ) : allergies.length > 0 ? (
//           <ul className="space-y-3">
//             {allergies.map((entry, i) => {
//               const a = entry.resource;
//               return (
//                 <li
//                   key={i}
//                   className="p-3 rounded-2xl bg-gray-50 border border-gray-200"
//                 >
//                   <p className="font-medium text-gray-800">
//                     {a?.code?.coding?.[0]?.display || "Unknown Allergy"}
//                   </p>
//                   {a?.criticality && (
//                     <p className="text-sm text-gray-600">
//                       Criticality: {a.criticality}
//                     </p>
//                   )}
//                   {a?.note?.[0]?.text && (
//                     <p className="text-sm text-gray-600">
//                       Note: {a.note[0].text}
//                     </p>
//                   )}
//                 </li>
//               );
//             })}
//           </ul>
//         ) : (
//           <p className="text-gray-500 text-sm">No allergies found.</p>
//         )}
//       </div>

//       {/* ✅ Create Allergy Form */}
//       <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
//         <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//           <Plus className="w-5 h-5" /> Add New Allergy
//         </h2>
//         <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
//           <input name="allergy" value={values.allergy} onChange={handleChange} placeholder="Allergy (e.g. Penicillin)" className="border rounded-xl p-2" required />
//           <input name="code" value={values.code} onChange={handleChange} placeholder="Code" className="border rounded-xl p-2" required />
//           <input name="system" value={values.system} onChange={handleChange} placeholder="System (e.g. athena)" className="border rounded-xl p-2" />
//           <select name="category" value={values.category} onChange={handleChange} className="border rounded-xl p-2">
//             <option value="medication">Medication</option>
//             <option value="food">Food</option>
//             <option value="environment">Environment</option>
//             <option value="biologic">Biologic</option>
//           </select>
//           <select name="criticality" value={values.criticality} onChange={handleChange} className="border rounded-xl p-2">
//             <option value="">Select Criticality</option>
//             <option value="low">Low</option>
//             <option value="high">High</option>
//             <option value="unable-to-assess">Unable to assess</option>
//           </select>
//           <input name="reaction" value={values.reaction} onChange={handleChange} placeholder="Reaction (e.g. rash, nausea)" className="border rounded-xl p-2" />
//           <input name="onsetDateTime" type="datetime-local" value={values.onsetDateTime} onChange={handleChange} className="border rounded-xl p-2" />
//           <input name="note" value={values.note} onChange={handleChange} placeholder="Note" className="border rounded-xl p-2" />
//           <input name="deactivatedDate" type="datetime-local" value={values.deactivatedDate} onChange={handleChange} className="border rounded-xl p-2" />
//           <input name="reactivatedDate" type="date" value={values.reactivatedDate} onChange={handleChange} className="border rounded-xl p-2" />

//           <button
//             type="submit"
//             disabled={saving}
//             className="col-span-2 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition flex justify-center items-center"
//           >
//             {saving ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
//             {saving ? "Saving..." : "Create Allergy"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
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
        const data = await fetchAllergies(patientId, sourceId, departmentId);

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

      {/* Add Allergy Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[500px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Add Allergy</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="allergy"
                value={formValues.allergy}
                onChange={handleChange}
                placeholder="Allergy"
                className="border rounded-lg p-2 w-full"
                required
              />
              <input
                name="code"
                value={formValues.code}
                onChange={handleChange}
                placeholder="Code"
                className="border rounded-lg p-2 w-full"
                required
              />
              <input
                name="system"
                value={formValues.system}
                onChange={handleChange}
                placeholder="System"
                className="border rounded-lg p-2 w-full"
              />
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
              <input
                name="reaction"
                value={formValues.reaction}
                onChange={handleChange}
                placeholder="Reaction"
                className="border rounded-lg p-2 w-full"
              />
              <input
                name="onsetDateTime"
                type="datetime-local"
                value={formValues.onsetDateTime}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
              />
              <input
                name="note"
                value={formValues.note}
                onChange={handleChange}
                placeholder="Note"
                className="border rounded-lg p-2 w-full"
              />
              <input
                name="deactivatedDate"
                type="datetime-local"
                value={formValues.deactivatedDate}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
              />
              <input
                name="reactivatedDate"
                type="date"
                value={formValues.reactivatedDate}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
              />
              <input
                name="status"
                value={formValues.status}
                onChange={handleChange}
                placeholder="Status"
                className="border rounded-lg p-2 w-full"
              />

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
