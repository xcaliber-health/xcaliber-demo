
// import { useEffect, useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { AppContext } from "../layouts/DashboardLayout";
// import { fetchProviders, fetchProviderByIdSimple } from "../api/providers";
// import toast from "react-hot-toast";
// import { Loader2, Search, Users, Calendar, ArrowRight, CalendarDays, Bell } from "lucide-react";
// import { MOCK_PROVIDERS } from "../data/providerListMock";

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

// export default function FindAppointment() {
//   const { sourceId, departmentId, setLatestCurl } = useContext(AppContext);
//   const navigate = useNavigate();

//   const [providers, setProviders] = useState([]);
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);

//   const rowsPerPage = 10;
//   const backendCount = 200;

//   const isMockSource = ![import.meta.env.VITE_SOURCE_ID_ATHENA, import.meta.env.VITE_SOURCE_ID_ELATION].includes(sourceId);

//   // debounce search input
//   useEffect(() => {
//     const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
//     return () => clearTimeout(t);
//   }, [search]);

//   // fetch providers
//   useEffect(() => {
//     if (!sourceId || !departmentId) return;

//     let cancelled = false;

//     (async () => {
//       setLoading(true);
//       setError(null);
//       const q = debouncedSearch;

//       try {
//         let data = [];

//         if (isMockSource) {
//           // Use data data (only id + name)
//           data = MOCK_PROVIDERS
//             .filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.id === q)
//             .map((p) => ({ id: p.id, name: p.name }));
//           await new Promise((res) => setTimeout(res, 2500));
//         } else {
//           // Real provider data
//           if (!q) {
//             const { providers: list } = await fetchProviders(sourceId, departmentId, backendCount, "", setLatestCurl);
//             data = list;
//           } else if (/^[0-9]+$/.test(q)) {
//             try {
//               const single = await fetchProviderByIdSimple(q, sourceId);
//               data = [single];
//             } catch {}
//           } else {
//             const { providers: byName } = await fetchProviders(sourceId, departmentId, backendCount, q, setLatestCurl);
//             data = byName;
//           }
//         }

//         if (!cancelled) {
//           setProviders(data);
//           setCurrentPage(1);
//           toast.success(`Found ${data.length} provider${data.length !== 1 ? "s" : ""}`);
//         }
//       } catch (err) {
//         if (!cancelled) {
//           setError(err?.message || "Failed to fetch providers");
//           setProviders([]);
//           toast.error(`Error: ${err?.message || "Failed to fetch providers"}`);
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     })();

//     return () => { cancelled = true; };
//   }, [sourceId, departmentId, debouncedSearch]);

//   const totalPages = Math.ceil(providers.length / rowsPerPage);
//   const paginatedProviders = providers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

//   return (
//     <div className="h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden">
//       {/* Header */}
//       <div className="flex-shrink-0 p-4 pb-1">
//         <div className="max-w-6xl mx-auto">
//           <div className="flex items-center gap-3 mb-2">
//             <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
//               <CalendarDays className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                 Scheduling Workflow Automation
//               </h1>
//               <p className="text-sm text-gray-600">Search and book appointments with healthcare providers</p>
//             </div>

//             {/* <Button
//               className="ml-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md flex items-center gap-2 text-sm px-3 py-2"
//               onClick={() => navigate("/notifications")}
//             >
//               <Bell className="w-4 h-4" /> Notifications
//             </Button> */}
//           </div>

//           <div className="relative max-w-2xl">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 h-5 w-5" />
//             <Input
//               type="text"
//               placeholder="Search by provider name or provider ID..."
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
//               {/* Stats */}
//               <div className="flex-shrink-0 flex items-center justify-between mb-2 p-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
//                 <div className="flex items-center gap-2 text-indigo-700">
//                   <Users className="w-4 h-4" />
//                   <span className="font-medium text-sm">
//                     {providers.length} provider{providers.length !== 1 ? "s" : ""} found
//                   </span>
//                 </div>
//                 {totalPages > 1 && (
//                   <span className="text-gray-600 text-xs">Page {currentPage} of {totalPages}</span>
//                 )}
//               </div>

//               {/* Main List */}
//               <div className="flex-1 overflow-hidden flex flex-col min-h-0" style={{ minHeight: '200px' }}>
//                 {loading ? (
//                   <div className="flex-1 flex justify-center items-center text-indigo-600">
//                     <Loader2 className="animate-spin h-6 w-6" />
//                   </div>
//                 ) : error ? (
//                   <div className="flex-shrink-0 p-3 bg-red-50 border border-red-200 rounded-xl mb-3">
//                     <p className="text-red-700 font-medium text-sm">⚠️ Error: {error}</p>
//                   </div>
//                 ) : paginatedProviders.length ? (
//                   <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-1 min-h-0">
//                     {paginatedProviders.map((p) => (
//                       <div key={p.id} className="group p-2.5 border border-gray-200/50 rounded-xl hover:border-indigo-200 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50/30 flex-shrink-0">
//                         <div className="flex justify-between items-start">
//                           <div className="flex-1">
//                             <div className="flex items-center gap-2 mb-1.5">
//                               <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
//                                 <Users className="w-4 h-4 text-indigo-600" />
//                               </div>
//                               <div>
//                                 <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">{p.name}</h3>
//                                 <p className="text-xs text-indigo-600 font-medium">ID: {p.id}</p>
//                               </div>
//                             </div>

//                             {!isMockSource && (
//                               <div className="space-y-1 text-xs text-gray-600 ml-10">
//                                 {p.email && <p className="flex items-center gap-2"><span className="text-gray-400">✉</span>{p.email}</p>}
//                                 {p.phone && <p className="flex items-center gap-2"><span className="text-gray-400">📞</span>{p.phone}</p>}
//                               </div>
//                             )}
//                           </div>
//                           <div className="flex gap-1.5 ml-3">
//                             <Button
//                               className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 flex items-center gap-1 text-xs px-2 py-1"
//                               onClick={() => {
//                                 navigate("/scheduling", {
//                                   state: { providerId: p.id, providerName: p.name, departmentId }
//                                 });
//                                 toast(`Opening schedule for ${p.name}`);
//                               }}
//                             >
//                               <Calendar className="w-3 h-3" /> View Schedule
//                             </Button>
//                             <Button
//                               className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg flex items-center gap-1 text-xs px-2 py-1"
//                               onClick={() => {
//                                 navigate("/scheduling/book", { state: { provider: p, departmentId } });
//                                 toast.success(`Starting booking with ${p.name}`);
//                               }}
//                             >
//                               Book Now <ArrowRight className="w-3 h-3" />
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="flex-1 flex items-center justify-center">
//                     <div className="text-center py-8">
//                       <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
//                         <Search className="w-6 h-6 text-gray-400" />
//                       </div>
//                       <h3 className="text-lg font-semibold text-gray-700 mb-2">No providers found</h3>
//                       <p className="text-sm text-gray-500 mb-3">Try adjusting your search criteria</p>
//                       {search && (
//                         <Button
//                           className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2 py-1"
//                           onClick={() => setSearch("")}
//                         >
//                           Clear Search
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <div className="flex-shrink-0 flex justify-between items-center pt-2 mt-2 border-t border-gray-200" style={{ minHeight: '40px' }}>
//                   <Button
//                     className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 flex items-center gap-1 text-xs px-2 py-1"
//                     disabled={currentPage === 1}
//                     onClick={() => setCurrentPage((p) => p - 1)}
//                   >
//                     ← Previous
//                   </Button>
//                   <div className="flex items-center gap-1">
//                     {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
//                       const pageNum = i + 1;
//                       return (
//                         <button
//                           key={pageNum}
//                           onClick={() => setCurrentPage(pageNum)}
//                           className={`w-6 h-6 rounded-lg transition-all text-xs ${
//                             currentPage === pageNum
//                               ? 'bg-indigo-600 text-white shadow-lg'
//                               : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
//                           }`}
//                         >
//                           {pageNum}
//                         </button>
//                       );
//                     })}
//                     {totalPages > 5 && <span className="text-gray-400 text-xs">...</span>}
//                   </div>
//                   <Button
//                     className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 flex items-center gap-1 text-xs px-2 py-1"
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

// FindAppointment.jsx
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../layouts/DashboardLayout";
import { fetchProviders, fetchProviderByIdSimple } from "../api/providers";
import toast from "react-hot-toast";
import { Loader2, Search, Users, Calendar, ArrowRight, CalendarDays } from "lucide-react";
import { MOCK_PROVIDERS } from "../data/providerListMock";
import BookAppointment from "./BookAppointment"; // Import BookAppointment


// ✅ Reusable Tailwind components
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

export default function FindAppointment() {
  const { sourceId, departmentId, setLatestCurl } = useContext(AppContext);
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const rowsPerPage = 10;
  const backendCount = 200;

  const isMockSource = ![import.meta.env.VITE_SOURCE_ID_ATHENA, import.meta.env.VITE_SOURCE_ID_ELATION].includes(sourceId);

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  // fetch providers
  useEffect(() => {
    if (!sourceId || !departmentId) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      const q = debouncedSearch;

      try {
        let data = [];

        if (isMockSource) {
          data = MOCK_PROVIDERS
            .filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.id === q)
            .map((p) => ({ id: p.id, name: p.name }));
          await new Promise((res) => setTimeout(res, 2500));
        } else {
          if (!q) {
            const { providers: list } = await fetchProviders(sourceId, departmentId, backendCount, "", setLatestCurl);
            data = list;
          } else if (/^[0-9]+$/.test(q)) {
            try {
              const single = await fetchProviderByIdSimple(q, sourceId);
              data = [single];
            } catch {}
          } else {
            const { providers: byName } = await fetchProviders(sourceId, departmentId, backendCount, q, setLatestCurl);
            data = byName;
          }
        }

        if (!cancelled) {
          setProviders(data);
          setCurrentPage(1);
          toast.success(`Found ${data.length} provider${data.length !== 1 ? "s" : ""}`);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Failed to fetch providers");
          setProviders([]);
          toast.error(`Error: ${err?.message || "Failed to fetch providers"}`);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [sourceId, departmentId, debouncedSearch]);

  const totalPages = Math.ceil(providers.length / rowsPerPage);
  const paginatedProviders = providers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const openBookingDrawer = (provider) => {
    setSelectedProvider(provider);
    setDrawerOpen(true);
    toast.success(`Starting booking with ${provider.name}`);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedProvider(null);
  };

  return (
    <div className="relative h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 pb-1">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Scheduling Workflow Automation
              </h1>
              <p className="text-sm text-gray-600">Search and book appointments with healthcare providers</p>
            </div>
          </div>

          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search by provider name or provider ID..."
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

      {/* Content */}
      <div className="flex-1 px-4 pb-2 overflow-hidden min-h-0">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden max-h-[500px]">
            <div className="flex-1 flex flex-col p-3 overflow-hidden min-h-0">
              {/* Stats */}
              <div className="flex-shrink-0 flex items-center justify-between mb-2 p-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-2 text-indigo-700">
                  <Users className="w-4 h-4" />
                  <span className="font-medium text-sm">
                    {providers.length} provider{providers.length !== 1 ? "s" : ""} found
                  </span>
                </div>
                {totalPages > 1 && (
                  <span className="text-gray-600 text-xs">Page {currentPage} of {totalPages}</span>
                )}
              </div>

              {/* Main List */}
              <div className="flex-1 overflow-hidden flex flex-col min-h-0" style={{ minHeight: '200px' }}>
                {loading ? (
                  <div className="flex-1 flex justify-center items-center text-indigo-600">
                    <Loader2 className="animate-spin h-6 w-6" />
                  </div>
                ) : error ? (
                  <div className="flex-shrink-0 p-3 bg-red-50 border border-red-200 rounded-xl mb-3">
                    <p className="text-red-700 font-medium text-sm">⚠️ Error: {error}</p>
                  </div>
                ) : paginatedProviders.length ? (
                  <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-1 min-h-0">
                    {paginatedProviders.map((p) => (
                      <div key={p.id} className="group p-2.5 border border-gray-200/50 rounded-xl hover:border-indigo-200 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50/30 flex-shrink-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                                <Users className="w-4 h-4 text-indigo-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">{p.name}</h3>
                                <p className="text-xs text-indigo-600 font-medium">ID: {p.id}</p>
                              </div>
                            </div>

                            {!isMockSource && (
                              <div className="space-y-1 text-xs text-gray-600 ml-10">
                                {p.email && <p className="flex items-center gap-2"><span className="text-gray-400">✉</span>{p.email}</p>}
                                {p.phone && <p className="flex items-center gap-2"><span className="text-gray-400">📞</span>{p.phone}</p>}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1.5 ml-3">
                            <Button
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 flex items-center gap-1 text-xs px-2 py-1"
                              onClick={() => {
                                navigate("/scheduling", {
                                  state: { providerId: p.id, providerName: p.name, departmentId }
                                });
                                toast(`Opening schedule for ${p.name}`);
                              }}
                            >
                              <Calendar className="w-3 h-3" /> View Schedule
                            </Button>
                            <Button
                              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg flex items-center gap-1 text-xs px-2 py-1"
                              onClick={() => openBookingDrawer(p)}
                            >
                              Book Now <ArrowRight className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No providers found</h3>
                      <p className="text-sm text-gray-500 mb-3">Try adjusting your search criteria</p>
                      {search && (
                        <Button
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2 py-1"
                          onClick={() => setSearch("")}
                        >
                          Clear Search
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex-shrink-0 flex justify-between items-center pt-2 mt-2 border-t border-gray-200" style={{ minHeight: '40px' }}>
                  <Button
                    className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 flex items-center gap-1 text-xs px-2 py-1"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    ← Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-6 h-6 rounded-lg transition-all text-xs ${
                            currentPage === pageNum
                              ? 'bg-indigo-600 text-white shadow-lg'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 5 && <span className="text-gray-400 text-xs">...</span>}
                  </div>
                  <Button
                    className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 flex items-center gap-1 text-xs px-2 py-1"
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

      {/* Drawer backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-lg font-semibold">Book Appointment</h2>
          <button onClick={closeDrawer} className="text-gray-600 hover:text-gray-900 text-2xl font-bold leading-none select-none">
            &times;
          </button>
        </div>

        {/* Render BookAppointment with selectedProvider and departmentId */}
        {selectedProvider && (
          <BookAppointment provider={selectedProvider} departmentId={departmentId} />
        )}
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
