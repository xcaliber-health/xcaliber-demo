
// import { useEffect, useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { fetchPatients } from "../api/patient";
// import { AppContext } from "../layouts/DashboardLayout";
// import { Search, Users, Phone, Mail, Calendar, User, Activity, Loader2, FileUp as FileUser } from "lucide-react";
// import toast from "react-hot-toast";

// // ✅ Reusable Tailwind components
// function Card({ children, className = "" }) {
//   return (
//     <div className={`bg-white/95 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 ${className}`}>
//       {children}
//     </div>
//   );
// }

// function Button({ children, className = "", ...props }) {
//   return (
//     <button
//       {...props}
//       className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95 ${className}`}
//     >
//       {children}
//     </button>
//   );
// }

// function Input(props) {
//   return (
//     <input
//       {...props}
//       className="border-2 border-gray-200/50 py-3 px-12 rounded-2xl w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 outline-none bg-white/80 backdrop-blur-sm transition-all duration-200 placeholder:text-gray-400"
//     />
//   );
// }

// function StatusBadge({ status }) {
//   const getStatusStyle = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
//       case 'inactive': return 'bg-gray-100 text-gray-600 border-gray-200';
//       case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
//       default: return 'bg-slate-100 text-slate-600 border-slate-200';
//     }
//   };
//   return (
//     <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${getStatusStyle(status)}`}>
//       <Activity className="w-3 h-3 mr-1" />
//       {status || 'N/A'}
//     </div>
//   );
// }
// const getPatientFullName = (nameArray) => {
//   if (!Array.isArray(nameArray) || nameArray.length === 0) return "Unknown";
//   const { given = [], family = "" } = nameArray[0];
//   return [...given, family].join(" ");
// };


// export default function PatientList() {
//   const [patients, setPatients] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("william");
//   const [debouncedSearch, setDebouncedSearch] = useState(search);
//   const [initialLoaded, setInitialLoaded] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 10;

//   const navigate = useNavigate();
//   const { ehr, sourceId,baseUrl, departmentId, setLatestCurl } = useContext(AppContext);

//   const totalPages = Math.ceil(patients.length / rowsPerPage);
//   const paginatedPatients = patients.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

//   useEffect(() => {
//     const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
//     return () => clearTimeout(t);
//   }, [search]);

//   useEffect(() => {
//     if (!sourceId) return;
//     setLoading(true);
//     (async () => {
//       try {
//         const res = await fetchPatients(sourceId, ehr,baseUrl, debouncedSearch, departmentId,setLatestCurl, { headers: { "x-interaction-mode": "false" } });
//         setPatients(res);
//         if (!initialLoaded) {
//           res.length ? toast.success(`Loaded ${res.length} patient(s)`) : toast("No patients found", { icon: "ℹ️" });
//         }
//       } catch (err) {
//         toast.error(err?.message || "Failed to fetch patients");
//       } finally {
//         setLoading(false);
//         setInitialLoaded(true);
//       }
//     })();
//   }, [sourceId, departmentId, ehr,baseUrl, debouncedSearch, initialLoaded]);

//   return (
//     <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden">
//       {/* Header */}
//       <div className="flex-shrink-0 p-4 pb-1">
//         <div className="max-w-6xl mx-auto">
//           <div className="flex items-center gap-3 mb-2">
//             <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
//               <Users className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                 Patient Directory
//               </h1>
//               <p className="text-sm text-gray-600">Search and manage your patients</p>
//             </div>
//           </div>

//           <div className="relative max-w-2xl mb-4">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 h-5 w-5" />
//             <Input
//               type="text"
//               placeholder="Search by patient name or ID..."
//               value={search}
//               onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
//               className="pl-12 shadow-lg py-2.5"
//             />
//             {search && loading && (
//               <div className="absolute right-4 top-1/2 -translate-y-1/2">
//                 <Loader2 className="w-2.5 h-2.5 text-indigo-500 animate-spin" />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="flex-1 px-4 pb-2 overflow-hidden min-h-0">
//         <div className="max-w-6xl mx-auto h-full flex flex-col">
//           <Card className="flex-1 flex flex-col overflow-hidden max-h-[500px]">
//             <div className="flex-1 flex flex-col p-3 overflow-hidden min-h-0">
//               <div className="flex-1 overflow-auto custom-scrollbar">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 sticky top-0 z-10">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         <div className="flex items-center gap-2"><FileUser className="w-4 h-4"/>ID</div>
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         <div className="flex items-center gap-2"><User className="w-4 h-4"/>Name</div>
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Gender</th>
//                       <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         <div className="flex items-center gap-2"><Calendar className="w-4 h-4"/>DOB</div>
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         <div className="flex items-center gap-2"><Mail className="w-4 h-4"/>Email</div>
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         <div className="flex items-center gap-2"><Phone className="w-4 h-4"/>Phone</div>
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-100">
//                     {loading ? (
//                       <tr><td colSpan={7} className="text-center py-12"><Loader2 className="animate-spin w-6 h-6 text-indigo-500 mx-auto" /></td></tr>
//                     ) : paginatedPatients.length > 0 ? paginatedPatients.map((p) => (
//                       <tr
//                         key={p.id}
//                         onClick={() => navigate(`/patients/${p.id}`)}
//                         className="cursor-pointer hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-lg transition-all"
//                       >
//                         <td className="px-6 py-4 text-sm text-gray-700 font-mono">{p.id}</td>
//                         <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{p.name}</td>
//                         <td className="px-6 py-4 text-sm text-gray-600 capitalize">{p.gender}</td>
//                         <td className="px-6 py-4 text-sm text-gray-600">{p.birthDate}</td>
//                         <td className="px-6 py-4 text-sm text-gray-600">{p.email || <span className="italic text-gray-400">No email</span>}</td>
//                         <td className="px-6 py-4 text-sm text-gray-600">{p.phone || <span className="italic text-gray-400">No phone</span>}</td>
//                         <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
//                       </tr>
//                     )) : (
//                       <tr>
//                         <td colSpan={7} className="text-center py-12 text-gray-500">No patients found</td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <div className="flex-shrink-0 flex justify-between items-center pt-2 mt-2 border-t border-gray-200">
//                   <Button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>← Previous</Button>
//                   <div className="flex items-center gap-1">
//                     {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
//                       const pageNum = i + 1;
//                       return (
//                         <button
//                           key={pageNum}
//                           onClick={() => setCurrentPage(pageNum)}
//                           className={`w-6 h-6 rounded-lg transition-all text-xs ${currentPage === pageNum ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
//                         >
//                           {pageNum}
//                         </button>
//                       );
//                     })}
//                     {totalPages > 5 && <span className="text-gray-400 text-xs">...</span>}
//                   </div>
//                   <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next →</Button>
//                 </div>
//               )}
//             </div>
//           </Card>
//         </div>
//       </div>

//       <style >{`
//         .custom-scrollbar {
//           scrollbar-width: thin;
//           scrollbar-color: #e0e7ff #f8fafc;
//         }
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f8fafc;
//           border-radius: 3px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #e0e7ff;
//           border-radius: 3px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #c7d2fe;
//         }
//       `}</style>
//     </div>
//   );
// }
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPatients } from "../api/patient";
import { AppContext } from "../layouts/DashboardLayout";
import { Search, Users, Phone, Mail, Calendar, User, Activity, Loader2, FileUp as FileUser } from "lucide-react";
import toast from "react-hot-toast";
import { ECW_MOCK_PATIENTS } from "../data/patientListMock";

// -------------------- Reusable Tailwind Components --------------------
function Card({ children, className = "" }) {
  return (
    <div className={`bg-white/95 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 ${className}`}>
      {children}
    </div>
  );
}

function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="border-2 border-gray-200/50 py-3 px-12 rounded-2xl w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 outline-none bg-white/80 backdrop-blur-sm transition-all duration-200 placeholder:text-gray-400"
    />
  );
}

function StatusBadge({ status }) {
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'inactive': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };
  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${getStatusStyle(status)}`}>
      <Activity className="w-3 h-3 mr-1" />
      {status || 'N/A'}
    </div>
  );
}

// Normalize ECW-style name arrays to string
const getPatientFullName = (nameArrayOrString) => {
  if (!nameArrayOrString) return "Unknown";
  if (typeof nameArrayOrString === "string") return nameArrayOrString;
  if (!Array.isArray(nameArrayOrString) || nameArrayOrString.length === 0) return "Unknown";
  const { given = [], family = "" } = nameArrayOrString[0];
  return [...given, family].join(" ");
};

// -------------------- PatientList Component --------------------
export default function PatientList() {
  const { ehr, sourceId, baseUrl, departmentId, setLatestCurl } = useContext(AppContext);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [search, setSearch] = useState("");
  
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [search, setSearch] = useState(
    ehr.toLowerCase().startsWith("athena") ? "sofia" : ""
  );
  
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const navigate = useNavigate();
  

  const totalPages = Math.ceil(patients.length / rowsPerPage);
  const paginatedPatients = patients.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Detect data source
  const isMockSource =
    sourceId !== import.meta.env.VITE_SOURCE_ID_ATHENA ;
    // &&
    // sourceId !== import.meta.env.VITE_SOURCE_ID_ELATION;

    // Sync search if EHR changes
  // useEffect(() => {
  //   if (ehr.toLowerCase().startsWith("athena")) {
  //     setSearch("sofia");
  //   } else {
  //     setSearch("");
  //   }
  // }, [ehr]);

  


  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);




useEffect(() => {
  if (!sourceId) return;

  setLoading(true);
  setPatients([]);
  setCurrentPage(1);

  const loadPatients = async () => {
    try {
      let data = [];

      if (isMockSource) {
        // Non-Athena mock patients
        // data = ECW_MOCK_PATIENTS.map((p) => ({
        //   id: p.id,
        //   name: getPatientFullName(p.name),
        //   gender: p.gender || "Unknown",
        //   birthDate: p.birthDate || "Unknown",
        //   email: p.email || "",
        //   phone: p.phone || "",
        //   status: p.status || "N/A",
        // }));
        data = ECW_MOCK_PATIENTS.map((p) => {
  const phoneEntry = p.telecom?.find(entry => entry.system === "phone");
  const emailEntry = p.telecom?.find(entry => entry.system === "email");
  return {
    id: p.id,
    name: getPatientFullName(p.name),
    gender: p.gender || "Unknown",
    birthDate: p.birthDate || "Unknown",
    email: emailEntry?.value || "",
    phone: phoneEntry?.value || "",
    status: p.status || "N/A",
  };
});

        await new Promise((resolve) => setTimeout(resolve, 3000));
      } else {
        const rawData = await fetchPatients(
          sourceId,
          ehr,
          baseUrl,
          debouncedSearch,
          departmentId,
          setLatestCurl,
          { headers: { "x-interaction-mode": "false" } }
        );

        data = rawData.map((p) => ({
          ...p,
          name: getPatientFullName(p.name),
          gender: p.gender || "Unknown",
          birthDate: p.birthDate || "Unknown",
          email: p.email || "",
          phone: p.phone || "",
          status: p.status || "N/A",
        }));

        // === Filter for Athena only ===
        // if (ehr.startsWith("Athena")) {
        //   data = data.filter((p) => p.name.toLowerCase().includes("sofia"));
        // }
      }

      setPatients(data);
      data.length
        ? toast.success(`Loaded ${data.length} patient(s)`)
        : toast("No patients found", { icon: "ℹ️" });
    } catch (err) {
      toast.error(err?.message || "Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  loadPatients();
}, [sourceId, departmentId, ehr, baseUrl, debouncedSearch]);


  return (
    <div className="h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden hide-scrollbar">
      {/* Header */}
      <div className="flex-shrink-0 p-4 pb-1">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Oncologist Patient Chart
              </h1>
              <p className="text-sm text-gray-600">Search and manage your patients</p>
            </div>
          </div>

          <div className="relative max-w-2xl mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search by patient name or ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="pl-12 shadow-lg py-2.5"
            />
            {search && loading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="w-2.5 h-2.5 text-indigo-500 animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="flex-1 px-4 pb-2 overflow-hidden min-h-0">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden max-h-[500px]">
            <div className="flex-1 flex flex-col p-3 overflow-hidden min-h-0">
              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2"><FileUser className="w-4 h-4"/>ID</div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2"><User className="w-4 h-4"/>Name</div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Gender</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4"/>DOB</div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2"><Mail className="w-4 h-4"/>Email</div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4"/>Phone</div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {loading ? (
                      <tr><td colSpan={7} className="text-center py-12"><Loader2 className="animate-spin w-6 h-6 text-indigo-500 mx-auto" /></td></tr>
                    ) : paginatedPatients.length > 0 ? paginatedPatients.map((p) => (
                      <tr
                        key={p.id}
                        onClick={() => navigate(`/patients/${p.id}`)}
                        className="cursor-pointer hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-lg transition-all"
                      >
                        <td className="px-6 py-4 text-sm text-gray-700 font-mono">{p.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{p.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 capitalize">{p.gender}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{p.birthDate}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{p.email || <span className="italic text-gray-400">No email</span>}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{p.phone || <span className="italic text-gray-400">No phone</span>}</td>
                        <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-gray-500">No patients found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex-shrink-0 flex justify-between items-center pt-2 mt-2 border-t border-gray-200">
                  <Button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>← Previous</Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-6 h-6 rounded-lg transition-all text-xs ${currentPage === pageNum ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 5 && <span className="text-gray-400 text-xs">...</span>}
                  </div>
                  <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next →</Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #e0e7ff #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e0e7ff;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c7d2fe;
        }
      `}</style>
    </div>
  );
}
