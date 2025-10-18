
import { cachedFhirFetch } from "./cachedFhirFetch";
import { fhirFetch } from "./fhir";
import { cache } from "./cache"; 

// GET all vitals
export async function fetchVitals(patientId, departmentId, sourceId, setLatestCurl) {
  const url = `/Observation?patient=${patientId}&departmentId=${departmentId}`;

  return cachedFhirFetch(
    url,
    {
      method: "GET",
      sourceId,
      headers: { "x-interaction-mode": "false" },
      setLatestCurl,
    },
     24 * 60 * 60 * 1000 // 1 day TTL
  );
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
      { url: "http://xcaliber-fhir/structureDefinition/department-id", valueString: String(departmentId) },
      { url: "http://xcaliber-fhir/structureDefinition/SOURCE", valueString: sourceId },
    ],
    patient: { reference: `Patient/${patientId}` },
    departmentId: { reference: `departmentId/${departmentId}` },
  };

  console.log("Vital POST body:", observation);

  const result = await fhirFetch(
    `/Observation?departmentId=${departmentId}&patient=${patientId}`,
    {
      sourceId,
      method: "POST",
      body: observation,
      headers: { "Content-Type": "application/fhir+json" },
    }
  );

  // Clear cached GET for this patient & department
  const cacheKeyPrefix = `GET:/Observation?patient=${patientId}&departmentId=${departmentId}`;
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith(cacheKeyPrefix)) localStorage.removeItem(key);
  });

  return result;
}

