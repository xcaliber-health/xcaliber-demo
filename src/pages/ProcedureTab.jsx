
// // src/pages/ProcedureTab.jsx
// import { useEffect, useState, useContext } from "react";
// import { Loader2, Plus } from "lucide-react";
// import toast from "react-hot-toast";
// import { AppContext } from "../layouts/DashboardLayout";
// import { fetchProcedures, mapProcedureRow, addProcedure } from "../api/procedureApi";

// export default function ProcedureTab({ patientId }) {
//   const { sourceId, departmentId, setLatestCurl } = useContext(AppContext);

//   const [procedures, setProcedures] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [status, setStatus] = useState("unknown");
//   const [performedDate, setPerformedDate] = useState("");
//   const [note, setNote] = useState("");
//   const [procedureCode, setProcedureCode] = useState("78725"); // CPT code
//   const [procedureDisplay] = useState("Kidney function study"); // fixed display

//   // ---------------- Load procedures ----------------
//   useEffect(() => {
//     if (!patientId || !sourceId) return;

//     const loadProcedures = async () => {
//       setLoading(true);
//       try {
//         const data = await fetchProcedures({
//           patientId,
//           departmentId,
//           sourceId,
//           setLatestCurl,
//         });
//         setProcedures(data);
//         toast.success("Procedures loaded successfully");
//       } catch (err) {
//         setError(err.message);
//         toast.error("Failed to load procedures");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadProcedures();
//   }, [patientId, sourceId, departmentId]);

//   // ---------------- Handle add procedure ----------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!performedDate) {
//       toast.error("Performed date is required");
//       return;
//     }

//     try {
//       await addProcedure({
//         patientId,
//         departmentId,
//         sourceId,
//         setLatestCurl,
//         data: {
//           status,
//           performedDate,
//           procedureCode,
//           procedureDisplay,
//           note,
//         },
//       });

//       toast.success("Procedure added successfully");
//       setModalOpen(false);

//       // reload procedures
//       const data = await fetchProcedures({
//         patientId,
//         departmentId,
//         sourceId,
//         setLatestCurl,
//       });
//       setProcedures(data);
//     } catch (err) {
//       toast.error("Failed to add procedure: " + err.message);
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex items-center justify-center py-12 text-gray-500">
//         <Loader2 className="h-6 w-6 animate-spin mr-2" />
//         Loading Procedures...
//       </div>
//     );

//   if (error)
//     return (
//       <div className="text-center py-6 text-red-500">
//         Error loading procedures: {error}
//       </div>
//     );

//   const headers = ["Procedure", "Status", "Date"];

//   return (
//     <div>
//       {/* Add Procedure Button */}
//       {/* <div className="mb-4">
//         <button
//           className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           onClick={() => setModalOpen(true)}
//         >
//           <Plus className="h-4 w-4" /> Add Procedure
//         </button>
//       </div> */}

//       {/* Procedures Table */}
//       <table className="w-full border border-gray-300 shadow rounded-lg overflow-hidden text-sm">
//         <thead className="bg-gray-100">
//           <tr>
//             {headers.map((h, i) => (
//               <th
//                 key={i}
//                 className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700"
//               >
//                 {h}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {procedures.map((res, i) => {
//             const row = mapProcedureRow(res);
//             return (
//               <tr key={i} className="hover:bg-gray-50">
//                 {row.map((cell, j) => (
//                   <td key={j} className="border border-gray-300 px-3 py-2">
//                     {cell || "-"}
//                   </td>
//                 ))}
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>

//       {/* Modal */}
//       {modalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
//           <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
//             <h2 className="text-xl font-semibold mb-4">Add Procedure</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Procedure Dropdown */}
//               <div>
//                 <label className="block mb-1 font-medium">Procedure</label>
//                 <select
//                   value={procedureCode}
//                   onChange={(e) => setProcedureCode(e.target.value)}
//                   className="w-full border px-2 py-1 rounded"
//                 >
//                   <option value="78725">Kidney function study</option>
//                 </select>
//               </div>

//               {/* Status */}
//               <div>
//                 <label className="block mb-1 font-medium">Status</label>
//                 <select
//                   value={status}
//                   onChange={(e) => setStatus(e.target.value)}
//                   className="w-full border px-2 py-1 rounded"
//                 >
//                   <option value="preparation">preparation</option>
//                   <option value="in-progress">in-progress</option>
//                   <option value="not-done">not-done</option>
//                   <option value="on-hold">on-hold</option>
//                   <option value="stopped">stopped</option>
//                   <option value="completed">completed</option>
//                   <option value="entered-in-error">entered-in-error</option>
//                   <option value="unknown">unknown</option>
//                 </select>
//               </div>

//               {/* Performed Date */}
//               <div>
//                 <label className="block mb-1 font-medium">Performed Date</label>
//                 <input
//                   type="datetime-local"
//                   value={performedDate}
//                   onChange={(e) => setPerformedDate(e.target.value)}
//                   className="w-full border px-2 py-1 rounded"
//                   required
//                 />
//               </div>

//               {/* Note */}
//               <div>
//                 <label className="block mb-1 font-medium">Note</label>
//                 <textarea
//                   value={note}
//                   onChange={(e) => setNote(e.target.value)}
//                   className="w-full border px-2 py-1 rounded"
//                   rows={3}
//                 />
//               </div>

//               {/* Buttons */}
//               <div className="flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setModalOpen(false)}
//                   className="px-4 py-2 rounded border hover:bg-gray-100"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                 >
//                   Add Procedure
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { useEffect, useState, useContext } from "react";
import { Loader2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { AppContext } from "../layouts/DashboardLayout";
import { fetchProcedures, mapProcedureRow, addProcedure } from "../api/procedureApi";
import { ECW_MOCK_PATIENTS } from "../data/patientListMock";

export default function ProcedureTab({ patientId }) {
  const { sourceId, departmentId, setLatestCurl } = useContext(AppContext);

  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState("unknown");
  const [performedDate, setPerformedDate] = useState("");
  const [note, setNote] = useState("");
  const [procedureCode, setProcedureCode] = useState("78725"); // CPT code
  const [procedureDisplay] = useState("Kidney function study"); // fixed display

  // Detect data source
  const isMockSource =
    sourceId !== import.meta.env.VITE_SOURCE_ID_ATHENA &&
    sourceId !== import.meta.env.VITE_SOURCE_ID_ELATION;

  // ---------------- Load procedures ----------------
  useEffect(() => {
    if (!patientId || !sourceId || !departmentId) return;

    const loadProcedures = async () => {
      setLoading(true);
      try {
        let data = [];

        if (isMockSource) {
          const patientMock = ECW_MOCK_PATIENTS.find((p) => p.id === patientId);
          if (!patientMock) throw new Error("Patient not found in data data");
          data = patientMock.procedures || [];
        } else {
          data = await fetchProcedures({ patientId, departmentId, sourceId, setLatestCurl });
        }

        setProcedures(Array.isArray(data) ? data : []);
        toast.success("Procedures loaded successfully");
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load procedures");
        toast.error(err.message || "Failed to load procedures");
      } finally {
        setLoading(false);
      }
    };

    loadProcedures();
  }, [patientId, sourceId, departmentId, setLatestCurl]);

  // ---------------- Handle add procedure ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!performedDate) {
      toast.error("Performed date is required");
      return;
    }

    try {
      if (isMockSource) {
        const patientMock = ECW_MOCK_PATIENTS.find((p) => p.id === patientId);
        if (patientMock) {
          patientMock.procedures = patientMock.procedures || [];
          patientMock.procedures.push({
            id: `data-${Date.now()}`,
            status,
            performedDate,
            procedureCode,
            procedureDisplay,
            note,
          });
        }
      } else {
        await addProcedure({
          patientId,
          departmentId,
          sourceId,
          setLatestCurl,
          data: { status, performedDate, procedureCode, procedureDisplay, note },
        });
      }

      toast.success("Procedure added successfully");
      setModalOpen(false);

      // Reload procedures
      let updated = [];
      if (isMockSource) {
        const patientMock = ECW_MOCK_PATIENTS.find((p) => p.id === patientId);
        updated = patientMock.procedures || [];
      } else {
        updated = await fetchProcedures({ patientId, departmentId, sourceId, setLatestCurl });
      }

      setProcedures(Array.isArray(updated) ? updated : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add procedure: " + (err.message || "Unknown error"));
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading Procedures...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-6 text-red-500">
        Error loading procedures: {error}
      </div>
    );

  const headers = ["Procedure", "Status", "Date"];

  return (
    <div className="space-y-4">
      {/* Add Procedure Button */}
      <div>
        {/* <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setModalOpen(true)}
        >
          <Plus className="h-4 w-4" /> Add Procedure
        </button> */}
      </div>

      {/* Procedures Table */}
      <table className="w-full border border-gray-300 shadow rounded-lg overflow-hidden text-sm">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((h, i) => (
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
          {procedures.map((res, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {mapProcedureRow(res).map((cell, j) => (
                <td key={j} className="border border-gray-300 px-3 py-2">
                  {cell || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">Add Procedure</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Procedure Dropdown */}
              <div>
                <label className="block mb-1 font-medium">Procedure</label>
                <select
                  value={procedureCode}
                  onChange={(e) => setProcedureCode(e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                >
                  <option value="78725">Kidney function study</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block mb-1 font-medium">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                >
                  {[
                    "preparation",
                    "in-progress",
                    "not-done",
                    "on-hold",
                    "stopped",
                    "completed",
                    "entered-in-error",
                    "unknown",
                  ].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Performed Date */}
              <div>
                <label className="block mb-1 font-medium">Performed Date</label>
                <input
                  type="datetime-local"
                  value={performedDate}
                  onChange={(e) => setPerformedDate(e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>

              {/* Note */}
              <div>
                <label className="block mb-1 font-medium">Note</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                  rows={3}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Procedure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
