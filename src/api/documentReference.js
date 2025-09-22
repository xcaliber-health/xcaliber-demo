import { fhirFetch } from "./fhir"; // your existing fhirFetch wrapper

// Fetch documents list for a patient + category + department
export async function fetchDocumentReferences(patientId, category, departmentId) {
  const url = `/fhir-gateway-2/fhir/R4/DocumentReference?patient=${patientId}&category=${category}&departmentId=${departmentId}`;
  const bundle = await fhirFetch(url);

  return (bundle.entry || []).map(e => {
    const doc = e.resource;
    return {
      id: doc.id,
      title: doc.description || doc.type?.text || "Untitled",
      date: doc.date || "N/A",
      status: doc.status || "N/A",
    };
  });
}

// Fetch full document + mapped data
export async function fetchDocumentReferenceById(documentId, patientId, departmentId) {
  const url = `/fhir-gateway-2/fhir/R4/DocumentReference/${documentId}?patient=${patientId}&departmentId=${departmentId}`;
  const doc = await fhirFetch(url);

  // Extract raw content
  const rawContent = doc.content?.[0]?.attachment?.data || "";

  // Map FHIR resource to structured data (simplified example)
  const mappedData = {
    patientInfo: {
      name: doc.subject?.display || "Unknown",
      reference: doc.subject?.reference || "",
    },
    conditions: doc.conditions || [],
    medications: doc.medications || [],
    allergies: doc.allergies || [],
    observations: doc.observations || [],
    encounters: doc.encounters || [],
  };

  return {
    fhirResponse: doc,
    mappedData,
    rawContent,
  };
}
