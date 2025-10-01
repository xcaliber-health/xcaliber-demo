// import React, { useState, useEffect, useContext } from "react";
// import {
//   Plus,
//   FileText,
//   Calendar,
//   User,
//   Filter,
//   Eye,
//   Trash2,
//   Download,
//   X,
//   AlertCircle,
//   CheckCircle,
// } from "lucide-react";
// import { notesService } from "../api/notesService";
// import { AppContext } from "../layouts/DashboardLayout";

// // Reusable UI Components
// function Card({ children, className = "" }) {
//   return (
//     <div
//       className={`bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 ${className}`}
//     >
//       {children}
//     </div>
//   );
// }

// function Button({ children, className = "", variant = "primary", size = "md", ...props }) {
//   const baseClasses =
//     "font-medium transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95 flex items-center gap-2";

//   const variants = {
//     primary: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg",
//     secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
//     danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg",
//     ghost: "hover:bg-gray-100 text-gray-600",
//   };

//   const sizes = {
//     sm: "px-3 py-1.5 text-sm rounded-lg",
//     md: "px-4 py-2 rounded-xl",
//     lg: "px-6 py-3 text-lg rounded-xl",
//   };

//   return (
//     <button
//       {...props}
//       className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
//     >
//       {children}
//     </button>
//   );
// }

// function Modal({ isOpen, onClose, title, children }) {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
//         <div className="flex items-center justify-between p-6 border-b">
//           <h2 className="text-xl font-bold text-gray-800">{title}</h2>
//           <Button variant="ghost" size="sm" onClick={onClose}>
//             <X className="w-4 h-4" />
//           </Button>
//         </div>
//         <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">{children}</div>
//       </div>
//     </div>
//   );
// }

// export default function NotesApp() {
//   const { departmentId, sourceId } = useContext(AppContext);

//   const patientId = "4406"; // HARD-CODED PATIENT ID

//   const [notes, setNotes] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("clinical-document");
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [selectedNote, setSelectedNote] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   const [formData, setFormData] = useState({
//     title: "",
//     category: "clinical-document",
//     content: "",
//     author: "Dr. Current User",
//     contextType: "",
//     contextId: "",
//   });

//   const categories = [
//     { value: "clinical-document", label: "Clinical Document" },
//     { value: "medical-record", label: "Medical Record" },
//     { value: "patient-case", label: "Patient Case" },
//     { value: "prescription", label: "Prescription" },
//     { value: "interpretation", label: "Interpretation" },
//     { value: "order", label: "Order" },
//     { value: "encounter-document", label: "Encounter Document" },
//   ];

//   // Load notes when component mounts or dependencies change
//   useEffect(() => {
//     loadNotes();
//   }, [departmentId, sourceId, selectedCategory]);

//   const loadNotes = async () => {
//     if (!departmentId || !sourceId || !patientId || !selectedCategory) {
//       console.warn("Missing required parameters to load notes.");
//       return;
//     }
//     setLoading(true);
//     setError(null);
//     try {
//       console.log("Loading notes with:", { patientId, departmentId, sourceId, selectedCategory });
//       const fetchedNotes = await notesService.getAllNotes({
//         patientId,
//         departmentId,
//         sourceId,
//         category: selectedCategory,
//       });
//       setNotes(fetchedNotes);
//     } catch (err) {
//       setError("Failed to load notes: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateNote = async (e) => {
//     e.preventDefault();
//     if (!departmentId || !sourceId || !patientId) return;
//     setLoading(true);
//     setError(null);

//     try {
//       await notesService.createNote(formData, departmentId, sourceId, patientId);
//       await loadNotes();
//       setIsCreateModalOpen(false);
//       setFormData({
//         title: "",
//         category: "clinical-document",
//         content: "",
//         author: "Dr. Current User",
//         contextType: "",
//         contextId: "",
//       });
//       setSuccess("Note created successfully!");
//       setTimeout(() => setSuccess(null), 3000);
//     } catch (err) {
//       setError("Failed to create note: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteNote = async (noteId) => {
//     if (!confirm("Are you sure you want to delete this note?")) return;
//     setLoading(true);
//     try {
//       await notesService.deleteNote(noteId, departmentId, sourceId);
//       await loadNotes();
//       setSuccess("Note deleted successfully!");
//       setTimeout(() => setSuccess(null), 3000);
//     } catch (err) {
//       setError("Failed to delete note: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewNote = async (noteId) => {
//     setLoading(true);
//     try {
//       const note = await notesService.getNoteById(noteId, departmentId, sourceId);
//       setSelectedNote(note);
//       setIsViewModalOpen(true);
//     } catch (err) {
//       setError("Failed to load note: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownloadNote = async (noteId) => {
//     try {
//       await notesService.downloadNote(noteId, departmentId, sourceId);
//       setSuccess("Note downloaded successfully!");
//       setTimeout(() => setSuccess(null), 3000);
//     } catch (err) {
//       setError("Failed to download note: " + err.message);
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getCategoryLabel = (value) => {
//     return categories.find((cat) => cat.value === value)?.label || value;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
//       <div className="max-w-7xl mx-auto p-6">
//         {/* Header & Actions */}
//         <div className="mb-8">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
//               <FileText className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                 Notes Management
//               </h1>
//               <p className="text-gray-600">Patient ID: {patientId || "N/A"}</p>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex items-center justify-between gap-4">
//             <div className="flex items-center gap-4">
//               <Button onClick={() => setIsCreateModalOpen(true)}>
//                 <Plus className="w-4 h-4" />
//                 New Note
//               </Button>

//               <div className="flex items-center gap-2">
//                 <Filter className="w-4 h-4 text-gray-500" />
//                 <select
//                   className="border-2 border-gray-200/50 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 bg-white/80 backdrop-blur-sm"
//                   value={selectedCategory}
//                   onChange={(e) => setSelectedCategory(e.target.value)}
//                 >
//                   {categories.map((category) => (
//                     <option key={category.value} value={category.value}>
//                       {category.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="text-sm text-gray-600">
//               {notes.length} note{notes.length !== 1 ? "s" : ""} found
//             </div>
//           </div>
//         </div>

//         {/* Notifications */}
//         {error && (
//           <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
//             <AlertCircle className="w-5 h-5" />
//             {error}
//           </div>
//         )}
//         {success && (
//           <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700">
//             <CheckCircle className="w-5 h-5" />
//             {success}
//           </div>
//         )}

//         {/* Notes Table */}
//         <Card className="overflow-hidden">
//           {loading ? (
//             <div className="p-8 text-center">
//               <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
//               <p className="text-gray-600">Loading notes...</p>
//             </div>
//           ) : notes.length === 0 ? (
//             <div className="p-8 text-center">
//               <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-600 mb-2">No notes found</p>
//               <p className="text-sm text-gray-500">Create your first note to get started</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
//                   <tr>
//                     <th className="text-left p-4 font-semibold text-indigo-700">Title</th>
//                     <th className="text-left p-4 font-semibold text-indigo-700">Category</th>
//                     <th className="text-left p-4 font-semibold text-indigo-700">Author</th>
//                     <th className="text-left p-4 font-semibold text-indigo-700">Date</th>
//                     <th className="text-left p-4 font-semibold text-indigo-700">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {notes.map((note, index) => (
//                     <tr
//                       key={note.id}
//                       className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${
//                         index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
//                       }`}
//                     >
//                       <td className="p-4">
//                         <div className="font-medium text-gray-800">{note.title}</div>
//                         {note.contextType && (
//                           <div className="text-sm text-gray-500">
//                             Linked to: {note.contextType} #{note.contextId}
//                           </div>
//                         )}
//                       </td>
//                       <td className="p-4">
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
//                           {getCategoryLabel(note.category)}
//                         </span>
//                       </td>
//                       <td className="p-4">
//                         <div className="flex items-center gap-2">
//                           <User className="w-4 h-4 text-gray-400" />
//                           <span className="text-gray-700">{note.author}</span>
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <div className="flex items-center gap-2">
//                           <Calendar className="w-4 h-4 text-gray-400" />
//                           <span className="text-gray-700">{formatDate(note.createdAt)}</span>
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <div className="flex items-center gap-2">
//                           <Button variant="ghost" size="sm" onClick={() => handleViewNote(note.id)}>
//                             <Eye className="w-4 h-4" />
//                           </Button>
                        
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </Card>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect, useContext } from "react";
import {
  Plus,
  FileText,
  Calendar,
  User,
  Filter,
  Eye,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { notesService } from "../api/notesService";
import { AppContext } from "../layouts/DashboardLayout";

// Reusable UI Components
function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 ${className}`}
    >
      {children}
    </div>
  );
}

function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}) {
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

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function NotesApp() {
  const { departmentId, sourceId } = useContext(AppContext);

  const patientId = "4406"; // HARD-CODED PATIENT ID

  const [notes, setNotes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("clinical-document");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "clinical-document",
    content: "",
    author: "Dr. Current User",
    contextType: "",
    contextId: "",
  });

  const categories = [
    { value: "clinical-document", label: "Clinical Document" },
    { value: "medical-record", label: "Medical Record" },
    { value: "patient-case", label: "Patient Case" },
    { value: "prescription", label: "Prescription" },
    { value: "interpretation", label: "Interpretation" },
    { value: "order", label: "Order" },
    { value: "encounter-document", label: "Encounter Document" },
  ];

  // Load notes when component mounts or dependencies change
  useEffect(() => {
    loadNotes();
  }, [departmentId, sourceId, selectedCategory]);

  const loadNotes = async () => {
    if (!departmentId || !sourceId || !patientId || !selectedCategory) {
      console.warn("Missing required parameters to load notes.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log("Loading notes with:", {
        patientId,
        departmentId,
        sourceId,
        selectedCategory,
      });
      const fetchedNotes = await notesService.getAllNotes({
        patientId,
        departmentId,
        sourceId,
        category: selectedCategory,
      });
      setNotes(fetchedNotes);
    } catch (err) {
      setError("Failed to load notes: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewNote = async (noteId) => {
  setLoading(true);
  try {
    const note = await notesService.getNoteById(noteId, {
      departmentId,
      patientId,
      category: selectedCategory,
      sourceId,
    });
    setSelectedNote(note);
    setIsViewModalOpen(true);
  } catch (err) {
    setError("Failed to load note: " + err.message);
  } finally {
    setLoading(false);
  }
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
        {/* Header & Actions */}
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

          {/* Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4" />
                New Note
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

        {/* Notifications */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            {success}
          </div>
        )}

        {/* Notes Table */}
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
      <p className="text-sm text-gray-500">
        Create your first note to get started
      </p>
    </div>
  ) : (
    <div className="overflow-x-auto">
      {/* Scrollable table wrapper */}
      <div className="max-h-[470px] overflow-y-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 sticky top-0 z-10">
            <tr>
              <th className="text-left p-4 font-semibold text-indigo-700">
                Title
              </th>
              <th className="text-left p-4 font-semibold text-indigo-700">
                Category
              </th>
              <th className="text-left p-4 font-semibold text-indigo-700">
                Author
              </th>
              <th className="text-left p-4 font-semibold text-indigo-700">
                Date
              </th>
              <th className="text-left p-4 font-semibold text-indigo-700">
                Status
              </th>
              <th className="text-left p-4 font-semibold text-indigo-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note, index) => (
              <tr
                key={note.id}
                className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                }`}
              >
                {/* Title */}
                <td className="p-4">
                  <div className="font-medium text-gray-800">
                    {note.title}
                  </div>
                  {note.contextType && (
                    <div className="text-sm text-gray-500">
                      Linked to: {note.contextType} #{note.contextId}
                    </div>
                  )}
                </td>

                {/* Category */}
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {getCategoryLabel(note.category)}
                  </span>
                </td>

                {/* Author */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{note.author}</span>
                  </div>
                </td>

                {/* Date */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">
                      {formatDate(note.createdAt)}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="p-4">
                  <span className="text-gray-700">
                    {note.status || "-"}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewNote(note.id)}
                  >
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
