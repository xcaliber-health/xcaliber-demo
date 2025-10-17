
// import { useEffect, useState, useContext } from "react";
// import { fetchEncounters, createEncounter } from "../api/EncountersApi";
// import { AppContext } from "../layouts/DashboardLayout";
// import { Loader2, Plus } from "lucide-react";
// import toast from "react-hot-toast";

// const CLASS_OPTIONS = [
//   { label: "Ambulatory", code: "AMB", system: "http://terminology.hl7.org/CodeSystem/v3-ActCode" },
  
// ];

// const CATEGORY_OPTIONS = [
//   { label: "Order", value: "order" },
  
// ];

// export default function EncountersTab({ patientId }) {
//   const { sourceId, departmentId, setLatestCurl } = useContext(AppContext);
//   const [encounters, setEncounters] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);

//   const [formValues, setFormValues] = useState({
//     type: "",
//     status: "in-progress",
//     start: "",
//     end: "",
//     providerFirstName: "",
//     providerLastName: "",
//     classOption: CLASS_OPTIONS[0].label,
//     categoryOption: CATEGORY_OPTIONS[0].value
//   });

//   // Fetch encounters
//   useEffect(() => {
//   async function loadEncounters() {
//     try {
//       const data = await fetchEncounters(patientId, sourceId, departmentId, setLatestCurl);

//       const entries = data?.entry || [];

//       if (entries.length > 0) {
//         setEncounters(entries);
//         toast.success(`Encounters loaded successfully `);
//       } else {
//         setEncounters([]);
//         toast.error("No encounters found for this patient");
//       }

//       if (data.error) {
//         console.warn("Encounter fetch warning:", data.error);
//       }
//     } catch (err) {
//       console.error("Error fetching encounters:", err);
//       toast.error(`Failed to load encounters: ${err.message}`);
//     }
//   }

//   loadEncounters();
// }, [patientId, sourceId, departmentId, setLatestCurl]);


//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues((prev) => ({ ...prev, [name]: value }));
//   };

//   // Submit new encounter
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!patientId || !sourceId || !departmentId) return;

//     setLoading(true);
//     try {
//       await createEncounter(patientId, sourceId, departmentId, formValues);
//       toast.success("Encounter created successfully");
//       setFormValues({
//         type: "",
//         status: "in-progress",
//         start: "",
//         end: "",
//         providerFirstName: "",
//         providerLastName: "",
//         classOption: CLASS_OPTIONS[0].label,
//         categoryOption: CATEGORY_OPTIONS[0].value
//       });
//       setOpen(false);

//       const refreshed = await fetchEncounters(patientId, sourceId, departmentId, setLatestCurl);
//       setEncounters(refreshed.entry || []);
//     } catch (err) {
//       console.error("Error creating encounter:", err);
//       toast.error("Failed to create encounter");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Encounters</h2>
//         <button
//           onClick={() => setOpen(true)}
//           className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
//         >
//           <Plus className="w-4 h-4" />
//           Add Encounter
//         </button>
//       </div>

//       {/* Add Encounter Modal */}
//       {open && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg max-h-[90vh] overflow-y-auto">
//             <h3 className="text-lg font-semibold mb-4">Add Encounter</h3>
//             <form onSubmit={handleSubmit} className="space-y-3">
//               <div>
//                 <label className="block mb-1">Encounter Type</label>
//                 <input
//                   name="type"
//                   type="text"
//                   value={formValues.type}
//                   onChange={handleChange}
//                   placeholder="e.g. Consultation"
//                   className="border p-2 rounded-lg w-full"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1">Status</label>
//                 <select
//                   name="status"
//                   value={formValues.status}
//                   onChange={handleChange}
//                   className="border p-2 rounded-lg w-full"
//                 >
//                   <option value="in-progress">In Progress</option>
//                   <option value="finished">Finished</option>
//                   <option value="planned">Planned</option>
//                 </select>
//               </div>

//               {/* <div>
//                 <label className="block mb-1">Start Time</label>
//                 <input
//                   name="start"
//                   type="datetime-local"
//                   value={formValues.start}
//                   onChange={handleChange}
//                   className="border p-2 rounded-lg w-full"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1">End Time</label>
//                 <input
//                   name="end"
//                   type="datetime-local"
//                   value={formValues.end}
//                   onChange={handleChange}
//                   className="border p-2 rounded-lg w-full"
//                 />
//               </div> */}
//               {/* Start Time */}
// <label className="block mb-1">Start Time</label>
// <div className="flex gap-2">
//   <input
//     type="datetime-local"
//     value={formValues.startTemp || formValues.start}
//     onChange={(e) =>
//       setFormValues((prev) => ({ ...prev, startTemp: e.target.value }))
//     }
//     className="border p-2 rounded-lg flex-1"
//     required
//   />
//   <button
//     type="button"
//     className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
//     onClick={() => {
//       setFormValues((prev) => ({
//         ...prev,
//         start: prev.startTemp,
//       }));
//     }}
//   >
//     OK
//   </button>
// </div>

// {/* End Time */}
// <label className="block mb-1">End Time</label>
// <div className="flex gap-2">
//   <input
//     type="datetime-local"
//     value={formValues.endTemp || formValues.end}
//     onChange={(e) =>
//       setFormValues((prev) => ({ ...prev, endTemp: e.target.value }))
//     }
//     className="border p-2 rounded-lg flex-1"
//   />
//   <button
//     type="button"
//     className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
//     onClick={() => {
//       setFormValues((prev) => ({
//         ...prev,
//         end: prev.endTemp,
//       }));
//     }}
//   >
//     OK
//   </button>
// </div>


//               <div>
//                 <label className="block mb-1">Provider First Name</label>
//                 <input
//                   name="providerFirstName"
//                   type="text"
//                   value={formValues.providerFirstName}
//                   onChange={handleChange}
//                   className="border p-2 rounded-lg w-full"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1">Provider Last Name</label>
//                 <input
//                   name="providerLastName"
//                   type="text"
//                   value={formValues.providerLastName}
//                   onChange={handleChange}
//                   className="border p-2 rounded-lg w-full"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1">Encounter Class</label>
//                 <select
//                   name="classOption"
//                   value={formValues.classOption}
//                   onChange={handleChange}
//                   className="border p-2 rounded-lg w-full"
//                   required
//                 >
//                   {CLASS_OPTIONS.map((opt) => (
//                     <option key={opt.code} value={opt.label}>{opt.label}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block mb-1">Encounter Category</label>
//                 <select
//                   name="categoryOption"
//                   value={formValues.categoryOption}
//                   onChange={handleChange}
//                   className="border p-2 rounded-lg w-full"
//                   required
//                 >
//                   {CATEGORY_OPTIONS.map((opt) => (
//                     <option key={opt.value} value={opt.value}>{opt.label}</option>
//                   ))}
//                 </select>
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

//       {/* Encounters Table */}
//       {loading ? (
//         <div className="flex items-center justify-center py-8 text-gray-600">
//           <Loader2 className="animate-spin w-5 h-5 mr-2" />
//           Loading encounters...
//         </div>
//       ) : encounters.length === 0 ? (
//         <p className="text-gray-500">No encounters found.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full border border-gray-200 rounded-lg text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="text-left px-4 py-2 border-b">Type</th>
//                 <th className="text-left px-4 py-2 border-b">Status</th>
//                 <th className="text-left px-4 py-2 border-b">Start</th>
//                 <th className="text-left px-4 py-2 border-b">End</th>
//                 <th className="text-left px-4 py-2 border-b">Practitioner</th>
//               </tr>
//             </thead>
//             <tbody>
//               {encounters.map((e, i) => {
//                 const res = e.resource;
//                 const start = res.period?.start
//                   ? new Date(res.period.start).toLocaleString()
//                   : "-";
//                 const end = res.period?.end
//                   ? new Date(res.period.end).toLocaleString()
//                   : "-";
//                 const first = res.extension?.find(
//                   (ext) =>
//                     ext.url ===
//                     "http://xcaliber-fhir/structureDefinition/provider-first-name"
//                 )?.valueString;
//                 const last = res.extension?.find(
//                   (ext) =>
//                     ext.url ===
//                     "http://xcaliber-fhir/structureDefinition/provider-last-name"
//                 )?.valueString;

//                 return (
//                   <tr key={i} className="hover:bg-gray-50">
//                     <td className="px-4 py-2 border-b">{res.class?.display || "—"}</td>
//                     <td className="px-4 py-2 border-b capitalize">{res.status || "—"}</td>
//                     <td className="px-4 py-2 border-b">{start}</td>
//                     <td className="px-4 py-2 border-b">{end}</td>
//                     <td className="px-4 py-2 border-b">
//                       {[first, last].filter(Boolean).join(" ") || "—"}
//                     </td>
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



import { useEffect, useState, useContext } from "react";
import { fetchEncounters, createEncounter } from "../api/EncountersApi";
import { AppContext } from "../layouts/DashboardLayout";
import { Loader2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { ECW_MOCK_PATIENTS } from "../data/patientListMock";

const CLASS_OPTIONS = [
  { label: "Ambulatory", code: "AMB", system: "http://terminology.hl7.org/CodeSystem/v3-ActCode" },
];

const CATEGORY_OPTIONS = [
  { label: "Order", value: "order" },
];

export default function EncountersTab({ patientId }) {
  const { sourceId, departmentId, setLatestCurl } = useContext(AppContext);

  const [encounters, setEncounters] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    type: "",
    status: "in-progress",
    start: "",
    end: "",
    startTemp: "",
    endTemp: "",
    providerFirstName: "",
    providerLastName: "",
    classOption: CLASS_OPTIONS[0].label,
    categoryOption: CATEGORY_OPTIONS[0].value,
  });

  // Detect data source
  const isMockSource =
    sourceId !== import.meta.env.VITE_SOURCE_ID_ATHENA &&
    sourceId !== import.meta.env.VITE_SOURCE_ID_ELATION;

  // --- Normalize encounter ---
  const normalizeEncounter = (e) => {
    const res = e.resource || e;
    const start = res.period?.start || "";
    const end = res.period?.end || "";
    const first = res.extension?.find(
      (ext) => ext.url === "http://xcaliber-fhir/structureDefinition/provider-first-name"
    )?.valueString;
    const last = res.extension?.find(
      (ext) => ext.url === "http://xcaliber-fhir/structureDefinition/provider-last-name"
    )?.valueString;

    return {
      classDisplay: res.class?.display || res.class || "—",
      status: res.status || "—",
      start,
      end,
      practitioner: [first, last].filter(Boolean).join(" ") || "—",
      resource: res,
    };
  };

  // --- Load encounters ---
  useEffect(() => {
    const loadEncounters = async () => {
      setLoadingList(true);
      try {
        let data = [];
        if (isMockSource) {
          const patientMock = ECW_MOCK_PATIENTS.find((p) => p.id === patientId);
          if (!patientMock) throw new Error("Patient not found in data data");
          data = (patientMock.encounters || []).map((e) => ({ resource: e }));
        } else {
          const fetched = await fetchEncounters(patientId, sourceId, departmentId, setLatestCurl);
          data = fetched.entry || [];
        }

        const normalized = data.map(normalizeEncounter);
        setEncounters(normalized);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load encounters");
      } finally {
        setLoadingList(false);
      }
    };

    if (patientId && sourceId && departmentId) loadEncounters();
  }, [patientId, sourceId, departmentId, setLatestCurl]);

  // --- Form handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const body = {
      type: formValues.type,
      status: formValues.status,
      period: { start: formValues.start, end: formValues.end },
      class: { display: formValues.classOption },
      category: [{ coding: [{ code: formValues.categoryOption }] }],
      extension: [
        { url: "http://xcaliber-fhir/structureDefinition/provider-first-name", valueString: formValues.providerFirstName },
        { url: "http://xcaliber-fhir/structureDefinition/provider-last-name", valueString: formValues.providerLastName },
      ],
    };

    try {
      if (!isMockSource) {
        await createEncounter(patientId, sourceId, departmentId, body, setLatestCurl);
      } else {
        const patientMock = ECW_MOCK_PATIENTS.find((p) => p.id === patientId);
        if (patientMock) {
          patientMock.encounters = patientMock.encounters || [];
          patientMock.encounters.push({ ...body, id: `data-${Date.now()}` });
        }
      }

      toast.success("Encounter saved successfully");
      setOpen(false);
      setFormValues({
        type: "",
        status: "in-progress",
        start: "",
        end: "",
        startTemp: "",
        endTemp: "",
        providerFirstName: "",
        providerLastName: "",
        classOption: CLASS_OPTIONS[0].label,
        categoryOption: CATEGORY_OPTIONS[0].value,
      });

      // Reload encounters
      let updated = [];
      if (isMockSource) {
        const patientMock = ECW_MOCK_PATIENTS.find((p) => p.id === patientId);
        updated = (patientMock.encounters || []).map((e) => ({ resource: e }));
      } else {
        const fetched = await fetchEncounters(patientId, sourceId, departmentId, setLatestCurl);
        updated = fetched.entry || [];
      }
      setEncounters(updated.map(normalizeEncounter));
    } catch (err) {
      console.error(err);
      toast.error("Failed to save encounter");
    } finally {
      setSubmitting(false);
    }
  };
  


  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Encounters</h2>
        {/* <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Encounter
        </button> */}
      </div>

      {/* Add Encounter Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add Encounter</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block mb-1">Encounter Type</label>
                <input
                  name="type"
                  type="text"
                  value={formValues.type}
                  onChange={handleChange}
                  placeholder="e.g. Consultation"
                  className="border p-2 rounded-lg w-full"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Status</label>
                <select
                  name="status"
                  value={formValues.status}
                  onChange={handleChange}
                  className="border p-2 rounded-lg w-full"
                >
                  <option value="in-progress">In Progress</option>
                  <option value="finished">Finished</option>
                  <option value="planned">Planned</option>
                </select>
              </div>

              {/* Start Time */}
              <label className="block mb-1">Start Time</label>
              <div className="flex gap-2">
                <input
                  type="datetime-local"
                  value={formValues.startTemp || formValues.start}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, startTemp: e.target.value }))}
                  className="border p-2 rounded-lg flex-1"
                  required
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  onClick={() => setFormValues((prev) => ({ ...prev, start: prev.startTemp }))}
                >
                  OK
                </button>
              </div>

              {/* End Time */}
              <label className="block mb-1">End Time</label>
              <div className="flex gap-2">
                <input
                  type="datetime-local"
                  value={formValues.endTemp || formValues.end}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, endTemp: e.target.value }))}
                  className="border p-2 rounded-lg flex-1"
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  onClick={() => setFormValues((prev) => ({ ...prev, end: prev.endTemp }))}
                >
                  OK
                </button>
              </div>

              <div>
                <label className="block mb-1">Provider First Name</label>
                <input
                  name="providerFirstName"
                  type="text"
                  value={formValues.providerFirstName}
                  onChange={handleChange}
                  className="border p-2 rounded-lg w-full"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Provider Last Name</label>
                <input
                  name="providerLastName"
                  type="text"
                  value={formValues.providerLastName}
                  onChange={handleChange}
                  className="border p-2 rounded-lg w-full"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Encounter Class</label>
                <select
                  name="classOption"
                  value={formValues.classOption}
                  onChange={handleChange}
                  className="border p-2 rounded-lg w-full"
                  required
                >
                  {CLASS_OPTIONS.map((opt) => (
                    <option key={opt.code} value={opt.label}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">Encounter Category</label>
                <select
                  name="categoryOption"
                  value={formValues.categoryOption}
                  onChange={handleChange}
                  className="border p-2 rounded-lg w-full"
                  required
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {submitting ? (
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

      {/* Encounters Table */}
      {loadingList ? (
        <div className="flex items-center justify-center py-8 text-gray-600">
          <Loader2 className="animate-spin w-5 h-5 mr-2" />
          Loading encounters...
        </div>
      ) : encounters.length === 0 ? (
        <p className="text-gray-500">No encounters found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 border-b">Class</th>
                <th className="text-left px-4 py-2 border-b">Status</th>
                <th className="text-left px-4 py-2 border-b">Start</th>
                <th className="text-left px-4 py-2 border-b">End</th>
                <th className="text-left px-4 py-2 border-b">Practitioner</th>
              </tr>
            </thead>
            <tbody>
              {encounters.map((e, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{e.classDisplay}</td>
                  <td className="px-4 py-2 border-b capitalize">{e.status}</td>
                  <td className="px-4 py-2 border-b">{e.start ? new Date(e.start).toLocaleString() : "—"}</td>
                  <td className="px-4 py-2 border-b">{e.end ? new Date(e.end).toLocaleString() : "—"}</td>
                  <td className="px-4 py-2 border-b">{e.practitioner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
