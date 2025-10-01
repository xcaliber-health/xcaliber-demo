
// import { useEffect, useState, useContext } from "react";
// import { AppContext } from "../layouts/DashboardLayout";
// import { createOrder, fetchOrders } from "../api/orders";
// import toast from "react-hot-toast";
// import { Loader2, ClipboardList, Plus } from "lucide-react";

// function Card({ children, className = "" }) {
//   return (
//     <div className={`bg-white/95 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 ${className}`}>
//       {children}
//     </div>
//   );
// }

// function Button({ children, className = "", ...props }) {
//   return (
//     <button {...props} className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 ${className}`}>
//       {children}
//     </button>
//   );
// }

// function Input(props) {
//   return (
//     <input {...props} className="border-2 border-gray-200/50 py-2 px-3 rounded-2xl w-full" />
//   );
// }

// const CATEGORY_CODES = {
//   LAB: { code: "108252007", display: "Lab" },
//   IMAGING: { code: "363679005", display: "Imaging" },
//   REFERRAL: { code: "409063005", display: "Referral" },
// };

// const PRIORITY_OPTIONS = ["routine", "urgent", "stat"];
// const REASON_CODES = [
//   { code: "125600009", display: "injury of hip region" },
//   { code: "S79911A", display: "Unspecified injury of right hip, initial encounter" },
// ];

// export default function OrdersDashboard() {
//   const { sourceId, departmentId } = useContext(AppContext);
//   console.log("sourceId:", sourceId, "departmentId:", departmentId);

//   // Error check sourceId at top-level render
//   if (!sourceId) {
//     return <div className="p-8 text-red-600">Error: sourceId missing from context. Check your AppContext provider.</div>;
//   }

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [category, setCategory] = useState(CATEGORY_CODES.LAB);
//   const [categoryText, setCategoryText] = useState("");
//   const [priority, setPriority] = useState("routine");
//   //const [selectedReasonCodes, setSelectedReasonCodes] = useState([REASON_CODES[0]]); // store as array
//   const [reasonCode, setReasonCode] = useState(REASON_CODES[0]); // single object
//   const [performerReference, setPerformerReference] = useState("");
//   const [performerDisplay, setPerformerDisplay] = useState("");

//   const loadOrders = async () => {
//     if (!sourceId) {
//       toast.error("sourceId is missing; cannot load orders");
//       return;
//     }

//     setLoading(true);
//     try {
//       const list = await fetchOrders({
//         patientId: "4406",
//         encounterId: "34507",
//         sourceId,
//         departmentId,
//         categoryCode: category.code,
//       });
//       setOrders(list);
//     } catch (err) {
//       toast.error(err.message || "Failed to load orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadOrders();
//     // eslint-disable-next-line
//   }, []);

//   const handleCreateOrder = async () => {
//     if (!category || !categoryText || !priority || !reasonCode?.code || !performerReference) {
//       toast.error("Please fill all required fields including Reason Code and Performer Reference");
//       return;
//     }
//     try {
//       await createOrder({
//         sourceId,
//         departmentId,
//         categoryCode: category.code,
//         categoryDisplay: category.display,
//         categoryText,
//         //reasonCodes: selectedReasonCodes, // array!
//         reasonCodes: [reasonCode], // wrap single selection in array for API payload
//         priority,
//         performerReference,
//         performerDisplay,
//       });
//       toast.success("Order created successfully");
//       loadOrders();
//       // Optionally clear form
//     } catch (err) {
//       toast.error(err.message || "Failed to create order");
//     }
//   };

//   return (
//     <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
//       <div className="max-w-6xl mx-auto space-y-6">
//         <div className="flex items-center gap-3">
//           <ClipboardList className="w-6 h-6 text-indigo-600" />
//           <h1 className="text-2xl font-bold">Orders Dashboard</h1>
//         </div>
//         {/* New Order Form */}
//         <Card className="p-4 space-y-3">
//           <div className="grid grid-cols-3 gap-3">
//             {/* Category Selector */}
//             <select
//               value={category.code}
//               onChange={(e) =>
//                 setCategory(Object.values(CATEGORY_CODES).find((c) => c.code === e.target.value))
//               }
//               className="border-2 border-gray-200 py-2 px-3 rounded-2xl"
//             >
//               {Object.values(CATEGORY_CODES).map((c) => (
//                 <option key={c.code} value={c.code}>
//                   {c.display}
//                 </option>
//               ))}
//             </select>
//             {/* Category Text */}
//             <Input
//               placeholder="Category Text"
//               value={categoryText}
//               onChange={(e) => setCategoryText(e.target.value)}
//             /> 

//             {/* Priority */}
//             <select
//               value={priority}
//               onChange={(e) => setPriority(e.target.value)}
//               className="border-2 border-gray-200 py-2 px-3 rounded-2xl"
//             >
//               {PRIORITY_OPTIONS.map((p) => (
//                 <option key={p} value={p}>
//                   {p}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="grid grid-cols-3 gap-3">
//             {/* Reason Code: allow multiselect */}
//             {/* <select
//               multiple
//               size={REASON_CODES.length}
//               value={selectedReasonCodes.map((rc) => rc.code)}
//               onChange={(e) => {
//                 const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
//                 setSelectedReasonCodes(REASON_CODES.filter(rc => options.includes(rc.code)));
//               }}
//               className="border-2 border-gray-200 py-2 px-3 rounded-2xl"
//             >
//               {REASON_CODES.map((rc) => (
//                 <option key={rc.code} value={rc.code}>
//                   {rc.display}
//                 </option>
//               ))}
//             </select> */}
//             {/* Reason Code: single select dropdown */}
// <select
//   value={reasonCode.code}
//   onChange={(e) => {
//     const selected = REASON_CODES.find(rc => rc.code === e.target.value);
//     setReasonCode(selected);
//   }}
//   className="border-2 border-gray-200 py-2 px-3 rounded-2xl"
// >
//   {REASON_CODES.map((rc) => (
//     <option key={rc.code} value={rc.code}>
//       {rc.display}
//     </option>
//   ))}
// </select>

//             {/* Performer Fields */}
//             <Input
//               placeholder="Performer Reference"
//               value={performerReference}
//               onChange={(e) => setPerformerReference(e.target.value)}
//             />
//             <Input
//               placeholder="Performer Display"
//               value={performerDisplay}
//               onChange={(e) => setPerformerDisplay(e.target.value)}
//             />
//           </div>
//           {/* Create Order Button */}
//           <Button className="bg-indigo-600 text-white" onClick={handleCreateOrder}>
//             <Plus className="w-4 h-4" /> Create Order
//           </Button>
//         </Card>
//         {/* Orders Table */}
//         <Card className="p-4">
//           {loading ? (
//             <div className="flex justify-center p-6">
//               <Loader2 className="animate-spin w-6 h-6 text-indigo-600" />
//             </div>
//           ) : (
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr>
//                   <th className="p-2">Type</th>
//                   <th className="p-2">Code</th>
//                   <th className="p-2">Status</th>
//                   <th className="p-2">Priority</th>
//                   <th className="p-2">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.map((o) => (
//                   <tr key={o.id} className="border-b">
//                     <td className="p-2">{o.type}</td>
//                     <td className="p-2">{o.code}</td>
//                     <td className="p-2">{o.status}</td>
//                     <td className="p-2">{o.priority}</td>
//                     <td className="p-2">{o.date ? new Date(o.date).toLocaleString() : "-"}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </Card>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../layouts/DashboardLayout";
import { fetchOrders } from "../api/orders";
import toast from "react-hot-toast";
import { Loader2, ClipboardList, Plus } from "lucide-react";

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

export default function OrdersDashboard() {
  const { sourceId, departmentId } = useContext(AppContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const list = await fetchOrders({
        patientId: "4406",
        encounterId: "34507",
        sourceId,
        departmentId,
      });
      setOrders(list || []);
      toast.success(`Loaded ${list?.length || 0} orders`);
    } catch (err) {
      toast.error(err?.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 pb-1">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Orders Dashboard
              </h1>
              <p className="text-sm text-gray-600">View and manage all orders</p>
            </div>
          </div>

          {/* Create Order Button */}
          <Button
            className="bg-indigo-600 text-white flex items-center gap-2"
            onClick={() => navigate("/orders/create")}
          >
            <Plus className="w-4 h-4" /> Create Order
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-2 overflow-hidden min-h-0">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden max-h-[570px]">
            <div className="flex-1 flex flex-col p-3 overflow-hidden min-h-0">
              <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-indigo-50 border-b border-gray-200 sticky top-0 z-10">
                    <tr>
                      <th className="p-3 text-left text-sm font-semibold uppercase text-gray-700">Type</th>
                      <th className="p-3 text-left text-sm font-semibold uppercase text-gray-700">Code</th>
                      <th className="p-3 text-left text-sm font-semibold uppercase text-gray-700">Status</th>
                      <th className="p-3 text-left text-sm font-semibold uppercase text-gray-700">Priority</th>
                      <th className="p-3 text-left text-sm font-semibold uppercase text-gray-700">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="p-4 text-center text-indigo-600">
                          <Loader2 className="animate-spin inline-block w-5 h-5 mr-2" />
                          Loading orders...
                        </td>
                      </tr>
                    ) : orders.length ? (
                      orders.map((o) => (
                        <tr key={o.id} className="border-b hover:bg-indigo-50">
                          <td className="p-2">{o.type || "-"}</td>
                          <td className="p-2">{o.code || "-"}</td>
                          <td className="p-2">{o.status || "-"}</td>
                          <td className="p-2">{o.priority || "-"}</td>
                          <td className="p-2">{o.date ? new Date(o.date).toLocaleString() : "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-4 text-center text-gray-500">
                          No orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
