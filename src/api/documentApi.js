import { fhirFetch } from "./fhir";
import { cachedFhirFetch } from "./cachedFhirFetch"; 

// Fetch documents for a patient
export async function fetchDocuments(patientId, departmentId, category, sourceId, setLatestCurl) {
  if (!patientId || !departmentId || !sourceId) {
    throw new Error("Missing required parameters for fetchDocuments");
  }

  try {
    const bundle = await cachedFhirFetch( 
      `/DocumentReference?patient=${patientId}&departmentId=${departmentId}&category=${category}`,
      {
        sourceId,
        headers: { "x-interaction-mode": "false" },
        setLatestCurl,
      },
       24 * 60 * 60 * 1000 // 1 day TTL
    );

    return bundle?.entry ? bundle : { entry: [] };
  } catch (err) {
    console.error("fetchDocuments error:", err);
    throw new Error(err.message || "Failed to fetch documents");
  }
}

// Fetch single document by ID
export async function fetchDocumentById(documentId, sourceId, setLatestCurl) {
  if (!documentId || !sourceId) {
    throw new Error("Missing documentId or sourceId for fetchDocumentById");
  }

  try {
    return await cachedFhirFetch( 
      `/DocumentReference/${documentId}`,
      {
        sourceId,
        headers: { "x-interaction-mode": "false" },
        setLatestCurl,
      },
       24 * 60 * 60 * 1000 // 1 day TTL
    );
  } catch (err) {
    console.error("fetchDocumentById error:", err);
    throw new Error(err.message || "Failed to fetch document by ID");
  }
}

// POST
export async function createDocumentReference(body, sourceId, setLatestCurl) {
  if (!sourceId) throw new Error("sourceId is required for creating document");
  return fhirFetch("/DocumentReference", {
    method: "POST",
    body,
    sourceId,
    headers: { "x-interaction-mode": "false", "Content-Type": "application/json" },
    setLatestCurl,
  });
}
