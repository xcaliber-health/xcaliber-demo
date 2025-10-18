import { fhirFetch } from "./fhir";
import { cachedFhirFetch } from "./cachedFhirFetch";

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
async function getAllNotes({ departmentId, category, sourceId, patientId, setLatestCurl }) {
  if (!sourceId) throw new Error("sourceId is required");
  if (!departmentId) throw new Error("departmentId is required");
  if (!patientId) throw new Error("patientId is required");

  let path = `/DocumentReference?patient=${patientId}&departmentId=${departmentId}`;
  if (category && category !== "all") {
    path += `&category=${category}`;
  }

  const data = await cachedFhirFetch(path, { sourceId, setLatestCurl },  24 * 60 * 60 * 1000 ); 
  return (
    data.entry?.map((e) => {
      const resource = e.resource;
      return {
        id: resource.id,
        title: resource.description || "Untitled Note",
        category: resource.category?.[0]?.coding?.[0]?.code || "unknown",
        author: resource.author?.[0]?.display || "Unknown",
        createdAt: resource.date,
        content: atob(resource.content?.[0]?.attachment?.data || ""),
        status: resource.status || "-",
        priority: resource.priority || "-",
        contextType: resource.context ? Object.keys(resource.context)[0] : null,
        contextId: resource.context
          ? resource.context[Object.keys(resource.context)[0]]?.[0]?.reference?.split("/")[1]
          : null,
      };
    }) || []
  );
}

/**
 * Get a single note by ID.
 */
async function getNoteById(id, { departmentId, patientId, category, sourceId, setLatestCurl }) {
  if (!sourceId) throw new Error("sourceId is required");
  if (!departmentId) throw new Error("departmentId is required");
  if (!patientId) throw new Error("patientId is required");
  if (!category) throw new Error("category is required");

  const path = `/DocumentReference/${id}?patient=${patientId}&category=${category}&departmentId=${departmentId}`;
  const data = await cachedFhirFetch(path, { sourceId, setLatestCurl },  24 * 60 * 60 * 1000 ); 

  const resource = data.resource || data;

  // Helper to extract extension values by URL
  const getExtensionValue = (url) => {
    const ext = resource.extension?.find((e) => e.url === url);
    return ext?.valueString || ext?.valueInteger || ext?.valueDate || ext?.valueDateTime || null;
  };

  return {
    id: resource.id,
    title: resource.description || "Untitled Note",
    category: resource.category?.[0]?.coding?.[0]?.code || "unknown",
    author: resource.author?.[0]?.display || "Unknown",
    createdAt: resource.date,
    content: atob(resource.content?.[0]?.attachment?.data || ""),
    status: resource.status || "-",
    priority: getExtensionValue("http://xcaliber-fhir/structureDefinition/priority") || "-",
    internalNote: getExtensionValue("http://xcaliber-fhir/structureDefinition/internal-note") || "-",
    documentRoute: getExtensionValue("http://xcaliber-fhir/structureDefinition/document-route"),
    documentSource: getExtensionValue("http://xcaliber-fhir/structureDefinition/document-source"),
    documentTypeId: getExtensionValue("http://xcaliber-fhir/structureDefinition/document-type-id"),
    lastModifiedDateTime: getExtensionValue("http://xcaliber-fhir/structureDefinition/last-modified-datetime"),
    lastModifiedUser: getExtensionValue("http://xcaliber-fhir/structureDefinition/last-modified-user"),
    observationDate: getExtensionValue("http://xcaliber-fhir/structureDefinition/observation-date"),
    createdUser: getExtensionValue("http://xcaliber-fhir/structureDefinition/created-user"),
    contentUrl: resource.content?.[0]?.attachment?.url || null,
    metaLastUpdated: resource.meta?.lastUpdated || null,
    contextType: resource.context ? Object.keys(resource.context)[0] : null,
    contextId: resource.context
      ? resource.context[Object.keys(resource.context)[0]]?.[0]?.reference?.split("/")[1]
      : null,
  };
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
            display: note.category,
          },
        ],
      },
    ],
    subject: { reference: `Patient/${patientId}` },
    author: [{ display: note.author }],
    description: note.title,
    content: [
      {
        attachment: {
          contentType: "text/plain",
          data: btoa(note.content),
        },
      },
    ],
    context: note.contextType
      ? {
          [note.contextType.toLowerCase()]: [{ reference: note.contextId }],
        }
      : undefined,
  };

  const path = `/DocumentReference?departmentId=${departmentId}`;
  const data = await fhirFetch(path, {
    sourceId,
    method: "POST",
    body: payload,
  });

  return {
    id: data.id,
    title: data.description || "Untitled Note",
    category: note.category,
    author: note.author,
    createdAt: data.date,
    content: note.content,
    status: data.status || "-",
    priority: data.priority || "-",
    contextType: note.contextType,
    contextId: note.contextId,
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
    body: note,
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
    body: note,
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
