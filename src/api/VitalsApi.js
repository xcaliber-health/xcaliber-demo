
import { fhirFetch } from "./fhir";

// GET all vitals
export async function fetchVitals(patientId, departmentId, sourceId, setLatestCurl) {
  return fhirFetch(`/Observation?patient=${patientId}&departmentId=${departmentId}`, {
    sourceId,
    headers: { "x-interaction-mode": "false" },
    setLatestCurl,
  });
}

// POST new vital matching exact JSON body
export async function createVitals(patientId, departmentId, sourceId, values) {
  if (!values.name || !values.value) {
    throw new Error("Vital name and value are required");
  }

  const now = new Date().toISOString();

  const observation = {
    resourceType: "Observation",
    issued: now,
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "85354-9", 
          display: values.name,
        },
      ],
    },
    valueQuantity: {
      value: Number(values.value),
      unit: values.unit || "mmHg",
    },
    extension: [
      {
        url: "http://xcaliber-fhir/structureDefinition/department-id",
        valueString: String(departmentId),
      },
      {
        url: "http://xcaliber-fhir/structureDefinition/SOURCE",
        valueString: sourceId,
      },
    ],
    patient: { reference: `Patient/${patientId}` },
    departmentId: { reference: `departmentId/${departmentId}` },
  };

  console.log("📤 Vital POST body:", observation);

  return fhirFetch(`/Observation?departmentId=${departmentId}&patient=${patientId}`, {
    sourceId,
    method: "POST",
    body: observation, // pass object directly
    headers: { "Content-Type": "application/fhir+json" },
  });
}
