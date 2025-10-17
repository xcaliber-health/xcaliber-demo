
// import { useEffect, useState, useContext } from "react";
// import { fetchFamilyHistory, createFamilyHistory } from "../api/FamilyHistoryApi";
// import { AppContext } from "../layouts/DashboardLayout";
// import { Loader2, Plus } from "lucide-react";
// import toast from "react-hot-toast";

// export default function FamilyHistoryTab({ patientId }) {
//   const { sourceId, departmentId, setLatestCurl } = useContext(AppContext);
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);

//   const [formValues, setFormValues] = useState({
//     relation: "",
//     condition: ""
//   });

//   const relationships = [
//     "Mother",
//     "Father",
//     "Brother",
//     "Sister",
//     "Son",
//     "Daughter",
//     "Maternal Grandmother",
//     "Maternal Grandfather",
//     "Paternal Grandmother",
//     "Paternal Grandfather",
//     "Maternal Aunt",
//     "Maternal Uncle",
//     "Paternal Aunt",
//     "Paternal Uncle",
//     "Unspecified Relation"
//   ];

//   useEffect(() => {
//   async function loadFamilyHistory() {
//     if (!patientId || !sourceId || !departmentId) return;

//     setLoading(true);
//     try {
//       const data = await fetchFamilyHistory(patientId, sourceId, departmentId, setLatestCurl);
//       const entries = data?.entry || [];

//       if (entries.length > 0) {
//         setHistory(entries);
//         toast.success(`Family history loaded successfully`);
//       } else {
//         setHistory([]);
//         toast.error("No family history found for this patient");
//       }

//     } catch (err) {
//       console.error("Error fetching family history:", err);
//       toast.error(`Failed to load family history: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }

//   loadFamilyHistory();
// }, [patientId, sourceId, departmentId, setLatestCurl]);


//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!patientId || !sourceId || !departmentId) return;

//     setLoading(true);
//     try {
//       await createFamilyHistory(patientId, sourceId, departmentId, formValues);
//       toast.success("Family history entry created successfully");
//       setFormValues({ relation: "", condition: "" });
//       setOpen(false);

//       const refreshed = await fetchFamilyHistory(patientId, sourceId, departmentId, setLatestCurl);
//       setHistory(refreshed.entry || []);
//     } catch (err) {
//       console.error("Error creating family history:", err);
//       toast.error("Failed to create family history");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Family History</h2>
//         <button
//           onClick={() => setOpen(true)}
//           className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
//         >
//           <Plus className="w-4 h-4" />
//           Add Family History
//         </button>
//       </div>

//       {/* Add Family History Modal */}
//       {open && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg max-h-[90vh] overflow-y-auto">
//             <h3 className="text-lg font-semibold mb-4">Add Family History</h3>
//             <form onSubmit={handleSubmit} className="space-y-3">
//               <div>
//                 <label className="block mb-1">Relation</label>
//                 <select
//                   name="relation"
//                   value={formValues.relation}
//                   onChange={handleChange}
//                   className="border p-2 rounded-lg w-full"
//                   required
//                 >
//                   <option value="">Select relation</option>
//                   {relationships.map((rel, i) => (
//                     <option key={i} value={rel}>
//                       {rel}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block mb-1">Condition</label>
//                 <input
//                   name="condition"
//                   type="text"
//                   value={formValues.condition}
//                   onChange={handleChange}
//                   placeholder="e.g. Diabetes"
//                   className="border p-2 rounded-lg w-full"
//                   required
//                 />
//               </div>

//               <div className="flex gap-2 mt-4">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//                 >
//                   {loading ? (
//                     <span className="flex justify-center items-center">
//                       <Loader2 className="animate-spin w-4 h-4 mr-2" />
//                       Saving...
//                     </span>
//                   ) : (
//                     "Save"
//                   )}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setOpen(false)}
//                   className="flex-1 border py-2 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Family History Table */}
//       {loading ? (
//         <div className="flex items-center justify-center py-8 text-gray-600">
//           <Loader2 className="animate-spin w-5 h-5 mr-2" />
//           Loading family history...
//         </div>
//       ) : history.length === 0 ? (
//         <p className="text-gray-500">No family history found.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full border border-gray-200 rounded-lg text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="text-left px-4 py-2 border-b">Relation</th>
//                 <th className="text-left px-4 py-2 border-b">Condition</th>
//               </tr>
//             </thead>
//             <tbody>
//               {history.map((e, i) => {
//                 const res = e.resource;
//                 const relation = res.relationship?.coding?.[0]?.display || "-";
//                 const conditions = res.condition
//                   ?.map((c) => c.code?.coding?.map((code) => code.display).filter(Boolean).join(", "))
//                   .filter(Boolean)
//                   .join("; ") || "-";
//                 return (
//                   <tr key={i} className="hover:bg-gray-50">
//                     <td className="px-4 py-2 border-b">{relation}</td>
//                     <td className="px-4 py-2 border-b">{conditions}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }



// import { useEffect, useState, useContext } from "react";
// import { Loader2, Plus } from "lucide-react";
// import toast from "react-hot-toast";
// import { AppContext } from "../layouts/DashboardLayout";
// import { fetchFamilyHistory, createFamilyHistory } from "../api/FamilyHistoryApi";
// import { ECW_MOCK_PATIENTS } from "../mocks/patientListMock";

// export default function FamilyHistoryTab({ patientId }) {
//   const { departmentId, sourceId, setLatestCurl } = useContext(AppContext);

//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [openForm, setOpenForm] = useState(false);
//   const [formData, setFormData] = useState({
//     relation: "",
//     condition: "",
//   });

//   const relationships = [
//     "Mother",
//     "Father",
//     "Brother",
//     "Sister",
//     "Son",
//     "Daughter",
//     "Maternal Grandmother",
//     "Maternal Grandfather",
//     "Paternal Grandmother",
//     "Paternal Grandfather",
//     "Maternal Aunt",
//     "Maternal Uncle",
//     "Paternal Aunt",
//     "Paternal Uncle",
//     "Unspecified Relation",
//   ];

//   // Detect data source
//   const isMockSource =
//     sourceId !== import.meta.env.VITE_SOURCE_ID_ATHENA &&
//     sourceId !== import.meta.env.VITE_SOURCE_ID_ELATION;

//   // ---------------- Load Family History ----------------
//   useEffect(() => {
//     const loadHistory = async () => {
//       if (!patientId || !departmentId || !sourceId) return;
//       setLoading(true);
//       try {
//         let data = [];

//         if (isMockSource) {
//           const patientMock = ECW_MOCK_PATIENTS.find((p) => p.id === patientId);
//           if (!patientMock) throw new Error("Patient not found in data data");
//           data = patientMock.familyHistory || [];
//         } else {
//           const resp = await fetchFamilyHistory(patientId, sourceId, departmentId, setLatestCurl);
//           data = resp?.entry || [];
//         }

//         setHistory(Array.isArray(data) ? data : []);
//         setError(null);
//         toast.success("Family history loaded successfully");
//       } catch (err) {
//         console.error(err);
//         setError(err.message || "Failed to load family history");
//         toast.error(`Failed to load family history: ${err.message || "Unknown error"}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadHistory();
//   }, [patientId, departmentId, sourceId, setLatestCurl]);

//   // ---------------- Handlers ----------------
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.relation || !formData.condition) {
//       toast.error("Please fill in all fields");
//       return;
//     }

//     setLoading(true);
//     try {
//       if (isMockSource) {
//         const patientMock = ECW_MOCK_PATIENTS.find((p) => p.id === patientId);
//         if (patientMock) {
//           patientMock.familyHistory = patientMock.familyHistory || [];
//           patientMock.familyHistory.push({ ...formData, id: `data-${Date.now()}` });
//         }
//       } else {
//         await createFamilyHistory(patientId, sourceId, departmentId, formData);
//       }

//       toast.success("Family history entry added successfully");
//       setFormData({ relation: "", condition: "" });
//       setOpenForm(false);

//       // Reload history
//       let updated = [];
//       if (isMockSource) {
//         const patientMock = ECW_MOCK_PATIENTS.find((p) => p.id === patientId);
//         updated = patientMock.familyHistory || [];
//       } else {
//         const resp = await fetchFamilyHistory(patientId, sourceId, departmentId, setLatestCurl);
//         updated = resp?.entry || [];
//       }

//       setHistory(Array.isArray(updated) ? updated : []);
//     } catch (err) {
//       console.error(err);
//       toast.error(`Failed to add family history: ${err.message || "Unknown error"}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------- Render ----------------
//   return (
//     <div className="space-y-4 p-4">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Family History</h2>
//         <button
//           onClick={() => setOpenForm(true)}
//           className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
//         >
//           <Plus className="w-4 h-4" />
//           Add Family History
//         </button>
//       </div>

//       {/* Add Family History Modal */}
//       {openForm && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg max-h-[90vh] overflow-y-auto">
//             <h3 className="text-lg font-semibold mb-4">Add Family History</h3>
//             <form onSubmit={handleSubmit} className="space-y-3">
//               <div>
//                 <label className="block mb-1 font-medium">Relation</label>
//                 <select
//                   name="relation"
//                   value={formData.relation}
//                   onChange={handleChange}
//                   required
//                   className="border p-2 rounded-lg w-full"
//                 >
//                   <option value="">Select relation</option>
//                   {relationships.map((rel) => (
//                     <option key={rel} value={rel}>
//                       {rel}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block mb-1 font-medium">Condition</label>
//                 <input
//                   type="text"
//                   name="condition"
//                   value={formData.condition}
//                   onChange={handleChange}
//                   placeholder="e.g. Diabetes"
//                   required
//                   className="border p-2 rounded-lg w-full"
//                 />
//               </div>

//               <div className="flex gap-2 mt-4">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//                 >
//                   {loading ? (
//                     <span className="flex justify-center items-center">
//                       <Loader2 className="animate-spin w-4 h-4 mr-2" />
//                       Saving...
//                     </span>
//                   ) : (
//                     "Save"
//                   )}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setOpenForm(false)}
//                   className="flex-1 border py-2 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Family History Table */}
//       {loading ? (
//         <div className="flex items-center justify-center py-12 text-gray-500">
//           <Loader2 className="h-6 w-6 animate-spin mr-2" />
//           Loading family history...
//         </div>
//       ) : error ? (
//         <p className="text-red-500 text-center py-6">{error}</p>
//       ) : history.length === 0 ? (
//         <p className="text-gray-500 text-center py-6">No family history found.</p>
//       ) : (
//         <table className="w-full border border-gray-300 shadow rounded-lg overflow-hidden text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               {["Relation", "Condition"].map((h) => (
//                 <th key={h} className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {history.map((h, i) => {
//               const row = h.resource || h; // normalize
//               const relation = row.relationship?.coding?.[0]?.display || row.relation || "-";
//               const condition = row.condition?.map((c) =>
//                 c.code?.coding?.map((code) => code.display).filter(Boolean).join(", ")
//               ).filter(Boolean).join("; ") || row.condition || "-";

//               return (
//                 <tr key={i} className="hover:bg-gray-50">
//                   <td className="border border-gray-300 px-3 py-2">{relation}</td>
//                   <td className="border border-gray-300 px-3 py-2">{condition}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
import { useEffect, useState, useContext } from "react";
import { Loader2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { AppContext } from "../layouts/DashboardLayout";
import { fetchFamilyHistory, createFamilyHistory } from "../api/FamilyHistoryApi";
import { ECW_MOCK_PATIENTS } from "../data/patientListMock";

export default function FamilyHistoryTab({ patientId }) {
  const { departmentId, sourceId, setLatestCurl } = useContext(AppContext);

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    relation: "",
    condition: "",
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
    "Unspecified Relation",
  ];

  // Detect data source
  const isMockSource =
    sourceId !== import.meta.env.VITE_SOURCE_ID_ATHENA &&
    sourceId !== import.meta.env.VITE_SOURCE_ID_ELATION;

  // ---------------- Load Family History ----------------
  useEffect(() => {
    const loadHistory = async () => {
      if (!patientId || !departmentId || !sourceId) return;
      setLoading(true);
      try {
        let data = [];

        if (isMockSource) {
          const patientMock = ECW_MOCK_PATIENTS.find((p) => p.id === patientId);
          if (!patientMock) throw new Error("Patient not found in data data");
          data = patientMock.familyHistory || [];
        } else {
          const resp = await fetchFamilyHistory(patientId, sourceId, departmentId, setLatestCurl);
          data = resp?.entry || [];
        }

        setHistory(Array.isArray(data) ? data : []);
        setError(null);
        toast.success("Family history loaded successfully");
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load family history");
        toast.error(`Failed to load family history: ${err.message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [patientId, departmentId, sourceId, setLatestCurl]);

  // ---------------- Handlers ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.relation || !formData.condition) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      if (isMockSource) {
        const patientMock = ECW_MOCK_PATIENTS.find((p) => p.id === patientId);
        if (patientMock) {
          patientMock.familyHistory = patientMock.familyHistory || [];
          // --- normalize data entry to FHIR-like structure ---
          const newEntry = {
            id: `data-${Date.now()}`,
            relationship: {
              coding: [{ display: formData.relation }],
            },
            condition: [
              {
                code: {
                  coding: [{ display: formData.condition }],
                },
              },
            ],
          };
          patientMock.familyHistory.push(newEntry);
        }
      } else {
        await createFamilyHistory(patientId, sourceId, departmentId, formData);
      }

      toast.success("Family history entry added successfully");
      setFormData({ relation: "", condition: "" });
      setOpenForm(false);

      // Reload history
      let updated = [];
      if (isMockSource) {
        const patientMock = ECW_MOCK_PATIENTS.find((p) => p.id === patientId);
        updated = patientMock.familyHistory || [];
      } else {
        const resp = await fetchFamilyHistory(patientId, sourceId, departmentId, setLatestCurl);
        updated = resp?.entry || [];
      }

      setHistory(Array.isArray(updated) ? updated : []);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to add family history: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Render ----------------
  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Family History</h2>
        <button
          onClick={() => setOpenForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Family History
        </button>
      </div>

      {/* Add Family History Modal */}
      {openForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add Family History</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block mb-1 font-medium">Relation</label>
                <select
                  name="relation"
                  value={formData.relation}
                  onChange={handleChange}
                  required
                  className="border p-2 rounded-lg w-full"
                >
                  <option value="">Select relation</option>
                  {relationships.map((rel) => (
                    <option key={rel} value={rel}>
                      {rel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Condition</label>
                <input
                  type="text"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  placeholder="e.g. Diabetes"
                  required
                  className="border p-2 rounded-lg w-full"
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
                  onClick={() => setOpenForm(false)}
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
        <div className="flex items-center justify-center py-12 text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading family history...
        </div>
      ) : error ? (
        <p className="text-red-500 text-center py-6">{error}</p>
      ) : history.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No family history found.</p>
      ) : (
        <table className="w-full border border-gray-300 shadow rounded-lg overflow-hidden text-sm">
          <thead className="bg-gray-100">
            <tr>
              {["Relation", "Condition"].map((h) => (
                <th
                  key={h}
                  className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => {
              const row = h.resource || h;

              const relation =
                row.relationship?.coding?.[0]?.display || row.relation || "-";

              // --- robust condition display ---
              let condition = "-";
              if (Array.isArray(row.condition)) {
                condition = row.condition
                  .map((c) => {
                    if (typeof c === "string") return c;
                    return (
                      c.code?.coding
                        ?.map((code) => code.display)
                        .filter(Boolean)
                        .join(", ") || "-"
                    );
                  })
                  .filter(Boolean)
                  .join("; ");
              } else if (typeof row.condition === "string") {
                condition = row.condition;
              } else if (row.condition?.code?.coding) {
                condition = row.condition.code.coding
                  .map((code) => code.display)
                  .filter(Boolean)
                  .join(", ");
              }

              return (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2">{relation}</td>
                  <td className="border border-gray-300 px-3 py-2">{condition}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
