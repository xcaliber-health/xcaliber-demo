
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  FileText,
  Calendar,
  User,
  Filter,
  Eye,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { notesService } from "../api/notesService";
import { AppContext } from "../layouts/DashboardLayout";

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 ${className}`}>
      {children}
    </div>
  );
}

function Button({ children, className = "", variant = "primary", size = "md", ...props }) {
  const baseClasses =
    "font-medium transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95 flex items-center gap-2";

  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg",
    ghost: "hover:bg-gray-100 text-gray-600",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2 rounded-xl",
    lg: "px-6 py-3 text-lg rounded-xl",
  };

  return (
    <button
      {...props}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

export default function NotesApp() {
  const { departmentId, sourceId, setLatestCurl } = useContext(AppContext);
  const patientId = "4406";

  const [notes, setNotes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("clinical-document");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    { value: "clinical-document", label: "Clinical Document" },
    { value: "medical-record", label: "Medical Record" },
    { value: "patient-case", label: "Patient Case" },
    { value: "prescription", label: "Prescription" },
    { value: "interpretation", label: "Interpretation" },
    { value: "order", label: "Order" },
    { value: "encounter-document", label: "Encounter Document" },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    loadNotes();
  }, [departmentId, sourceId, selectedCategory]);

  const loadNotes = async () => {
    if (!departmentId || !sourceId || !patientId || !selectedCategory) return;
    setLoading(true);
    setError(null);
    try {
      const fetchedNotes = await notesService.getAllNotes({
        patientId,
        departmentId,
        sourceId,
        category: selectedCategory,
        setLatestCurl,
      });
      setNotes(fetchedNotes);
    } catch (err) {
      setError("Failed to load notes: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewNote = (noteId) => {
    navigate(`/note/${noteId}?category=${selectedCategory}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryLabel = (value) => {
    return categories.find((cat) => cat.value === value)?.label || value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Notes Management
              </h1>
              <p className="text-gray-600">Patient ID: {patientId || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* <Button onClick={() => navigate("/create-note")}>
                <Plus className="w-4 h-4" /> New Note
              </Button> */}
              <Button onClick={() => navigate("/create-note")}>
  <Plus className="w-4 h-4" /> New Note
</Button>


              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  className="border-2 border-gray-200/50 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 bg-white/80 backdrop-blur-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              {notes.length} note{notes.length !== 1 ? "s" : ""} found
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No notes found</p>
              <p className="text-sm text-gray-500">Create your first note to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="max-h-[470px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 sticky top-0 z-10">
                    <tr>
                      <th className="text-left p-4 font-semibold text-indigo-700">Title</th>
                      <th className="text-left p-4 font-semibold text-indigo-700">Category</th>
                      <th className="text-left p-4 font-semibold text-indigo-700">Author</th>
                      <th className="text-left p-4 font-semibold text-indigo-700">Date</th>
                      <th className="text-left p-4 font-semibold text-indigo-700">Status</th>
                      <th className="text-left p-4 font-semibold text-indigo-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notes.map((note, index) => (
                      <tr key={note.id} className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}>
                        <td className="p-4">
                          <div className="font-medium text-gray-800">{note.title}</div>
                          {note.contextType && (
                            <div className="text-sm text-gray-500">
                              Linked to: {note.contextType} #{note.contextId}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {getCategoryLabel(note.category)}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{note.author}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{formatDate(note.createdAt)}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-700">{note.status || "-"}</span>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" onClick={() => handleViewNote(note.id)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
