
// import { useEffect, useState, useContext } from "react";
// import { useParams } from "react-router-dom";
// import { fetchClaimById } from "../api/claims";
// import { AppContext } from "../layouts/DashboardLayout";
// import { Loader2 } from "lucide-react";
// import toast from "react-hot-toast";

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
//     <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.default}`}>
//       {status || "N/A"}
//     </span>
//   );
// }

// // Extract ID from reference string
// const getIdFromReference = (ref) => ref?.split("/")[1] || "N/A";

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

//   useEffect(() => {
//     if (!sourceId || !patientId || !departmentId) return;

//     setLoading(true);
//     setError(null);

//     fetchClaimById(id, sourceId, patientId, departmentId)
//       .then((data) => {
//         setClaim(data);
//         toast.success(`Claim #${id} loaded successfully!`);
//       })
//       .catch((err) => {
//         setError(err.message);
//         toast.error(`Failed to load claim: ${err.message}`);
//       })
//       .finally(() => setLoading(false));
//   }, [id, sourceId, patientId, departmentId]);

//   const formatCurrency = (val) =>
//     val
//       ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val)
//       : "-";

//   // Calculate total billed dynamically from procedures
//   const totalBilled = claim?.procedures?.reduce((sum, p) => sum + (p.amount || 0), 0);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center p-10">
//         <Loader2 className="animate-spin h-6 w-6 mr-2 text-blue-500" />
//         Loading claim...
//       </div>
//     );

//   if (error) return <div className="p-6 text-red-500 text-center">Error: {error}</div>;
//   if (!claim) return <div className="p-6 text-center">No claim found.</div>;

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen space-y-6">
//       {/* Claim Header */}
//       <Card>
//         <h1 className="text-2xl font-bold mb-4">Claim #{claim.id}</h1>
//         <div className="grid md:grid-cols-2 gap-4">
//           <p><strong>Status:</strong> <Badge status={claim.status?.toLowerCase()} /></p>
//           <p><strong>Date Created:</strong> {claim.created || "N/A"}</p>
//           <p><strong>Billable End:</strong> {claim.billableEnd || "N/A"}</p>
//           <p><strong>Provider:</strong> {getIdFromReference(claim.provider)}</p>
//           <p><strong>Priority:</strong> {claim.priority || "N/A"}</p>
//           <p><strong>Total Billed:</strong> {formatCurrency(totalBilled)}</p>
//         </div>
//       </Card>

//       {/* Patient & Coverage */}
//       <Card>
//         <h2 className="text-xl font-semibold mb-4">Patient & Coverage</h2>

//         {/* Patient Info */}
//         <div className="mb-4">
//           <p><strong>Patient:</strong> {getIdFromReference(claim.patient)}</p>
//         </div>

//         {/* Insurance Entries */}
//         {claim.insurance.map((ins, idx) => (
//           <div key={idx} className="mb-4 border-t pt-2">
//             <p><strong>Coverage:</strong> {getIdFromReference(ins.reference)}</p>
//             {ins.packageId && <p><strong>Package ID:</strong> {ins.packageId}</p>}
//             {ins.status && <p><strong>Status:</strong> {ins.status}</p>}
//           </div>
//         ))}
//       </Card>

//       {/* Diagnosis Table */}
//       {claim.diagnosis.length > 0 && (
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
//                   <tr key={idx} className="hover:bg-blue-50 border-b border-gray-200">
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
//       {claim.procedures.length > 0 && (
//         <Card>
//           <h2 className="text-xl font-semibold mb-4">Procedures</h2>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
//               <thead className="bg-green-100 text-left text-gray-700 uppercase">
//                 <tr>
//                   <th className="p-3">Code</th>
//                   <th className="p-3">Description</th>
//                   <th className="p-3">Amount</th>
//                   <th className="p-3">Transaction ID</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {claim.procedures.map((p, idx) => (
//                   <tr key={idx} className="hover:bg-green-50 border-b border-gray-200">
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

      

//       {/* Elation Services */}
//       {ehr === "Elation" && claim.items?.length > 0 && (
//         <Card>
//           <h2 className="text-xl font-semibold mb-4">Services</h2>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
//               <thead className="bg-yellow-100 text-left text-gray-700 uppercase">
//                 <tr>
//                   <th className="p-3">Code</th>
//                   <th className="p-3">Description</th>
//                   <th className="p-3">Qty</th>
//                   <th className="p-3">Price</th>
//                   <th className="p-3">Paid</th>
//                   <th className="p-3">Copay</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {claim.items.map((i, idx) => (
//                   <tr key={idx} className="hover:bg-yellow-50 border-b border-gray-200">
//                     <td className="p-3 font-medium">{i.code}</td>
//                     <td className="p-3">{i.description}</td>
//                     <td className="p-3">{i.quantity}</td>
//                     <td className="p-3">{formatCurrency(i.unitPrice)}</td>
//                     <td className="p-3">{i.paid ? formatCurrency(i.paid) : "-"}</td>
//                     <td className="p-3">{i.copay ? formatCurrency(i.copay) : "-"}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       )}

//       {/* Elation Adjudication */}
//       {ehr === "Elation" && claim.response && (
//         <Card>
//           <h2 className="text-xl font-semibold mb-4">Adjudication</h2>
//           <p><strong>Outcome:</strong> {claim.response.outcome || "N/A"}</p>
//           <p><strong>Notes:</strong> {claim.response.disposition || "N/A"}</p>
//         </Card>
//       )}
//     </div>
//   );
// }
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { fetchClaimById } from "../api/claims";
import { AppContext } from "../layouts/DashboardLayout";
import { Loader2 } from "lucide-react";
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
      {status || "N/A"}
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
    insurance: res.insurance?.map((i) => ({
      reference: i.coverage?.reference || "N/A",
      packageId:
        i.coverage?.extension?.find((e) =>
          e.url.includes("package-id")
        )?.valueString || null,
      status:
        i.coverage?.extension?.find((e) =>
          e.url.includes("status")
        )?.valueString || null,
    })) || [],
    diagnosis: res.diagnosis?.map((d) => ({
      code: d.diagnosisCodeableConcept?.coding?.[0]?.code || "N/A",
      display: d.diagnosisCodeableConcept?.coding?.[0]?.display || "N/A",
      type: d.type?.[0]?.text || "N/A",
    })) || [],
    procedures: res.procedure?.map((p) => ({
      code: p.procedureCodeableConcept?.coding?.[0]?.code || "N/A",
      display: p.procedureCodeableConcept?.coding?.[0]?.display || "N/A",
      amount:
        parseFloat(
          p.extension?.find((e) =>
            e.url.includes("amount")
          )?.valueString || 0
        ) || 0,
      txnId:
        p.extension?.find((e) =>
          e.url.includes("transaction-id")
        )?.valueString || "N/A",
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

  const isMockSource =
    sourceId !== import.meta.env.VITE_SOURCE_ID_ATHENA &&
    sourceId !== import.meta.env.VITE_SOURCE_ID_ELATION;

  useEffect(() => {
    if (!sourceId || !patientId || !departmentId) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        let data = null;

        if (isMockSource) {
          await new Promise((r) => setTimeout(r, 1500)); // simulate delay
          const entry = ECW_MOCK_CLAIMS.entry.find((e) => e.resource.id === id);
          if (!entry) throw new Error("Claim not found in data data");
          data = normalizeMockClaim(entry);
        } else {
          data = await fetchClaimById(id, sourceId, patientId, departmentId);
        }

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
  }, [id, sourceId, patientId, departmentId]);

  const formatCurrency = (val) =>
    val
      ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val)
      : "-";

  if (loading)
    return (
      <div className="flex justify-center items-center p-10">
        <Loader2 className="animate-spin h-6 w-6 mr-2 text-blue-500" />
        Loading claim...
      </div>
    );

  if (error) return <div className="p-6 text-red-500 text-center">Error: {error}</div>;
  if (!claim) return <div className="p-6 text-center">No claim found.</div>;

  const totalBilled = claim.procedures?.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-6">
      {/* Claim Header */}
      <Card>
        <h1 className="text-2xl font-bold mb-4">Claim #{claim.id}</h1>
        <div className="grid md:grid-cols-2 gap-4">
          <p>
            <strong>Status:</strong> <Badge status={claim.status?.toLowerCase()} />
          </p>
          <p><strong>Date Created:</strong> {claim.created || "N/A"}</p>
          <p><strong>Billable End:</strong> {claim.billableEnd || "N/A"}</p>
          <p><strong>Provider:</strong> {getIdFromReference(claim.provider)}</p>
          <p><strong>Priority:</strong> {claim.priority || "N/A"}</p>
          <p><strong>Total Billed:</strong> {formatCurrency(totalBilled)}</p>
        </div>
      </Card>

      {/* Patient & Insurance */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Patient & Coverage</h2>
        <p><strong>Patient:</strong> {getIdFromReference(claim.patient)}</p>
        {claim.insurance?.map((ins, idx) => (
          <div key={idx} className="mb-4 border-t pt-2">
            <p><strong>Coverage:</strong> {getIdFromReference(ins.reference)}</p>
            {ins.packageId && <p><strong>Package ID:</strong> {ins.packageId}</p>}
            {ins.status && <p><strong>Status:</strong> {ins.status}</p>}
          </div>
        ))}
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
                  <tr key={idx} className="hover:bg-blue-50 border-b border-gray-200">
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
              <thead className="bg-green-100 text-left text-gray-700 uppercase">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {claim.procedures.map((p, idx) => (
                  <tr key={idx} className="hover:bg-green-50 border-b border-gray-200">
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
