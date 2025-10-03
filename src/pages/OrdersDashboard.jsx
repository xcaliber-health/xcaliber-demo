
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../layouts/DashboardLayout";
import { fetchOrders } from "../api/orders";
import toast from "react-hot-toast";
import { Loader2, ClipboardList, Plus } from "lucide-react";

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

export default function OrdersDashboard() {
  const { sourceId, departmentId } = useContext(AppContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("108252007"); // Default category

  const CATEGORY_OPTIONS = {
    LAB_ORDER_CATEGORY_CODE: "108252007",
    IMAGING_ORDER_CATEGORY_CODE: "363679005",
    REFERRAL_ORDER_CATEGORY_CODE: "409063005",
  };

  const loadOrders = async () => {
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    setLoading(true);
    try {
      const list = await fetchOrders({
        patientId: "4406",
        encounterId: "34507",
        sourceId,
        departmentId,
        category,
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
  }, [category]); // Reload orders when category changes

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

          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {Object.entries(CATEGORY_OPTIONS).map(([key, value]) => (
              <option key={value} value={value}>
                {key.replace("_CATEGORY_CODE", "").replace(/_/g, " ")}
              </option>
            ))}
          </select>

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
