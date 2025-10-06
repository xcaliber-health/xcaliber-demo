// documentReference2.js
import { fhirFetch } from "./fhir";

/**
 * Fetch PDF Media from API
 */
export async function fetchDocumentPDF({ patientId, departmentId, category, sourceId }) {
  if (!sourceId) throw new Error("sourceId is missing when calling fetchDocumentPDF");

  const url = `/Media/231756?patient=${patientId}&departmentId=${departmentId}&category=${category}`;

  const blob = await fhirFetch(url, {
    sourceId,
    responseType: "blob",
  });

  return URL.createObjectURL(blob);
}

/**
 * Fetch Diagnostic Report JSON from API
 */
export async function fetchDiagnosticReport({ patientId, departmentId, category, sourceId }) {
  if (!sourceId) throw new Error("sourceId is missing when calling fetchDiagnosticReport");

  const url = `/DiagnosticReport/231756?patient=${patientId}&departmentId=${departmentId}&category=${category}`;
  return await fhirFetch(url, { sourceId });
}
