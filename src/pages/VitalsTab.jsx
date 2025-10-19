
// import { useEffect, useState, useContext } from "react";
// import { fetchVitals, createVitals } from "../api/VitalsApi";
// import { AppContext } from "../layouts/DashboardLayout";
// import { Loader2 } from "lucide-react";
// import toast from "react-hot-toast";

// export default function VitalsTab({ patientId }) {
//   const { sourceId, departmentId, setLatestCurl } = useContext(AppContext);
//   const [vitals, setVitals] = useState([]);
//   const [loadingList, setLoadingList] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [open, setOpen] = useState(false);

//   const [formValues, setFormValues] = useState({
//     name: "Blood Pressure",
//     value: "",
//     unit: "mmHg",
//   });

//   useEffect(() => {
//     async function loadVitals() {
//       setLoadingList(true);
//       try {
//         const data = await fetchVitals(patientId, departmentId, sourceId, setLatestCurl);
//         const sorted = (data.entry || []).sort(
//           (a, b) => new Date(b.resource?.meta?.lastUpdated).getTime() - new Date(a.resource?.meta?.lastUpdated).getTime()
//         );
//         setVitals(sorted);
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load vitals");
//       } finally {
//         setLoadingList(false);
//       }
//     }
//     if (patientId && sourceId && departmentId) loadVitals();
//   }, [patientId, sourceId, departmentId, setLatestCurl]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formValues.name || !formValues.value) return toast.error("Name and value are required");

//     setSubmitting(true);
//     try {
//       await createVitals(patientId, departmentId, sourceId, formValues);
//       toast.success("Vital added successfully");
//       setOpen(false);
//       setFormValues({ name: "", value: "", unit: "mmHg" });

//       // refresh list
//       const updated = await fetchVitals(patientId, departmentId, sourceId, setLatestCurl);
//       const sorted = (updated.entry || []).sort(
//         (a, b) => new Date(b.resource?.meta?.lastUpdated).getTime() - new Date(a.resource?.meta?.lastUpdated).getTime()
//       );
//       setVitals(sorted);
    
//     }catch (err) {
//     console.error(err);
//     const status = err?.status || err?.response?.status || "Unknown";
//     const message = err?.message || "Failed to add vital";
//     toast.error(`${message}: Failed to add vitals`);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Vitals</h2>
//         {/* <button
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           onClick={() => setOpen(true)}
//         >
//           Add Vital
//         </button> */}
//       </div>

//       {open && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
//             <h2 className="text-lg font-semibold mb-4">Add Vital</h2>
//             <form onSubmit={handleSubmit} className="space-y-3">
//               <div>
//                 <label className="block mb-1">Vital Name</label>
//                 <input
//                   name="name"
//                   value={formValues.name}
//                   onChange={handleChange}
//                   placeholder="e.g. Blood Pressure"
//                   className="border p-2 w-full"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block mb-1">Value</label>
//                 <input
//                   type="number"
//                   name="value"
//                   value={formValues.value}
//                   onChange={handleChange}
//                   placeholder="e.g. 120"
//                   className="border p-2 w-full"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block mb-1">Unit</label>
//                 <input
//                   type="text"
//                   name="unit"
//                   value={formValues.unit}
//                   onChange={handleChange}
//                   className="border p-2 w-full"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 {submitting ? (
//                   <span className="flex items-center justify-center">
//                     <Loader2 className="h-5 w-5 animate-spin mr-2" />
//                     Saving...
//                   </span>
//                 ) : "Save"}
//               </button>

//               <button
//                 type="button"
//                 className="mt-2 w-full px-4 py-2 border rounded"
//                 onClick={() => setOpen(false)}
//               >
//                 Cancel
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {loadingList ? (
//         <div className="flex items-center justify-center py-6 text-gray-600">
//           <Loader2 className="h-6 w-6 animate-spin mr-2" />
//           Loading vitals...
//         </div>
//       ) : vitals.length > 0 ? (
//         <div className="space-y-2">
//           {vitals.map((item, idx) => {
//             const res = item.resource;
//             return (
//               <div key={idx} className="p-3 border rounded-lg bg-white shadow-sm">
//                 <p className="font-medium">{res?.code?.coding?.[0]?.display || "Vital"}</p>
//                 <p>{res?.valueQuantity?.value} {res?.valueQuantity?.unit}</p>
//                 {res?.meta?.lastUpdated && (
//                   <p className="text-xs text-gray-400">{new Date(res.meta.lastUpdated).toLocaleString()}</p>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       ) : <p className="text-gray-500">No vitals found.</p>}
//     </div>
//   );
// }
import { useEffect, useState, useContext } from "react"; 
import { fetchVitals as apiFetchVitals, createVitals } from "../api/VitalsApi";
import { AppContext } from "../layouts/DashboardLayout";
import { ECW_MOCK_PATIENTS } from "../data/patientListMock";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function VitalsTab({ patientId }) {
  const { sourceId, departmentId, setLatestCurl } = useContext(AppContext);
  const [vitals, setVitals] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    name: "Blood Pressure",
    value: "",
    unit: "mmHg",
  });

  useEffect(() => {
    async function loadVitals() {
      setLoadingList(true);
      try {
        let data = [];
        const isMockSource =
          sourceId !== import.meta.env.VITE_SOURCE_ID_ATHENA ;
          // &&
          // sourceId !== import.meta.env.VITE_SOURCE_ID_ELATION;

        if (isMockSource) {
          // Data patients
          const patientMock = ECW_MOCK_PATIENTS.find((p) => p.id === patientId);
          if (!patientMock) throw new Error("Patient not found in data data");
          data = (patientMock.vitals || []).map((v) => ({ resource: v }));
        } else {
          // Real EHR fetch
          const bundle = await apiFetchVitals(patientId, departmentId, sourceId, setLatestCurl);
          data = bundle?.entry || [];
        }

        const sorted = data.sort(
          (a, b) =>
            new Date(b.resource?.meta?.lastUpdated || 0) -
            new Date(a.resource?.meta?.lastUpdated || 0)
        );
        setVitals(sorted);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load vitals");
      } finally {
        setLoadingList(false);
      }
    }

    if (patientId && sourceId) loadVitals();
  }, [patientId, sourceId, departmentId, setLatestCurl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValues.name || !formValues.value) return toast.error("Name and value are required");

    setSubmitting(true);
    try {
      const isMockSource =
        sourceId !== import.meta.env.VITE_SOURCE_ID_ATHENA &&
        sourceId !== import.meta.env.VITE_SOURCE_ID_ELATION;

      if (!isMockSource) {
        await createVitals(patientId, departmentId, sourceId, formValues);
        toast.success("Vital added successfully");
      } else {
        // Add to data
        const patientMock = ECW_MOCK_PATIENTS.find((p) => p.id === patientId);
        if (patientMock) {
          patientMock.vitals = patientMock.vitals || [];
          patientMock.vitals.push({
            code: { coding: [{ display: formValues.name }] },
            valueQuantity: { value: formValues.value, unit: formValues.unit },
            meta: { lastUpdated: new Date().toISOString() },
          });
          toast.success("Vital added to data data");
        }
      }

      setOpen(false);
      setFormValues({ name: "", value: "", unit: "mmHg" });

      // Refresh vitals
      const updated = isMockSource
        ? ECW_MOCK_PATIENTS.find((p) => p.id === patientId).vitals.map((v) => ({ resource: v }))
        : (await apiFetchVitals(patientId, departmentId, sourceId, setLatestCurl))?.entry || [];

      const sorted = updated.sort(
        (a, b) =>
          new Date(b.resource?.meta?.lastUpdated || 0) -
          new Date(a.resource?.meta?.lastUpdated || 0)
      );
      setVitals(sorted);
    } catch (err) {
      console.error(err);
      const message = err?.message || "Failed to add vitals";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Vitals</h2>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Add Vital</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block mb-1">Vital Name</label>
                <input
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                  placeholder="e.g. Blood Pressure"
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Value</label>
                <input
                  type="number"
                  name="value"
                  value={formValues.value}
                  onChange={handleChange}
                  placeholder="e.g. 120"
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Unit</label>
                <input
                  type="text"
                  name="unit"
                  value={formValues.unit}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Saving...
                  </span>
                ) : "Save"}
              </button>

              <button
                type="button"
                className="mt-2 w-full px-4 py-2 border rounded"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {loadingList ? (
        <div className="flex items-center justify-center py-6 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading vitals...
        </div>
      ) : vitals.length > 0 ? (
        <div className="space-y-2">
          {vitals.map((item, idx) => {
            const res = item.resource;
            return (
              <div key={idx} className="p-3 border rounded-lg bg-white shadow-sm">
                <p className="font-medium">{res?.code?.coding?.[0]?.display || "Vital"}</p>
                <p>
                  {res?.valueQuantity?.value} {res?.valueQuantity?.unit}
                </p>
                {res?.meta?.lastUpdated && (
                  <p className="text-xs text-gray-400">
                    {new Date(res.meta.lastUpdated).toLocaleString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No vitals found.</p>
      )}
    </div>
  );
}
