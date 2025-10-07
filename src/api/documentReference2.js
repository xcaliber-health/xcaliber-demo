
import { fhirFetch } from "./fhir";

export async function fetchDocumentPDF({ patientId, documentId, departmentId, category, sourceId, setLatestCurl }) {
  if (!sourceId) throw new Error("sourceId is missing when calling fetchDocumentPDF");

  const url = `/Media/${documentId}?patient=${patientId}&departmentId=${departmentId}&category=${category}`;
  const response = await fhirFetch(url, { sourceId, setLatestCurl });

  const base64Data = response?.content?.data;
  if (!base64Data) throw new Error("No PDF data found in response");

  const byteCharacters = atob(base64Data);
  const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);
  return URL.createObjectURL(new Blob([byteArray], { type: "application/pdf" }));
}

export async function fetchDiagnosticReport({ patientId, documentId, departmentId, category, sourceId, setLatestCurl }) {
  if (!sourceId) throw new Error("sourceId is missing when calling fetchDiagnosticReport");

  const url = `/DiagnosticReport/${documentId}?patient=${patientId}&departmentId=${departmentId}&category=${category}`;
  return await fhirFetch(url, { sourceId }, setLatestCurl);
}
