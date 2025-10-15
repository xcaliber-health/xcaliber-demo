
import { useState, useEffect, useContext } from "react";
import { Loader2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { AppContext } from "../layouts/DashboardLayout";
import { fetchDocuments, createDocumentReference } from "../api/documentApi";

const categoryOptions = [
  "clinical-document",
  "medical-record",
  "patient-case",
  "prescription",
  "interpretation",
  "order",
  "encounter-document",
];

export default function DocumentTab({ patientId }) {
  const { departmentId, sourceId, setLatestCurl } = useContext(AppContext);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0]);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ HPI: "", ROS: "", PE: "" });

  // Load documents
  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      try {
        const bundle = await fetchDocuments(
          patientId,
          departmentId,
          selectedCategory,
          sourceId,
          setLatestCurl
        );
        setDocuments(bundle.entry?.map((e) => e.resource) || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load documents");
        toast.error(`Failed to load documents: ${err.message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };

    if (patientId && sourceId && departmentId) loadDocuments();
  }, [patientId, departmentId, sourceId, selectedCategory, setLatestCurl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      HPI: { sectionnote: formData.HPI, replacesectionnote: false },
      ROS: { sectionnote: formData.ROS, replacesectionnote: false },
      PE: { sectionnote: formData.PE, replacesectionnote: false },
      patient: { reference: `Patient/${patientId}` },
      departmentId: { reference: `departmentId/${departmentId}` },
      extension: [
        {
          url: "http://xcaliber-fhir/structureDefinition/department-id",
          valueString: `${departmentId}`,
        },
      ],
    };

    setLoading(true);
    try {
      await createDocumentReference(body, sourceId, setLatestCurl);
      toast.success("Document added successfully");
      setFormData({ HPI: "", ROS: "", PE: "" });
      setOpen(false);

      // Reload documents
      const bundle = await fetchDocuments(
        patientId,
        departmentId,
        selectedCategory,
        sourceId,
        setLatestCurl
      );
      setDocuments(bundle.entry?.map((e) => e.resource) || []);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to add document: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const mapRow = (resource) => [
    resource.description || "Untitled Note",
    resource.category?.[0]?.coding?.[0]?.code || "unknown",
    resource.author?.[0]?.display || "Unknown",
    resource.date ? new Date(resource.date).toLocaleString() : "-",
    resource.status || "-",
  ];

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Documents</h2>
        {/* <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Document
        </button> */}
      </div>

      {/* Category Dropdown */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded w-40"
        >
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c.replace("-", " ").toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Add Document Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add Document</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              {["HPI", "ROS", "PE"].map((section) => (
                <div key={section}>
                  <label className="block mb-1 font-medium">{section}</label>
                  <textarea
                    name={section}
                    value={formData[section]}
                    onChange={handleChange}
                    className="border p-2 rounded-lg w-full"
                    rows={3}
                    placeholder={`Enter ${section} notes`}
                  />
                </div>
              ))}

              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {loading ? (
                    <span className="flex justify-center items-center">
                      <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      Saving...
                    </span>
                  ) : (
                    "Save"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 border py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Documents Table */}
      {loading ? (
        <div className="flex items-center justify-center py-8 text-gray-600">
          <Loader2 className="animate-spin w-5 h-5 mr-2" />
          Loading documents...
        </div>
      ) : error ? (
        <p className="text-red-500 text-center py-6">{error}</p>
      ) : documents.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No documents found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg text-sm">
            <thead className="bg-gray-100">
              <tr>
                {["Title", "Category", "Author", "Created At", "Status"].map(
                  (h, i) => (
                    <th
                      key={i}
                      className="text-left px-4 py-2 border-b font-semibold"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {mapRow(doc).map((cell, j) => (
                    <td key={j} className="px-4 py-2 border-b">
                      {cell || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
