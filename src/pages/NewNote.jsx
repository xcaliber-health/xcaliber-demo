
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../layouts/DashboardLayout";
import { createDocumentReference } from "../api/documentApi";
import { Loader2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

// Reusable Card
function Card({ children, className = "" }) {
  return (
    <div className={`bg-white/95 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 ${className}`}>
      {children}
    </div>
  );
}

// Reusable Button
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

// Reusable Textarea
function Textarea({ value, onChange, placeholder }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={3}
      className="border-2 border-gray-200/50 py-3 px-4 rounded-2xl w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 outline-none bg-white/80 backdrop-blur-sm transition-all duration-200 placeholder:text-gray-400 resize-none"
    />
  );
}

export default function NewNote({ patientId }) {
  const { departmentId, sourceId, setLatestCurl } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ HPI: "", ROS: "", PE: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Exact POST body from Documents tab
    const body = {
      HPI: { sectionnote: formData.HPI, replacesectionnote: false },
      ROS: { sectionnote: formData.ROS, replacesectionnote: false },
      PE: { sectionnote: formData.PE, replacesectionnote: false },
      patient: { reference: `Patient/${patientId}` },
      departmentId: { reference: `departmentId/${departmentId}` },
      extension: [
        { url: "http://xcaliber-fhir/structureDefinition/department-id", valueString: `${departmentId}` }
      ],
    };

    try {
      const created = await createDocumentReference(body, sourceId, setLatestCurl);
      toast.success("✅ Document added successfully!");
      navigate(`/notes/${created.id}`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to create document: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 pb-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            New Note
          </h1>
          <p className="text-sm text-gray-600">Fill the form and submit the note</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-4 overflow-auto">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden p-6 space-y-4">

            {/* HPI / ROS / PE Sections */}
            {["HPI", "ROS", "PE"].map((section) => (
              <div key={section}>
                <label className="block font-medium mb-1">{section}</label>
                <Textarea
                  value={formData[section]}
                  onChange={(e) => handleChange({ target: { name: section, value: e.target.value } })}
                  placeholder={`Enter ${section} notes`}
                />
              </div>
            ))}

            {/* Submit */}
            <div className="flex justify-end mt-4">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-40 flex justify-center items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Save Note"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

          </Card>
        </div>
      </div>
    </div>
  );
}
