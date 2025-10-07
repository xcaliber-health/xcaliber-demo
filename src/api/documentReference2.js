// documentReference2.js
// documentReference2.js
import { fhirFetch } from "./fhir";

/**
 * Fetch PDF Media from API
 */
export async function fetchDocumentPDF({ patientId, departmentId, category, sourceId, setLatestCurl }) {
  if (!sourceId) throw new Error("sourceId is missing when calling fetchDocumentPDF");

  const url = `/Media/231756?patient=${patientId}&departmentId=${departmentId}&category=${category}`;

  // 👉 This returns JSON (not blob)
  const response = await fhirFetch(url, { sourceId, setLatestCurl });

  // Extract base64 data
  const base64Data = response?.content?.data;
  if (!base64Data) throw new Error("No PDF data found in response");

  // Decode base64 → binary
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });

  // Convert Blob to Object URL for viewing
  return URL.createObjectURL(blob);
}


/**
 * Fetch Diagnostic Report JSON from API
 */
export async function fetchDiagnosticReport({ patientId, departmentId, category, sourceId,setLatestCurl }) {
  if (!sourceId) throw new Error("sourceId is missing when calling fetchDiagnosticReport");

  const url = `/DiagnosticReport/231756?patient=${patientId}&departmentId=${departmentId}&category=${category}`;
  return await fhirFetch(url, { sourceId }, setLatestCurl );
}
