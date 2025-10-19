import { fhirFetch } from "./fhir";
import { cachedFhirFetch } from "./cachedFhirFetch"; 
const SOURCE_ID = "ef123977-6ef1-3e8e-a30f-3879cea0b344";

export async function fetchDocumentPDF({ patientId, documentId, departmentId, category, setLatestCurl }) {
  //if (!sourceId) throw new Error("sourceId is missing when calling fetchDocumentPDF");

  const url = `/Media/${documentId}?patient=${patientId}&departmentId=${departmentId}&category=${category}`;
  const response = await cachedFhirFetch(
    url,
    { sourceId, headers: { "x-interaction-mode": "true" }, setLatestCurl },
     24 * 60 * 60 * 1000 // 1 day TTL
  );
  //const response = await fhirFetch(url, { sourceId: SOURCE_ID,headers: { "x-interaction-mode": "true" }, setLatestCurl });

  const base64Data = response?.content?.data;
  if (!base64Data) throw new Error("No PDF data found in response");

  const byteCharacters = atob(base64Data);
  const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);
  return URL.createObjectURL(new Blob([byteArray], { type: "application/pdf" }));
}

export async function fetchDiagnosticReport({ patientId, documentId, departmentId, category, setLatestCurl }) {
  //if (!sourceId) throw new Error("sourceId is missing when calling fetchDiagnosticReport");

  const url = `/DiagnosticReport/${documentId}?patient=${patientId}&departmentId=${departmentId}&category=${category}`;
  return await cachedFhirFetch( 
    url,
    { sourceId, setLatestCurl },
     24 * 60 * 60 * 1000 // 1 day TTL
  );
  //return await fhirFetch(url, { sourceId: SOURCE_ID }, setLatestCurl);
}
