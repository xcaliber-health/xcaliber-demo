
// import { useEffect, useState, useContext } from "react";
// import { Loader2, Plus } from "lucide-react";
// import toast from "react-hot-toast";
// import { AppContext } from "../layouts/DashboardLayout";
// import {
//   fetchConditions,
//   mapConditionRow,
//   createCondition,
//   conditionMapping,
//   clinicalStatusOptions,
// } from "../api/conditionsApi";

// export default function ConditionsTab({ patientId }) {
//   const { departmentId, sourceId, setLatestCurl } = useContext(AppContext);
//   const [conditions, setConditions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [openForm, setOpenForm] = useState(false);
//   const [formData, setFormData] = useState({
//     conditionName: "",
//     clinicalStatus: "active",
//     onsetDate: "",
//     note: "",
//     category: "problem-list-item",
//   });

//   const conditionOptions = Object.keys(conditionMapping);

//   // ---------------- Load Conditions ----------------
//   useEffect(() => {
//     const loadConditions = async () => {
//       setLoading(true);
//       try {
//         const data = await fetchConditions(patientId, departmentId, sourceId, setLatestCurl);
//         setConditions(data);
//         setError(null);
//         toast.success("Conditions loaded successfully");
//       } catch (err) {
//         console.error(err);
//         setError(err.message || "Failed to load conditions");
//         toast.error(`Failed to load conditions: ${err.message || "Unknown error"}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (patientId && sourceId && departmentId) loadConditions();
//   }, [patientId, departmentId, sourceId, setLatestCurl]);

//   // ---------------- Handlers ----------------
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.conditionName) {
//       toast.error("Please select a condition");
//       return;
//     }

//     setLoading(true);
//     try {
//       await createCondition(formData, patientId, departmentId, sourceId, setLatestCurl);
//       toast.success("Condition added successfully");

//       setFormData({
//         conditionName: "",
//         clinicalStatus: "active",
//         onsetDate: "",
//         note: "",
//         category: "problem-list-item",
//       });
//       setOpenForm(false);

//       // Reload conditions
//       const data = await fetchConditions(patientId, departmentId, sourceId, setLatestCurl);
//       setConditions(data);
//     } catch (err) {
//       console.error(err);
//       toast.error(`Failed to add condition: ${err.message || "Unknown error"}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------- Render ----------------
//   return (
//     <div className="space-y-4">
//       {/* <button
//         onClick={() => setOpenForm(true)}
//         className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
//       >
//         <Plus className="w-4 h-4" />
//         Add Condition
//       </button> */}

//       {openForm && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg max-h-[90vh] overflow-y-auto">
//             <h3 className="text-lg font-semibold mb-4">Add Condition</h3>
//             <form onSubmit={handleSubmit} className="space-y-3">
//               <div>
//                 <label className="block mb-1 font-medium">Condition Name</label>
//                 <select
//                   name="conditionName"
//                   value={formData.conditionName}
//                   onChange={handleChange}
//                   required
//                   className="border p-2 rounded-lg w-full"
//                 >
//                   <option value="">Select a condition</option>
//                   {conditionOptions.map((cond) => (
//                     <option key={cond} value={cond}>
//                       {cond}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block mb-1 font-medium">Clinical Status</label>
//                 <select
//                   name="clinicalStatus"
//                   value={formData.clinicalStatus}
//                   onChange={handleChange}
//                   className="border p-2 rounded-lg w-full"
//                 >
//                   {clinicalStatusOptions.map((status) => (
//                     <option key={status} value={status}>
//                       {status.charAt(0).toUpperCase() + status.slice(1)}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block mb-1 font-medium">Onset Date</label>
//                 <input
//                   type="date"
//                   name="onsetDate"
//                   value={formData.onsetDate}
//                   onChange={handleChange}
//                   className="border p-2 rounded-lg w-full"
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1 font-medium">Notes</label>
//                 <textarea
//                   name="note"
//                   value={formData.note}
//                   onChange={handleChange}
//                   placeholder="Add any notes"
//                   className="border p-2 rounded-lg w-full"
//                   rows={3}
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

//       {loading ? (
//         <div className="flex items-center justify-center py-12 text-gray-500">
//           <Loader2 className="h-6 w-6 animate-spin mr-2" />
//           Loading conditions...
//         </div>
//       ) : error ? (
//         <p className="text-red-500 text-center py-6">{error}</p>
//       ) : conditions.length === 0 ? (
//         <p className="text-gray-500 text-center py-6">No conditions found.</p>
//       ) : (
//         <table className="w-full border border-gray-300 shadow rounded-lg overflow-hidden text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               {["Condition", "Clinical Status", "Onset"].map((h, i) => (
//                 <th
//                   key={i}
//                   className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700"
//                 >
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {conditions.map((c, i) => (
//               <tr key={i} className="hover:bg-gray-50">
//                 {mapConditionRow(c).map((cell, j) => (
//                   <td key={j} className="border border-gray-300 px-3 py-2">
//                     {cell || "-"}
//                   </td>
//                 ))}
//               </tr>
//             ))}
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
import {
  fetchConditions,
  mapConditionRow,
  createCondition,
  conditionMapping,
  clinicalStatusOptions,
} from "../api/conditionsApi";
import { ECW_MOCK_PATIENTS } from "../data/patientListMock";

export default function ConditionsTab({ patientId }) {
  const { departmentId, sourceId, setLatestCurl } = useContext(AppContext);
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    conditionName: "",
    clinicalStatus: "active",
    onsetDate: "",
    note: "",
    category: "problem-list-item",
  });

  const conditionOptions = Object.keys(conditionMapping);

  // Detect data source
  const isMockSource =
    sourceId !== import.meta.env.VITE_SOURCE_ID_ATHENA ;
    // &&
    // sourceId !== import.meta.env.VITE_SOURCE_ID_ELATION;

  // ---------------- Load Conditions ----------------
  useEffect(() => {
    const loadConditions = async () => {
      setLoading(true);
      try {
        let data = [];

        if (isMockSource) {
          // Fetch from data patients
          const patientMock = ECW_MOCK_PATIENTS.find((p) => p.id === patientId);
          if (!patientMock) throw new Error("Patient not found in data data");
          data = patientMock.conditions || [];
        } else {
          data = await fetchConditions(patientId, departmentId, sourceId, setLatestCurl);
        }

        setConditions(data);
        setError(null);
        toast.success("Conditions loaded successfully");
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load conditions");
        toast.error(`Failed to load conditions: ${err.message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };

    if (patientId && sourceId && departmentId) loadConditions();
  }, [patientId, departmentId, sourceId, setLatestCurl]);

  // ---------------- Handlers ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.conditionName) {
      toast.error("Please select a condition");
      return;
    }

    setLoading(true);
    try {
      if (!isMockSource) {
        await createCondition(formData, patientId, departmentId, sourceId, setLatestCurl);
      } else {
        // Add to data patient
        const patientMock = ECW_MOCK_PATIENTS.find((p) => p.id === patientId);
        if (patientMock) {
          patientMock.conditions = patientMock.conditions || [];
          patientMock.conditions.push({ ...formData, id: `data-${Date.now()}` });
        }
      }

      toast.success("Condition added successfully");
      setFormData({
        conditionName: "",
        clinicalStatus: "active",
        onsetDate: "",
        note: "",
        category: "problem-list-item",
      });
      setOpenForm(false);

      // Reload conditions
      let updated = [];
      if (isMockSource) {
        const patientMock = ECW_MOCK_PATIENTS.find((p) => p.id === patientId);
        updated = patientMock.conditions || [];
      } else {
        updated = await fetchConditions(patientId, departmentId, sourceId, setLatestCurl);
      }
      setConditions(updated);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to add condition: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Render ----------------
  return (
    <div className="space-y-4">
      {/* <button
        onClick={() => setOpenForm(true)}
        className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
      >
        <Plus className="w-4 h-4" />
        Add Condition
      </button> */}

      {openForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add Condition</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block mb-1 font-medium">Condition Name</label>
                <select
                  name="conditionName"
                  value={formData.conditionName}
                  onChange={handleChange}
                  required
                  className="border p-2 rounded-lg w-full"
                >
                  <option value="">Select a condition</option>
                  {conditionOptions.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Clinical Status</label>
                <select
                  name="clinicalStatus"
                  value={formData.clinicalStatus}
                  onChange={handleChange}
                  className="border p-2 rounded-lg w-full"
                >
                  {clinicalStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Onset Date</label>
                <input
                  type="date"
                  name="onsetDate"
                  value={formData.onsetDate}
                  onChange={handleChange}
                  className="border p-2 rounded-lg w-full"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Notes</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Add any notes"
                  className="border p-2 rounded-lg w-full"
                  rows={3}
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

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading conditions...
        </div>
      ) : error ? (
        <p className="text-red-500 text-center py-6">{error}</p>
      ) : conditions.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No conditions found.</p>
      ) : (
        <table className="w-full border border-gray-300 shadow rounded-lg overflow-hidden text-sm">
          <thead className="bg-gray-100">
            <tr>
              {["Condition", "Clinical Status", "Onset"].map((h, i) => (
                <th
                  key={i}
                  className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {conditions.map((c, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {mapConditionRow(c).map((cell, j) => (
                  <td key={j} className="border border-gray-300 px-3 py-2">
                    {cell || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
