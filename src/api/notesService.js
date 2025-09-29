import { fhirFetch } from "./fhir";

export const notesService = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  downloadNote
};

/**
 * Get all notes for a given patient filtered by category.
 */
async function getAllNotes({ departmentId, category, sourceId, patientId }) {
  if (!sourceId) throw new Error("sourceId is required");
  if (!departmentId) throw new Error("departmentId is required");
  if (!patientId) throw new Error("patientId is required");

  let path = `/DocumentReference?patient=${patientId}&departmentId=${departmentId}`;
  if (category && category !== "all") {
    path += `&category=${category}`;
  }

  const data = await fhirFetch(path, { sourceId });
  return data.entry?.map(e => {
    const resource = e.resource;
    return {
      id: resource.id,
      title: resource.description || "Untitled Note",
      category: resource.category?.[0]?.coding?.[0]?.code || "unknown",
      author: resource.author?.[0]?.display || "Unknown",
      createdAt: resource.date,
      content: atob(resource.content?.[0]?.attachment?.data || ""),
      contextType: resource.context ? Object.keys(resource.context)[0] : null,
      contextId: resource.context ? Object.values(resource.context)[0]?.[0]?.reference?.split("/")[1] : null
    };
  }) || [];
}

/**
 * Get a single note by ID.
 */
async function getNoteById(id, departmentId, sourceId) {
  if (!sourceId) throw new Error("sourceId is required");
  if (!departmentId) throw new Error("departmentId is required");

  const path = `/DocumentReference/${id}?departmentId=${departmentId}`;
  const data = await fhirFetch(path, { sourceId });
  return data.resource || null;
}

/**
 * Create a new note.
 */
async function createNote(note, departmentId, sourceId, patientId) {
  if (!sourceId) throw new Error("sourceId is required");
  if (!departmentId) throw new Error("departmentId is required");
  if (!patientId) throw new Error("patientId is required");

  const payload = {
    resourceType: "DocumentReference",
    status: "current",
    category: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/document-classcodes",
            code: note.category,
            display: note.category
          }
        ]
      }
    ],
    subject: { reference: `Patient/${patientId}` },
    author: [{ display: note.author }],
    description: note.title,
    content: [
      {
        attachment: {
          contentType: "text/plain",
          data: btoa(note.content)
        }
      }
    ],
    context: note.contextType
      ? {
          [note.contextType.toLowerCase()]: [{ reference: note.contextId }]
        }
      : undefined
  };

  const path = `/DocumentReference?departmentId=${departmentId}`;
  const data = await fhirFetch(path, {
    sourceId,
    method: "POST",
    body: payload
  });

  return {
    id: data.id,
    title: data.description || "Untitled Note",
    category: note.category,
    author: note.author,
    createdAt: data.date,
    content: note.content,
    contextType: note.contextType,
    contextId: note.contextId
  };
}

/**
 * Update an existing note.
 */
async function updateNote(id, note, departmentId, sourceId) {
  if (!sourceId) throw new Error("sourceId is required");
  if (!departmentId) throw new Error("departmentId is required");

  const path = `/DocumentReference/${id}?departmentId=${departmentId}`;
  return await fhirFetch(path, {
    sourceId,
    method: "PUT",
    body: note
  });
}

/**
 * Delete (mark as entered-in-error) a note.
 */
async function deleteNote(id, departmentId, sourceId) {
  if (!sourceId) throw new Error("sourceId is required");
  if (!departmentId) throw new Error("departmentId is required");

  const note = await getNoteById(id, departmentId, sourceId);
  if (!note) throw new Error("Note not found");

  note.status = "entered-in-error";

  const path = `/DocumentReference/${id}?departmentId=${departmentId}`;
  return await fhirFetch(path, {
    sourceId,
    method: "PUT",
    body: note
  });
}

/**
 * Download note content.
 */
async function downloadNote(id, departmentId, sourceId) {
  if (!sourceId) throw new Error("sourceId is required");
  if (!departmentId) throw new Error("departmentId is required");

  const note = await getNoteById(id, departmentId, sourceId);
  const content = note.content?.[0]?.attachment?.data;

  if (!content) throw new Error("No content to download");

  const decoded = atob(content);
  const blob = new Blob([decoded], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${note.description || "note"}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
