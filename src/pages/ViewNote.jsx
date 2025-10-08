
import React, { useEffect, useState, useContext } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { AppContext } from "../layouts/DashboardLayout";
import { notesService } from "../api/notesService";
import { Loader2, X, FileText } from "lucide-react";
import toast from "react-hot-toast";

function Card({ children }) {
  return <div className="bg-white shadow rounded-2xl p-6 mb-6 border border-gray-200">{children}</div>;
}

function Badge({ status }) {
  const colors = {
    current: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
    entered: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
    default: "bg-gray-100 text-gray-800",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status?.toLowerCase()] || colors.default}`}>
      {status || "N/A"}
    </span>
  );
}

export default function ViewNote() {
  const { departmentId, sourceId, setLatestCurl } = useContext(AppContext);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const category = searchParams.get("category") || "clinical-document";

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const patientId = "4406";

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const fetchedNote = await notesService.getNoteById(id, {
          departmentId,
          patientId,
          category,
          sourceId, 
          setLatestCurl,
        });
        setNote(fetchedNote);
        toast.success(`Note loaded successfully!`);
      } catch (err) {
        setError(err.message);
        toast.error(`Failed to load note: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id, departmentId, sourceId, category, setLatestCurl]);

  if (loading)
    return (
      <div className="flex justify-center items-center p-10">
        <Loader2 className="animate-spin h-6 w-6 mr-2 text-blue-500" />
        Loading note...
      </div>
    );

  if (error) return <div className="p-6 text-red-500 text-center">Error: {error}</div>;
  if (!note) return <div className="p-6 text-center">No note found.</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText /> {note.title}
          </h1>
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-800 flex items-center gap-1">
            <X className="w-5 h-5" /> Back
          </button>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-4 text-blue-800">Note Details</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <p><strong>Category:</strong> {note.category}</p>
          <p><strong>Status:</strong> <Badge status={note.status?.toLowerCase()} /></p>
          <p><strong>Author:</strong> {note.author}</p>
          <p><strong>Date:</strong> {formatDate(note.createdAt)}</p>
          <p><strong>Priority:</strong> {note.priority}</p>
          <p><strong>Internal Note:</strong> {note.internalNote}</p>
          <p><strong>Document Route:</strong> {note.documentRoute}</p>
          <p><strong>Document Source:</strong> {note.documentSource}</p>
          <p><strong>Document Type ID:</strong> {note.documentTypeId}</p>
          <p><strong>Last Modified Date:</strong> {formatDate(note.lastModifiedDateTime)}</p>
          <p><strong>Last Modified User:</strong> {note.lastModifiedUser}</p>
          <p><strong>Observation Date:</strong> {formatDate(note.observationDate)}</p>
          <p><strong>Created User:</strong> {note.createdUser}</p>
          <p><strong>Meta Last Updated:</strong> {formatDate(note.metaLastUpdated)}</p>
          <p><strong>Context:</strong> {note.contextType ? `${note.contextType} #${note.contextId}` : "-"}</p>
          <p>
            <strong>Content URL:</strong>{" "}
            {note.contentUrl ? (
              <a href={note.contentUrl} target="_blank" className="text-blue-500 underline">
                View Document
              </a>
            ) : (
              "-"
            )}
          </p>
        </div>
      </Card>

      <Card className="bg-blue-50">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">Content</h2>
        <pre className="bg-gray-50 p-4 rounded text-sm">{note.content || "No content"}</pre>
      </Card>
    </div>
  );
}
