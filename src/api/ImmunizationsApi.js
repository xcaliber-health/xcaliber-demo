import { fhirFetch } from "./fhir"; 
import { cachedFhirFetch } from "./cachedFhirFetch";

// ✅ Fetch Immunizations for a patient
export async function fetchImmunizations(patientId, sourceId, departmentId, setLatestCurl) {
  const bundle = await cachedFhirFetch(
    `/Immunization?patient=${patientId}&departmentId=${departmentId}`, // ✅ include departmentId
    {
      sourceId,
      headers: { "x-interaction-mode": "false" },
      setLatestCurl,
    },
    5 * 60 * 1000 // TTL 5 minutes
  );
  return bundle;
}

export async function createImmunization(patientId, sourceId, departmentId, data) {
  if (!data.vaccineCvx) {
    throw new Error("Vaccine CVX code is required");
  }

  const body = {
    resourceType: "Immunization",
    status: "completed",
    vaccineCode: {
      coding: [
        { system: "http://hl7.org/fhir/sid/cvx", code: data.vaccineCvx }
      ]
    },
    occurrenceDateTime: new Date(data.occurrenceDate).toISOString().replace(/\.\d{3}Z$/, "Z"),
    extension: [
      {
        url: "http://xcaliber-fhir/structureDefinition/department-id",
        valueString: String(data.departmentId || departmentId || "")
      }
    ],
    patient: {
      reference: `Patient/${patientId}`
    }
  };

  console.log("📤 Immunization POST body:", body);

  return await fhirFetch(`/Immunization`, {
    sourceId,
    method: "POST",
    body,
    headers: { "Content-Type": "application/fhir+json" },
  });
}
