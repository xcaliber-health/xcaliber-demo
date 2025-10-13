
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


export async function createImmunization(patientId, sourceId, departmentId, data) {
  const vaccineMap = {
    "Influenza": { cvx: "141", ndc: "49281-0400-20" },
  };

  const selectedVaccine = vaccineMap[data.vaccineName] || { cvx: "", ndc: "" };

  const body = {
    resourceType: "Immunization",
    status: "completed",
    vaccineCode: {
      coding: [
        { system: "http://hl7.org/fhir/sid/cvx", code: selectedVaccine.cvx },
        { system: "http://hl7.org/fhir/sid/ndc", code: selectedVaccine.ndc }
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

  // ✅ Read body once
  return await fhirFetch(`/Immunization`, {
    sourceId,
    method: "POST",
    body,
    headers: { "Content-Type": "application/fhir+json" },
  });
}
