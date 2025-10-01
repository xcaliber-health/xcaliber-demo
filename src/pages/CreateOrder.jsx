
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../layouts/DashboardLayout";
import { createOrder } from "../api/orders";
import toast from "react-hot-toast";
import { Plus, ArrowLeft, ClipboardList } from "lucide-react";

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
      className="border-2 border-gray-200/50 py-3 px-4 rounded-2xl w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 outline-none bg-white/80 backdrop-blur-sm transition-all duration-200 placeholder:text-gray-400"
    />
  );
}

const CATEGORY_CODES = {
  LAB: { code: "108252007", display: "Lab" },
  IMAGING: { code: "363679005", display: "Imaging" },
  REFERRAL: { code: "409063005", display: "Referral" },
};

const PRIORITY_OPTIONS = ["routine", "urgent", "stat"];
const REASON_CODES = [
  { code: "125600009", display: "Injury of hip region" },
  { code: "S79911A", display: "Unspecified injury of right hip" },
];

export default function CreateOrder() {
  const { sourceId, departmentId } = useContext(AppContext);
  const navigate = useNavigate();

  const [category, setCategory] = useState(CATEGORY_CODES.LAB);
  const [categoryText, setCategoryText] = useState("");
  const [priority, setPriority] = useState("routine");
  const [reasonCode, setReasonCode] = useState(REASON_CODES[0]);
  const [performerReference, setPerformerReference] = useState("");
  const [performerDisplay, setPerformerDisplay] = useState("");

  const handleCreateOrder = async () => {
    if (!categoryText || !priority || !reasonCode?.code || !performerReference) {
      toast.error("Please fill all required fields.");
      return;
    }
    try {
      await createOrder({
        sourceId,
        departmentId,
        categoryCode: category.code,
        categoryDisplay: category.display,
        categoryText,
        reasonCodes: [reasonCode],
        priority,
        performerReference,
        performerDisplay,
      });
      toast.success("Order created successfully");
      navigate("/orders");
    } catch (err) {
      toast.error(err.message || "Failed to create order");
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 pb-1">
        <div className="max-w-6xl mx-auto flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <ClipboardList className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create Order
            </h1>
            <p className="text-sm text-gray-600">Fill the form to create a new order</p>
          </div>
          <div className="ml-auto">
            <Button
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2"
              onClick={() => navigate("/orders")}
            >
              <ArrowLeft className="w-4 h-4" /> Back to Orders
            </Button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-4 pb-2 overflow-hidden min-h-0">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <Card className="flex flex-col overflow-hidden p-4 space-y-6 max-w-full">
            <div className="grid grid-cols-3 gap-4">
              <select
                value={category.code}
                onChange={(e) =>
                  setCategory(Object.values(CATEGORY_CODES).find((c) => c.code === e.target.value))
                }
                className="border-2 border-gray-200 py-3 px-4 rounded-2xl"
              >
                {Object.values(CATEGORY_CODES).map((c) => (
                  <option key={c.code} value={c.code}>{c.display}</option>
                ))}
              </select>
              <Input placeholder="Category Text" value={categoryText} onChange={(e) => setCategoryText(e.target.value)} />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="border-2 border-gray-200 py-3 px-4 rounded-2xl"
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <select
                value={reasonCode.code}
                onChange={(e) => setReasonCode(REASON_CODES.find(rc => rc.code === e.target.value))}
                className="border-2 border-gray-200 py-3 px-4 rounded-2xl"
              >
                {REASON_CODES.map((rc) => (
                  <option key={rc.code} value={rc.code}>{rc.display}</option>
                ))}
              </select>
              <Input placeholder="Performer Reference" value={performerReference} onChange={(e) => setPerformerReference(e.target.value)} />
              <Input placeholder="Performer Display" value={performerDisplay} onChange={(e) => setPerformerDisplay(e.target.value)} />
            </div>

            <div className="flex justify-end">
              <Button className="bg-indigo-600 text-white flex items-center gap-2" onClick={handleCreateOrder}>
                <Plus className="w-4 h-4" /> Create Order
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
