


// import { useEffect, useState, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { fetchClaims, fetchClaimById } from "../api/claims";
// import { AppContext } from "../layouts/DashboardLayout";
// import { Loader2, Search, Users } from "lucide-react";
// import toast from "react-hot-toast";
// import { ECW_MOCK_CLAIMS } from "../data/claimsMock";

// // ✅ Reusable components
// function Card({ children, className = "" }) {
//   return (
//     <div
//       className={`bg-white/95 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 ${className}`}
//     >
//       {children}
//     </div>
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

// export default function ClaimsDashboard() {
//   const { ehr, sourceId, departmentId, setLatestCurl, parentEhr } = useContext(AppContext);

//   // const patientId =
//   //   ehr === "Athena"
//   //     ? import.meta.env.VITE_ATHENA_PATIENT_ID
//   //     : import.meta.env.VITE_ELATION_PATIENT_ID;
//   const patientId =
//     parentEhr === "Athena"
//       ? import.meta.env.VITE_ATHENA_PATIENT_ID
//       : import.meta.env.VITE_ELATION_PATIENT_ID;


//   const [claims, setClaims] = useState([]);
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const navigate = useNavigate();
//   const itemsPerPage = 10;

//   const totalPages = Math.ceil(claims.length / itemsPerPage);
//   const paginatedClaims = claims.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // ✅ Detect if using data source
//   const isMockSource =
//     sourceId !== import.meta.env.VITE_SOURCE_ID_ATHENA &&
//     sourceId !== import.meta.env.VITE_SOURCE_ID_ELATION;

//   useEffect(() => {
//     const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
//     return () => clearTimeout(t);
//   }, [search]);

//   useEffect(() => {
//     if (!sourceId || !patientId || !departmentId) return;

//     let cancelled = false;

//     (async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         let data = [];

//         if (isMockSource) {
//           // ✅ Data claims mode
//           await new Promise((r) => setTimeout(r, 2500)); // simulate delay

//           // Normalize data data
//           let mockData = ECW_MOCK_CLAIMS.entry.map((e) => {
//             const res = e.resource;
//             return {
//               id: res.id,
//               status: res.status,
//               serviceDate: res.billablePeriod?.start || null,
//               patient: res.patient?.display || res.patient?.reference || "N/A",
//               provider: res.provider?.display || res.provider?.reference || "N/A",
//               totalBilled: res.total?.value || 0,
//             };
//           });

//           if (debouncedSearch) {
//             mockData = mockData.filter((c) =>
//               c.id.toLowerCase().includes(debouncedSearch.toLowerCase())
//             );
//           }

//           data = mockData;
//         } else {
//           // ✅ Real API mode
//           if (!debouncedSearch) {
//             data = await fetchClaims(patientId, sourceId, setLatestCurl);
//           } else {
//             const claim = await fetchClaimById(
//               debouncedSearch,
//               sourceId,
//               patientId,
//               departmentId,
//               setLatestCurl
//             );
//             data = claim ? [claim] : [];
//           }
//         }

//         if (!cancelled) {
//           setClaims(data);
//           setCurrentPage(1);
//           toast.success(`Loaded ${data.length} claim${data.length !== 1 ? "s" : ""}`);
//         }
//       } catch (err) {
//         if (!cancelled) {
//           setError(err.message || "Failed to fetch claims");
//           setClaims([]);
//           toast.error(`Error: ${err.message || "Failed to fetch claims"}`);
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [debouncedSearch, sourceId, patientId, departmentId]);

//   return (
//     <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden">
//       <div className="flex-shrink-0 p-4 pb-1">
//         <div className="max-w-6xl mx-auto">
//           {/* Header */}
//           <div className="flex items-center justify-between gap-3 mb-2">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <Users className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                   Claims Dashboard
//                 </h1>
//                 <p className="text-sm text-gray-600">Search and manage claims</p>
//               </div>
//             </div>
//           </div>

//           {/* Search */}
//           <div className="relative max-w-2xl mb-4">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 h-5 w-5" />
//             <Input
//               type="text"
//               placeholder="Search by Claim ID..."
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setCurrentPage(1);
//               }}
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

//       {/* Table */}
//       <div className="flex-1 px-4 pb-2 overflow-hidden min-h-0">
//         <div className="max-w-6xl mx-auto h-full flex flex-col">
//           <Card className="flex-1 flex flex-col overflow-hidden max-h-[500px]">
//             <div className="flex-1 flex flex-col p-3 overflow-hidden min-h-0">
//               {loading ? (
//                 <div className="flex justify-center items-center text-indigo-600 flex-1">
//                   <Loader2 className="animate-spin h-6 w-6" />
//                 </div>
//               ) : error ? (
//                 <div className="p-4 text-red-700 font-medium text-center">{error}</div>
//               ) : paginatedClaims.length ? (
//                 <div className="flex-1 overflow-y-auto custom-scrollbar rounded-lg border border-gray-200">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 sticky top-0 z-10 text-gray-600 uppercase text-xs">
//                       <tr>
//                         <th className="px-6 py-3 text-left">Claim ID</th>
//                         <th className="px-6 py-3 text-left">Patient</th>
//                         <th className="px-6 py-3 text-left">Provider</th>
//                         <th className="px-6 py-3 text-left">Date</th>
//                         <th className="px-6 py-3 text-left">Status</th>
//                         <th className="px-6 py-3 text-left">Billed</th>
//                         <th className="px-6 py-3 text-left">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-100">
//                       {paginatedClaims.map((c) => (
//                         <tr
//                           key={c.id}
//                           className="cursor-pointer hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-lg transition-all"
//                         >
//                           <td className="px-6 py-4">{c.id}</td>
//                           <td className="px-6 py-4">{c.patient ?? "N/A"}</td>
//                           <td className="px-6 py-4">{c.provider ?? "N/A"}</td>
//                           <td className="px-6 py-4">
//                             {c.serviceDate
//                               ? new Date(c.serviceDate).toLocaleDateString()
//                               : "N/A"}
//                           </td>
//                           <td className="px-6 py-4 capitalize">{c.status}</td>
//                           <td className="px-6 py-4">${(c.totalBilled ?? 0).toFixed(2)}</td>
//                           <td className="px-6 py-4">
//                             <button
//                               onClick={() => navigate(`/claims/${c.id}`)}
//                               className="text-indigo-600 hover:underline"
//                             >
//                               View
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="flex-1 flex items-center justify-center text-gray-500">
//                   <p className="text-lg font-medium">No claims found</p>
//                 </div>
//               )}

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <div className="flex-shrink-0 flex justify-between items-center pt-2 mt-2 border-t border-gray-200">
//                   <Button
//                     disabled={currentPage === 1}
//                     onClick={() => setCurrentPage((p) => p - 1)}
//                   >
//                     ← Previous
//                   </Button>
//                   <span className="text-gray-600 text-sm">
//                     Page {currentPage} of {totalPages}
//                   </span>
//                   <Button
//                     disabled={currentPage === totalPages}
//                     onClick={() => setCurrentPage((p) => p + 1)}
//                   >
//                     Next →
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </Card>
//         </div>
//       </div>

//       <style>{`
//         .custom-scrollbar {
//           scrollbar-width: thin;
//           scrollbar-color: #6978a7ff #f8fafc;
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
import { Link, useNavigate } from "react-router-dom";
import { fetchClaims, fetchClaimById } from "../api/claims";
import { AppContext } from "../layouts/DashboardLayout";
import { Loader2, Search, Users } from "lucide-react";
import toast from "react-hot-toast";
import { ECW_MOCK_CLAIMS } from "../data/claimsMock";

// ✅ Reusable components
function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white/95 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 ${className}`}
    >
      {children}
    </div>
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

export default function ClaimsDashboard() {
  const { ehr, sourceId, departmentId, setLatestCurl, parentEhr } = useContext(AppContext);

  const patientId =
    parentEhr === "Athena"
      ? import.meta.env.VITE_ATHENA_PATIENT_ID
      : import.meta.env.VITE_ELATION_PATIENT_ID;

  const [claims, setClaims] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  const totalPages = Math.ceil(claims.length / itemsPerPage);
  const paginatedClaims = claims.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ✅ Use mock data for Athena, Elation, or any other mock source
  const useMockData =
    sourceId === import.meta.env.VITE_SOURCE_ID_ATHENA ||
    sourceId === import.meta.env.VITE_SOURCE_ID_ELATION ||
    sourceId !== import.meta.env.VITE_SOURCE_ID_ATHENA && sourceId !== import.meta.env.VITE_SOURCE_ID_ELATION;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!sourceId || !patientId || !departmentId) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        let data = [];

        if (useMockData) {
          // ✅ Use ECW mock data
          await new Promise((r) => setTimeout(r, 1500)); // simulate delay
          let mockData = ECW_MOCK_CLAIMS.entry.map((e) => {
            const res = e.resource;
            return {
              id: res.id,
              status: res.status,
              serviceDate: res.billablePeriod?.start || null,
              patient: res.patient?.display || res.patient?.reference || "N/A",
              provider: res.provider?.display || res.provider?.reference || "N/A",
              totalBilled: res.total?.value || 0,
            };
          });

          if (debouncedSearch) {
            mockData = mockData.filter((c) =>
              c.id.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
          }

          data = mockData;
        } else {
          // ✅ Real API mode
          if (!debouncedSearch) {
            data = await fetchClaims(patientId, sourceId, setLatestCurl);
          } else {
            const claim = await fetchClaimById(
              debouncedSearch,
              sourceId,
              patientId,
              departmentId,
              setLatestCurl
            );
            data = claim ? [claim] : [];
          }
        }

        if (!cancelled) {
          setClaims(data);
          setCurrentPage(1);
          toast.success(`Loaded ${data.length} claim${data.length !== 1 ? "s" : ""}`);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to fetch claims");
          setClaims([]);
          toast.error(`Error: ${err.message || "Failed to fetch claims"}`);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, sourceId, patientId, departmentId]);

  return (
    <div className="h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-4 pb-1">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Claims Dashboard
                </h1>
                <p className="text-sm text-gray-600">Search and manage claims</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search by Claim ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
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

      {/* Table */}
      <div className="flex-1 px-4 pb-2 overflow-hidden min-h-0">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden max-h-[500px]">
            <div className="flex-1 flex flex-col p-3 overflow-hidden min-h-0">
              {loading ? (
                <div className="flex justify-center items-center text-indigo-600 flex-1">
                  <Loader2 className="animate-spin h-6 w-6" />
                </div>
              ) : error ? (
                <div className="p-4 text-red-700 font-medium text-center">{error}</div>
              ) : paginatedClaims.length ? (
                <div className="flex-1 overflow-y-auto custom-scrollbar rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 sticky top-0 z-10 text-gray-600 uppercase text-xs">
                      <tr>
                        <th className="px-6 py-3 text-left">Claim ID</th>
                        <th className="px-6 py-3 text-left">Patient</th>
                        <th className="px-6 py-3 text-left">Provider</th>
                        <th className="px-6 py-3 text-left">Date</th>
                        <th className="px-6 py-3 text-left">Status</th>
                        <th className="px-6 py-3 text-left">Billed</th>
                        <th className="px-6 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {paginatedClaims.map((c) => (
                        <tr
                          key={c.id}
                          className="cursor-pointer hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-lg transition-all"
                        >
                          <td className="px-6 py-4">{c.id}</td>
                          <td className="px-6 py-4">{c.patient ?? "N/A"}</td>
                          <td className="px-6 py-4">{c.provider ?? "N/A"}</td>
                          <td className="px-6 py-4">
                            {c.serviceDate
                              ? new Date(c.serviceDate).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 capitalize">{c.status}</td>
                          <td className="px-6 py-4">${(c.totalBilled ?? 0).toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => navigate(`/claims/${c.id}`)}
                              className="text-indigo-600 hover:underline"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <p className="text-lg font-medium">No claims found</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex-shrink-0 flex justify-between items-center pt-2 mt-2 border-t border-gray-200">
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    ← Previous
                  </Button>
                  <span className="text-gray-600 text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next →
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #6978a7ff #f8fafc;
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
