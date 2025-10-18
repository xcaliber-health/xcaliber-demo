// import { useEffect, useState, useContext } from "react";
// import { useParams } from "react-router-dom";
// import { fetchClaimById } from "../api/claims";
// import { AppContext } from "../layouts/DashboardLayout";
// import { Loader2, Check } from "lucide-react";
// import toast from "react-hot-toast";
// import { ECW_MOCK_CLAIMS } from "../data/claimsMock";

// // Reusable Card
// function Card({ children }) {
//   return <div className="bg-white shadow rounded-2xl p-6 mb-6">{children}</div>;
// }

// // Reusable Badge for status
// function Badge({ status }) {
//   const colors = {
//     active: "bg-green-100 text-green-700",
//     pending: "bg-yellow-100 text-yellow-700",
//     denied: "bg-red-100 text-red-700",
//     default: "bg-gray-100 text-gray-700",
//   };
//   return (
//     <span
//       className={`px-2 py-1 rounded-full text-xs font-medium ${
//         colors[status] || colors.default
//       }`}
//     >
//       {status.toUpperCase() || "N/A"}
//     </span>
//   );
// }

// // Extract ID from reference string
// const getIdFromReference = (ref) => ref?.split("/")[1] || "N/A";

// // Normalize data claim to Athena-like structure
// const normalizeMockClaim = (entry) => {
//   const res = entry.resource;
//   return {
//     id: res.id,
//     status: res.status,
//     created: res.created,
//     billableEnd: res.billablePeriod?.end,
//     provider: res.provider?.reference || res.provider?.display || "N/A",
//     priority: res.priority?.coding?.[0]?.display || "N/A",
//     totalBilled: res.total?.value || 0,
//     patient: res.patient?.reference || res.patient?.display || "N/A",
//     insurance:
//       res.insurance?.map((i) => ({
//         reference: i.coverage?.reference || "N/A",
//         packageId:
//           i.coverage?.extension?.find((e) => e.url.includes("package-id"))
//             ?.valueString || null,
//         status:
//           i.coverage?.extension?.find((e) => e.url.includes("status"))
//             ?.valueString || null,
//       })) || [],
//     diagnosis:
//       res.diagnosis?.map((d) => ({
//         code: d.diagnosisCodeableConcept?.coding?.[0]?.code || "N/A",
//         display: d.diagnosisCodeableConcept?.coding?.[0]?.display || "N/A",
//         type: d.type?.[0]?.text || "N/A",
//       })) || [],
//     procedures:
//       res.procedure?.map((p) => ({
//         code: p.procedureCodeableConcept?.coding?.[0]?.code || "N/A",
//         display: p.procedureCodeableConcept?.coding?.[0]?.display || "N/A",
//         amount:
//           parseFloat(
//             p.extension?.find((e) => e.url.includes("amount"))?.valueString || 0
//           ) || 0,
//         txnId:
//           p.extension?.find((e) => e.url.includes("transaction-id"))
//             ?.valueString || "N/A",
//       })) || [],
//   };
// };

// export default function ClaimDetail() {
//   const { id } = useParams();
//   const { ehr, sourceId, departmentId } = useContext(AppContext);

//   const patientId =
//     ehr === "Athena"
//       ? import.meta.env.VITE_ATHENA_PATIENT_ID
//       : import.meta.env.VITE_ELATION_PATIENT_ID;

//   const [claim, setClaim] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [authorizing, setAuthorizing] = useState(false);
//   const [authorized, setAuthorized] = useState(false);

//   const isMockSource =
//     sourceId !== import.meta.env.VITE_SOURCE_ID_ATHENA &&
//     sourceId !== import.meta.env.VITE_SOURCE_ID_ELATION;

//   useEffect(() => {
//     if (!sourceId || !patientId || !departmentId) return;

//     let cancelled = false;

//     (async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         let data = null;

//         if (isMockSource) {
//           await new Promise((r) => setTimeout(r, 1500)); // simulate delay
//           const entry = ECW_MOCK_CLAIMS.entry.find((e) => e.resource.id === id);
//           if (!entry) throw new Error("Claim not found in data data");
//           data = normalizeMockClaim(entry);
//         } else {
//           data = await fetchClaimById(id, sourceId, patientId, departmentId);
//         }

//         if (!cancelled) {
//           setClaim(data);
//           toast.success(`Claim #${id} loaded successfully!`);
//         }
//       } catch (err) {
//         if (!cancelled) {
//           setError(err.message || "Failed to load claim");
//           toast.error(
//             `Failed to load claim: ${err.message || "Unknown error"}`
//           );
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [id, sourceId, patientId, departmentId]);

//   const formatCurrency = (val) =>
//     val
//       ? new Intl.NumberFormat("en-US", {
//           style: "currency",
//           currency: "USD",
//         }).format(val)
//       : "-";

//   if (loading)
//     return (
//       <div className="flex justify-center items-center p-10">
//         <Loader2 className="animate-spin h-6 w-6 mr-2 text-blue-500" />
//         Loading claim...
//       </div>
//     );

//   if (error)
//     return <div className="p-6 text-red-500 text-center">Error: {error}</div>;
//   if (!claim) return <div className="p-6 text-center">No claim found.</div>;

//   const totalBilled = claim.procedures?.reduce(
//     (sum, p) => sum + (p.amount || 0),
//     0
//   );

//   const handleAuthorize = async () => {
//     if (authorized) return; // Prevent multiple clicks

//     setAuthorizing(true);

//     // Simulate authorization delay
//     await new Promise((resolve) => setTimeout(resolve, 2000));

//     setAuthorizing(false);
//     setAuthorized(true);
//     toast.success("Claim authorized successfully!");
//   };

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen space-y-6">
//       {/* Claim Header */}
//       <Card>
//         <div className="grid grid-cols-1 lg:grid-cols-[minmax(640px,1fr)_20rem] gap-6 items-start">
//           {/* Main Claim Details (left) */}
//           <div>
//             <div className="flex items-center justify-between mb-4">
//               <h1 className="text-2xl font-bold">Claim #{claim.id}</h1>
//               <button
//                 onClick={handleAuthorize}
//                 disabled={authorizing || authorized}
//                 className={`font-semibold py-2 px-6 rounded-lg transition-all duration-300 shadow-md ${
//                   authorized
//                     ? "bg-green-600 text-white cursor-default"
//                     : authorizing
//                     ? "bg-yellow-500 text-white cursor-not-allowed"
//                     : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
//                 }`}
//               >
//                 {authorized ? (
//                   <div className="flex items-center">
//                     <Check className="w-4 h-4 mr-2" />
//                     Authorized
//                   </div>
//                 ) : authorizing ? (
//                   <div className="flex items-center">
//                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     Authorizing...
//                   </div>
//                 ) : (
//                   "Authorize"
//                 )}
//               </button>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-600 font-medium">
//                     Status
//                   </span>
//                   <Badge status={claim.status?.toLowerCase()} />
//                 </div>
//               </div>

//               <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                 <div className="flex flex-col">
//                   <span className="text-sm text-gray-600 font-medium mb-1">
//                     Date Created
//                   </span>
//                   <span className="text-base font-semibold text-gray-900">
//                     {claim.created || "N/A"}
//                   </span>
//                 </div>
//               </div>

//               <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                 <div className="flex flex-col">
//                   <span className="text-sm text-gray-600 font-medium mb-1">
//                     Billable End
//                   </span>
//                   <span className="text-base font-semibold text-gray-900">
//                     {claim.billableEnd || "N/A"}
//                   </span>
//                 </div>
//               </div>

//               <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                 <div className="flex flex-col">
//                   <span className="text-sm text-gray-600 font-medium mb-1">
//                     Provider
//                   </span>
//                   <span className="text-base font-semibold text-gray-900">
//                     {getIdFromReference(claim.provider)}
//                   </span>
//                 </div>
//               </div>

//               <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                 <div className="flex flex-col">
//                   <span className="text-sm text-gray-600 font-medium mb-1">
//                     Priority
//                   </span>
//                   <span className="text-base font-semibold text-gray-900">
//                     {claim.priority || "N/A"}
//                   </span>
//                 </div>
//               </div>

//               <div className="bg-gray-50 rounded-lg p-4 border border-green-200">
//                 <div className="flex flex-col">
//                   <span className="text-sm text-gray-600 font-medium mb-1">
//                     Total Billed
//                   </span>
//                   <span className="text-lg font-bold text-gray-900">
//                     {formatCurrency(totalBilled)}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Patient Coverage Sub-section (right) */}
//           <div className="lg:w-auto">
//             <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
//               <h2 className="text-lg font-semibold mb-3 text-blue-900">
//                 Patient & Coverage
//               </h2>

//               <div className="space-y-3">
//                 <div className="bg-white rounded-lg p-3 shadow-sm">
//                   <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
//                     Patient
//                   </p>
//                   <p className="font-semibold text-gray-900">
//                     {getIdFromReference(claim.patient)}
//                   </p>
//                 </div>

//                 {claim.insurance?.map((ins, idx) => (
//                   <div key={idx} className="bg-white rounded-lg p-3 shadow-sm">
//                     <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
//                       Coverage
//                     </p>
//                     {/* {ins.status && (
//                       <div className="mb-2">
//                         <div className="rounded-md bg-blue-100 border border-blue-300 px-3 py-2 flex items-center">
//                           <span className="text-xs font-semibold text-blue-800 tracking-wide uppercase">Status:</span>
//                           <span className="ml-2 text-sm font-medium text-blue-900">{ins.status}</span>
//                         </div>
//                       </div>
//                     )} */}
//                     <p className="font-semibold text-gray-900 mb-2">
//                       {getIdFromReference(ins.reference)}
//                     </p>

//                     {ins.packageId && (
//                       <div className="mb-2">
//                         <p className="text-xs text-gray-500 uppercase tracking-wide">
//                           Package ID
//                         </p>
//                         <p className="text-sm text-gray-700">{ins.packageId}</p>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </Card>

//       {/* Diagnosis Table */}
//       {claim.diagnosis?.length > 0 && (
//         <Card>
//           <h2 className="text-xl font-semibold mb-4">Diagnosis</h2>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
//               <thead className="bg-blue-100 text-left text-gray-700 uppercase">
//                 <tr>
//                   <th className="p-3">Code</th>
//                   <th className="p-3">Description</th>
//                   <th className="p-3">Type</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {claim.diagnosis.map((d, idx) => (
//                   <tr
//                     key={idx}
//                     className="hover:bg-blue-50 border-b border-gray-200"
//                   >
//                     <td className="p-3 font-medium">{d.code}</td>
//                     <td className="p-3">{d.display}</td>
//                     <td className="p-3">{d.type}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       )}

//       {/* Procedures Table */}
//       {claim.procedures?.length > 0 && (
//         <Card>
//           <h2 className="text-xl font-semibold mb-4">Procedures</h2>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
//               <thead className="bg-blue-100 text-left text-gray-700 uppercase">
//                 <tr>
//                   <th className="p-3">Code</th>
//                   <th className="p-3">Description</th>
//                   <th className="p-3">Amount</th>
//                   <th className="p-3">Transaction ID</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {claim.procedures.map((p, idx) => (
//                   <tr
//                     key={idx}
//                     className="hover:bg-blue-50 border-b border-gray-200"
//                   >
//                     <td className="p-3 font-medium">{p.code}</td>
//                     <td className="p-3">{p.display}</td>
//                     <td className="p-3">{formatCurrency(p.amount)}</td>
//                     <td className="p-3">{p.txnId}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       )}
//     </div>
//   );
// }
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../layouts/DashboardLayout";
import { Loader2, Check } from "lucide-react";
import toast from "react-hot-toast";
import { ECW_MOCK_CLAIMS } from "../data/claimsMock";

// Reusable Card
function Card({ children }) {
  return <div className="bg-white shadow rounded-2xl p-6 mb-6">{children}</div>;
}

// Reusable Badge for status
function Badge({ status }) {
  const colors = {
    active: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    denied: "bg-red-100 text-red-700",
    default: "bg-gray-100 text-gray-700",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        colors[status] || colors.default
      }`}
    >
      {status.toUpperCase() || "N/A"}
    </span>
  );
}

// Extract ID from reference string
const getIdFromReference = (ref) => ref?.split("/")[1] || "N/A";

// Normalize data claim to Athena-like structure
const normalizeMockClaim = (entry) => {
  const res = entry.resource;
  return {
    id: res.id,
    status: res.status,
    created: res.created,
    billableEnd: res.billablePeriod?.end,
    provider: res.provider?.reference || res.provider?.display || "N/A",
    priority: res.priority?.coding?.[0]?.display || "N/A",
    totalBilled: res.total?.value || 0,
    patient: res.patient?.reference || res.patient?.display || "N/A",
    insurance:
      res.insurance?.map((i) => ({
        reference: i.coverage?.reference || "N/A",
        packageId:
          i.coverage?.extension?.find((e) => e.url.includes("package-id"))
            ?.valueString || null,
        status:
          i.coverage?.extension?.find((e) => e.url.includes("status"))
            ?.valueString || null,
      })) || [],
    diagnosis:
      res.diagnosis?.map((d) => ({
        code: d.diagnosisCodeableConcept?.coding?.[0]?.code || "N/A",
        display: d.diagnosisCodeableConcept?.coding?.[0]?.display || "N/A",
        type: d.type?.[0]?.text || "N/A",
      })) || [],
    procedures:
      res.procedure?.map((p) => ({
        code: p.procedureCodeableConcept?.coding?.[0]?.code || "N/A",
        display: p.procedureCodeableConcept?.coding?.[0]?.display || "N/A",
        amount:
          parseFloat(
            p.extension?.find((e) => e.url.includes("amount"))?.valueString || 0
          ) || 0,
        txnId:
          p.extension?.find((e) => e.url.includes("transaction-id"))
            ?.valueString || "N/A",
      })) || [],
  };
};

export default function ClaimDetail() {
  const { id } = useParams();
  const { ehr, sourceId, departmentId } = useContext(AppContext);

  const patientId =
    ehr === "Athena"
      ? import.meta.env.VITE_ATHENA_PATIENT_ID
      : import.meta.env.VITE_ELATION_PATIENT_ID;

  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authorizing, setAuthorizing] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  // ✅ Always use mock data for all sources
  useEffect(() => {
    if (!patientId || !departmentId) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        // Always use ECW mock data
        await new Promise((r) => setTimeout(r, 1500)); // simulate delay
        const entry = ECW_MOCK_CLAIMS.entry.find((e) => e.resource.id === id);
        if (!entry) throw new Error("Claim not found in mock data");
        const data = normalizeMockClaim(entry);

        if (!cancelled) {
          setClaim(data);
          toast.success(`Claim #${id} loaded successfully!`);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load claim");
          toast.error(`Failed to load claim: ${err.message || "Unknown error"}`);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, patientId, departmentId]);

  const formatCurrency = (val) =>
    val
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(val)
      : "-";

  if (loading)
    return (
      <div className="flex justify-center items-center p-10">
        <Loader2 className="animate-spin h-6 w-6 mr-2 text-blue-500" />
        Loading claim...
      </div>
    );

  if (error)
    return <div className="p-6 text-red-500 text-center">Error: {error}</div>;
  if (!claim) return <div className="p-6 text-center">No claim found.</div>;

  const totalBilled = claim.procedures?.reduce(
    (sum, p) => sum + (p.amount || 0),
    0
  );

  const handleAuthorize = async () => {
    if (authorized) return;

    setAuthorizing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setAuthorizing(false);
    setAuthorized(true);
    toast.success("Claim authorized successfully!");
  };

  return (
    <div className="p-8 bg-gray-50 h-full space-y-6">
      {/* Claim Header */}
      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(640px,1fr)_20rem] gap-6 items-start">
          {/* Main Claim Details (left) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Claim #{claim.id}</h1>
              <button
                onClick={handleAuthorize}
                disabled={authorizing || authorized}
                className={`font-semibold py-2 px-6 rounded-lg transition-all duration-300 shadow-md ${
                  authorized
                    ? "bg-green-600 text-white cursor-default"
                    : authorizing
                    ? "bg-yellow-500 text-white cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
                }`}
              >
                {authorized ? (
                  <div className="flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    Authorized
                  </div>
                ) : authorizing ? (
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Authorizing...
                  </div>
                ) : (
                  "Authorize"
                )}
              </button>
            </div>

            {/* Claim Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-medium">
                    Status
                  </span>
                  <Badge status={claim.status?.toLowerCase()} />
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 font-medium mb-1">
                    Date Created
                  </span>
                  <span className="text-base font-semibold text-gray-900">
                    {claim.created || "N/A"}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 font-medium mb-1">
                    Billable End
                  </span>
                  <span className="text-base font-semibold text-gray-900">
                    {claim.billableEnd || "N/A"}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 font-medium mb-1">
                    Provider
                  </span>
                  <span className="text-base font-semibold text-gray-900">
                    {getIdFromReference(claim.provider)}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 font-medium mb-1">
                    Priority
                  </span>
                  <span className="text-base font-semibold text-gray-900">
                    {claim.priority || "N/A"}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-green-200">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 font-medium mb-1">
                    Total Billed
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(totalBilled)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Coverage (right) */}
          <div className="lg:w-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-3 text-blue-900">
                Patient & Coverage
              </h2>

              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Patient
                  </p>
                  <p className="font-semibold text-gray-900">
                    {getIdFromReference(claim.patient)}
                  </p>
                </div>

                {claim.insurance?.map((ins, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-3 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Coverage
                    </p>
                    <p className="font-semibold text-gray-900 mb-2">
                      {getIdFromReference(ins.reference)}
                    </p>
                    {ins.packageId && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Package ID
                        </p>
                        <p className="text-sm text-gray-700">{ins.packageId}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Diagnosis Table */}
      {claim.diagnosis?.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold mb-4">Diagnosis</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-blue-100 text-left text-gray-700 uppercase">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Type</th>
                </tr>
              </thead>
              <tbody>
                {claim.diagnosis.map((d, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-blue-50 border-b border-gray-200"
                  >
                    <td className="p-3 font-medium">{d.code}</td>
                    <td className="p-3">{d.display}</td>
                    <td className="p-3">{d.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Procedures Table */}
      {claim.procedures?.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold mb-4">Procedures</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-blue-100 text-left text-gray-700 uppercase">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {claim.procedures.map((p, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-blue-50 border-b border-gray-200"
                  >
                    <td className="p-3 font-medium">{p.code}</td>
                    <td className="p-3">{p.display}</td>
                    <td className="p-3">{formatCurrency(p.amount)}</td>
                    <td className="p-3">{p.txnId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
