// import React, { useEffect, useState, useContext } from "react";
// import { AppContext } from "../layouts/DashboardLayout";
// import { fetchProvidersDirectory } from "../api/providers";
// import { Loader2, Search, Users } from "lucide-react";
// import toast from "react-hot-toast";

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

// function Input({ className = "", ...props }) {
//   return (
//     <input
//       {...props}
//       className={`border-2 border-gray-200/50 py-3 px-12 rounded-2xl w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 outline-none bg-white/80 backdrop-blur-sm transition-all duration-200 placeholder:text-gray-400 ${className}`}
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

// export default function ProviderDirectory() {
//   const { sourceId, departmentId,setLatestCurl } = useContext(AppContext);
//   const [providers, setProviders] = useState([]);
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState(search);
//   const [loading, setLoading] = useState(false);

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6;

//   // 🔹 Debounce logic
//   useEffect(() => {
//     const handler = setTimeout(() => setDebouncedSearch(search), 400);
//     return () => clearTimeout(handler);
//   }, [search]);

//   // 🔹 Fetch providers whenever debouncedSearch changes
//   useEffect(() => {
//     if (!sourceId || !departmentId) return;

//     setLoading(true);
//     const isProviderId = /^\d+$/.test(debouncedSearch);
//     const name = isProviderId ? "" : debouncedSearch;
//     const providerId = isProviderId ? debouncedSearch : "";

//     fetchProvidersDirectory(sourceId, departmentId, name, providerId,setLatestCurl)
//       .then(({ providers }) => {
//         setProviders(providers);
//         toast.success("Providers loaded successfully");
//       })
//       .catch((err) => {
//         console.error("Error fetching providers:", err);
//         toast.error("Failed to load providers");
//       })
//       .finally(() => setLoading(false));
//   }, [debouncedSearch, sourceId, departmentId]);

//   const totalPages = Math.ceil(providers.length / itemsPerPage) || 1;
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const currentProviders = providers.slice(startIndex, startIndex + itemsPerPage);

//   useEffect(() => setCurrentPage(1), [debouncedSearch]);

//   return (
//     <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden">
//       <div className="flex-shrink-0 p-4 pb-1">
//         <div className="max-w-6xl mx-auto">
//           {/* Header */}
//           <div className="flex items-center gap-3 mb-4">
//             <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
//               <Users className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                 Provider Directory
//               </h1>
//               <p className="text-sm text-gray-600">Search and browse providers</p>
//             </div>
//           </div>

//           {/* Search */}
//           <div className="relative max-w-2xl mb-6">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 h-5 w-5" />
//             <Input
//               type="text"
//               placeholder="Search by name or Provider ID..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="pl-12 shadow-lg py-2.5"
//             />
//             {search && loading && (
//               <div className="absolute right-4 top-1/2 -translate-y-1/2">
//                 <Loader2 className="w-2.5 h-2.5 text-indigo-500 animate-spin" />
//               </div>
//             )}
//           </div>

//           {/* Providers wrapped in one big card */}
//           <Card className="p-6">
//             {loading ? (
//               <div className="flex justify-center items-center py-10 text-indigo-600">
//                 <Loader2 className="animate-spin h-6 w-6 mr-2" />
//                 Loading providers...
//               </div>
//             ) : currentProviders.length ? (
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {currentProviders.map((p) => (
//                   <div
//                     key={p.id}
//                     className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-lg transition flex flex-col h-full"
//                   >
//                     <h3 className="text-lg font-semibold mb-1 text-gray-800">{p.name}</h3>
//                     <p className="text-sm text-gray-500 mb-1">Provider ID: {p.identifier || "—"}</p>
//                     <p className="text-sm text-gray-500 mb-3">NPI: {p.npi || "—"}</p>
//                     <div className="space-y-1 text-sm text-gray-700 flex-grow">
//                       {p.specialty && <p><strong>Specialty:</strong> {p.specialty}</p>}
//                       {p.providerType && <p><strong>Type:</strong> {p.providerType}</p>}
//                       {p.phone && <p><strong>Phone:</strong> {p.phone}</p>}
//                       {p.email && <p><strong>Email:</strong> {p.email}</p>}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-10 text-gray-500">
//                 <p className="text-lg font-medium">No providers found</p>
//                 <p className="text-sm">Try adjusting your search</p>
//               </div>
//             )}

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex justify-center mt-6 space-x-4">
//                 <Button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
//                   ← Prev
//                 </Button>
//                 <span className="px-4 py-2 text-gray-600 text-sm">
//                   Page {currentPage} of {totalPages}
//                 </span>
//                 <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
//                   Next →
//                 </Button>
//               </div>
//             )}
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../layouts/DashboardLayout";
import { fetchProvidersDirectory } from "../api/providers";
import { Loader2, Search, Users } from "lucide-react";
import toast from "react-hot-toast";
import { MOCK_PROVIDERS } from "../data/providerListMock"; // create a data file similar to ECW_MOCK_PATIENTS

// -------------------- Reusable Tailwind Components --------------------
function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white/95 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 ${className}`}
    >
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

// -------------------- ProviderDirectory Component --------------------
export default function ProviderDirectory() {
  const { ehr, sourceId, departmentId, setLatestCurl } = useContext(AppContext);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(providers.length / itemsPerPage);
  const paginatedProviders = providers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Determine if source should use data data
  const isMockSource =
    sourceId !== import.meta.env.VITE_SOURCE_ID_ATHENA &&
    sourceId !== import.meta.env.VITE_SOURCE_ID_ELATION;

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch providers
  useEffect(() => {
    if (!sourceId || !departmentId) return;

    setLoading(true);
    setProviders([]);
    setCurrentPage(1);

    const loadProviders = async () => {
      try {
        let data = [];

        if (isMockSource) {
          // Use data providers
          data = MOCK_PROVIDERS.map((p) => ({
            id: p.id,
            name: p.name,
            identifier: p.identifier,
            npi: p.npi,
            specialty: p.specialty,
            providerType: p.providerType,
            phone: p.phone,
            email: p.email,
          }));
          await new Promise((resolve) => setTimeout(resolve, 3000)); // simulate network delay
        } else {
          // Fetch real providers
          const res = await fetchProvidersDirectory(
            sourceId,
            departmentId,
            debouncedSearch,
            "",
            setLatestCurl
          );
          data = res.providers.map((p) => ({
            id: p.id,
            name: p.name,
            identifier: p.identifier,
            npi: p.npi,
            specialty: p.specialty,
            providerType: p.providerType,
            phone: p.phone,
            email: p.email,
          }));
        }

        setProviders(data);
        data.length
          ? toast.success(`Loaded ${data.length} provider(s)`)
          : toast("No providers found", { icon: "ℹ️" });
      } catch (err) {
        toast.error(err?.message || "Failed to fetch providers");
      } finally {
        setLoading(false);
      }
    };

    loadProviders();
  }, [sourceId, departmentId, ehr, debouncedSearch]);

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-4 pb-1">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Provider Directory
              </h1>
              <p className="text-sm text-gray-600">
                Search and browse providers
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search by name or Provider ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 shadow-lg py-2.5"
            />
            {search && loading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="w-2.5 h-2.5 text-indigo-500 animate-spin" />
              </div>
            )}
          </div>

          {/* Providers */}
          <Card className="p-6">
            {loading ? (
             <div className="flex justify-center items-center flex-1 text-indigo-600 min-h-[400px]">
                <Loader2 className="animate-spin h-6 w-6 mr-2" />
                Loading providers...
              </div>
            ) : paginatedProviders.length ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProviders.map((p) => (
                  <div
                    key={p.id}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-lg transition flex flex-col h-full"
                  >
                    <h3 className="text-lg font-semibold mb-1 text-gray-800">
                      {p.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                      Provider ID: {p.identifier || "—"}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      NPI: {p.npi || "—"}
                    </p>
                    <div className="space-y-1 text-sm text-gray-700 flex-grow">
                      {p.specialty && (
                        <p>
                          <strong>Specialty:</strong> {p.specialty}
                        </p>
                      )}
                      {p.providerType && (
                        <p>
                          <strong>Type:</strong> {p.providerType}
                        </p>
                      )}
                      {p.phone && (
                        <p>
                          <strong>Phone:</strong> {p.phone}
                        </p>
                      )}
                      {p.email && (
                        <p>
                          <strong>Email:</strong> {p.email}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p className="text-lg font-medium">No providers found</p>
                <p className="text-sm">Try adjusting your search</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 space-x-4">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  ← Prev
                </Button>
                <span className="px-4 py-2 text-gray-600 text-sm">
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
          </Card>
        </div>
      </div>
    </div>
  );
}
