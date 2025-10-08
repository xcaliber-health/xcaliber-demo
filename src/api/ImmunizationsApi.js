
import { fhirFetch } from "./fhir"; 

// ✅ Fetch Immunizations for a patient
export async function fetchImmunizations(patientId, sourceId, departmentId, setLatestCurl) {
  const bundle = await fhirFetch(
    `/Immunization?patient=${patientId}&departmentId=${departmentId}`, // ✅ include departmentId
    {
      sourceId,
      headers: { "x-interaction-mode": "false" },
      setLatestCurl,
    }
  );
  return bundle;
}

// ✅ Create a new Immunization
export async function createImmunization(patientId, sourceId, departmentId, data) {
  const body = {
    resourceType: "Immunization",
    status: "completed",
    patient: { reference: `Patient/${patientId}` },
    vaccineCode: {
      text: data.vaccine,
    },
    occurrenceDate: data.occurrenceDate,
  };

  return await fhirFetch("/Immunization?patient=${patientId}&departmentId=${departmentId}", {
    sourceId,
    method: "POST",
    headers: { 
      "Content-Type": "application/fhir+json",
      "x-interaction-mode": false  
    },
    body,
  });
}
