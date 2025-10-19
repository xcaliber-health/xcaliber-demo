
// import { useEffect, useState, useContext } from "react";
// import { Loader2 } from "lucide-react";
// import toast from "react-hot-toast";
// import { AppContext } from "../layouts/DashboardLayout";
// import {
//   fetchQuestionnaireResponses,
//   mapQuestionnaireRow,
//   createQuestionnaireResponse
// } from "../api/questionnaireApi";

// export default function QuestionnaireTab({ patientId }) {
//   const { departmentId, sourceId, setLatestCurl, userId } = useContext(AppContext);

//   const [responses, setResponses] = useState([]);
//   const [loadingList, setLoadingList] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [open, setOpen] = useState(false);

//   const [formValues, setFormValues] = useState({
//     authored: new Date().toISOString().split("T")[0],
//     answer: "N",
//   });

//   // Load Questionnaire Responses
//   useEffect(() => {
//     if (!patientId || !sourceId || !departmentId) return;

//     const loadResponses = async () => {
//       setLoadingList(true);
//       try {
//         const data = await fetchQuestionnaireResponses(patientId, departmentId, sourceId, setLatestCurl);
//         setResponses(data);
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load Questionnaire Responses");
//       } finally {
//         setLoadingList(false);
//       }
//     };

//     loadResponses();
//   }, [patientId, sourceId, departmentId, setLatestCurl]);

//   // Handle form change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues(prev => ({ ...prev, [name]: value }));
//   };

//   // Submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       await createQuestionnaireResponse(
//         {
//           patientId,
//           departmentId,
//           sourceId,
//           authored: formValues.authored,
//           answerValue: formValues.answer,
//           userId,
//         },
//         setLatestCurl
//       );
//       toast.success("Questionnaire Response added successfully");
//       setOpen(false);

//       // Refresh list
//       const data = await fetchQuestionnaireResponses(patientId, departmentId, sourceId, setLatestCurl);
//       setResponses(data);
//       setFormValues({ authored: new Date().toISOString().split("T")[0], answer: "N" });
//     } catch (err) {
//       console.error(err);
//       toast.error(err.message || "Failed to add Questionnaire Response");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       {/* Header + Add button */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Questionnaire Responses</h2>
//         {/* <button
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           onClick={() => setOpen(true)}
//         >
//           Add Response
//         </button> */}
//       </div>

//       {/* Modal Form */}
//       {open && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
//             <h2 className="text-lg font-semibold mb-4">Add Questionnaire Response</h2>
//             <form onSubmit={handleSubmit} className="space-y-3">
//               <div>
//                 <label className="block mb-1 font-medium">Authored Date</label>
//                 <input
//                   type="date"
//                   name="authored"
//                   value={formValues.authored}
//                   onChange={handleChange}
//                   className="border p-2 w-full rounded"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1 font-medium">Do you have an advance directive?</label>
//                 <select
//                   name="answer"
//                   value={formValues.answer}
//                   onChange={handleChange}
//                   className="border p-2 w-full rounded"
//                 >
//                   <option value="Y">Yes</option>
//                   <option value="N">No</option>
//                 </select>
//               </div>

//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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

//       {/* List of Responses */}
//       {loadingList ? (
//         <div className="flex items-center justify-center py-6 text-gray-600">
//           <Loader2 className="h-6 w-6 animate-spin mr-2" />
//           Loading Questionnaire Responses...
//         </div>
//       ) : responses.length === 0 ? (
//         <p className="text-gray-500 text-center">No Questionnaire Responses found.</p>
//       ) : (
//         <table className="w-full border border-gray-300 shadow rounded-lg overflow-hidden text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               {["History Type", "Status", "Authored", "Question / Answer", "Last Modified By"].map((h) => (
//                 <th key={h} className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">{h}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {responses.map((r, i) => (
//               <tr key={i} className="hover:bg-gray-50">
//                 {mapQuestionnaireRow(r).map((cell, j) => (
//                   <td key={j} className="border border-gray-300 px-3 py-2">{cell || "-"}</td>
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
  fetchQuestionnaireResponses,
  mapQuestionnaireRow,
  createQuestionnaireResponse
} from "../api/questionnaireApi";
import { ECW_MOCK_PATIENTS } from "../data/patientListMock";

export default function QuestionnaireTab({ patientId }) {
  const { departmentId, sourceId, setLatestCurl, userId } = useContext(AppContext);

  const [responses, setResponses] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const [formValues, setFormValues] = useState({
    authored: new Date().toISOString().split("T")[0],
    answer: "N",
  });

  // Detect data source
  const isMockSource =
    sourceId !== import.meta.env.VITE_SOURCE_ID_ATHENA; 
    // &&
    // sourceId !== import.meta.env.VITE_SOURCE_ID_ELATION;

  // ---------------- Load Questionnaire Responses ----------------
  useEffect(() => {
    if (!patientId || !sourceId || !departmentId) return;

    const loadResponses = async () => {
      setLoadingList(true);
      try {
        let data = [];

        if (isMockSource) {
          const patientMock = ECW_MOCK_PATIENTS.find((p) => p.id === patientId);
          if (!patientMock) throw new Error("Patient not found in data data");
          data = patientMock.questionnaireResponses || [];
        } else {
          data = await fetchQuestionnaireResponses(patientId, departmentId, sourceId, setLatestCurl);
        }

        setResponses(Array.isArray(data) ? data : []);
        toast.success("Questionnaire Responses loaded successfully");
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Failed to load Questionnaire Responses");
      } finally {
        setLoadingList(false);
      }
    };

    loadResponses();
  }, [patientId, departmentId, sourceId, setLatestCurl]);

  // ---------------- Handlers ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    try {
      if (isMockSource) {
        const patientMock = ECW_MOCK_PATIENTS.find((p) => p.id === patientId);
        if (patientMock) {
          patientMock.questionnaireResponses = patientMock.questionnaireResponses || [];
          patientMock.questionnaireResponses.push({
            ...formValues,
            id: `data-${Date.now()}`,
            userId,
          });
        }
      } else {
        await createQuestionnaireResponse(
          {
            patientId,
            departmentId,
            sourceId,
            authored: formValues.authored,
            answerValue: formValues.answer,
            userId,
          },
          setLatestCurl
        );
      }

      toast.success("Questionnaire Response added successfully");
      setOpenForm(false);
      setFormValues({ authored: new Date().toISOString().split("T")[0], answer: "N" });

      // Reload list
      let updated = [];
      if (isMockSource) {
        const patientMock = ECW_MOCK_PATIENTS.find((p) => p.id === patientId);
        updated = patientMock.questionnaireResponses || [];
      } else {
        updated = await fetchQuestionnaireResponses(patientId, departmentId, sourceId, setLatestCurl);
      }

      setResponses(Array.isArray(updated) ? updated : []);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to add Questionnaire Response");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------- Render ----------------
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Questionnaire Responses</h2>
        {/* <button
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => setOpenForm(true)}
        >
          <Plus className="w-4 h-4" />
          Add Response
        </button> */}
      </div>

      {/* Modal Form */}
      {openForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Add Questionnaire Response</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block mb-1 font-medium">Authored Date</label>
                <input
                  type="date"
                  name="authored"
                  value={formValues.authored}
                  onChange={handleChange}
                  required
                  className="border p-2 w-full rounded"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Do you have an advance directive?</label>
                <select
                  name="answer"
                  value={formValues.answer}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                >
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
                  onClick={() => setOpenForm(false)}
                  className="w-full px-4 py-2 border rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List of Responses */}
      {loadingList ? (
        <div className="flex items-center justify-center py-6 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading Questionnaire Responses...
        </div>
      ) : responses.length === 0 ? (
        <p className="text-gray-500 text-center">No Questionnaire Responses found.</p>
      ) : (
        <table className="w-full border border-gray-300 shadow rounded-lg overflow-hidden text-sm">
          <thead className="bg-gray-100">
            <tr>
              {["History Type", "Status", "Authored", "Question / Answer", "Last Modified By"].map((h) => (
                <th key={h} className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {responses.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {mapQuestionnaireRow(r).map((cell, j) => (
                  <td key={j} className="border border-gray-300 px-3 py-2">{cell || "-"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
