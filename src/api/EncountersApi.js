import { fhirFetch } from "./fhir";
import { cachedFhirFetch } from "./cachedFhirFetch"; 

const ELATION_SOURCE_ID = import.meta.env.VITE_SOURCE_ID_ELATION;

// ✅ Fetch Encounters
export async function fetchEncounters(patientId, sourceId, departmentId, setLatestCurl) {
  // Use different URL if source is Elation
  const url =
    sourceId === ELATION_SOURCE_ID
      ? `/Encounter?patient=${patientId}`
      : `/Encounter?patient=${patientId}&departmentId=${departmentId}`;

  const bundle = await cachedFhirFetch(
    url,
    {
      sourceId,
      headers: {
        "x-interaction-mode": "false",
      },
      setLatestCurl,
    },
    5 * 60 * 1000 // TTL 5 minutes
  );

  return bundle;
}

// ✅ Create Encounter

const CLASS_MAP = {
  Ambulatory: { code: "AMB", system: "http://terminology.hl7.org/CodeSystem/v3-ActCode" },
};

export async function createEncounter(patientId, sourceId, departmentId, data) {
  const classData = CLASS_MAP[data.classOption] || CLASS_MAP.Ambulatory;

  const body = {
    resourceType: "Encounter",
    status: data.status || "in-progress",
    class: {
      system: classData.system,
      code: classData.code,
      display: data.classOption
    },
    period: {
      start: new Date(data.start).toISOString().replace(/\.\d{3}Z$/, "Z"),
      ...(data.end
        ? { end: new Date(data.end).toISOString().replace(/\.\d{3}Z$/, "Z") }
        : {})
    },
    extension: [
      {
        url: "http://xcaliber-fhir/structureDefinition/department-id",
        valueString: String(departmentId)
      },
      {
        url: "http://xcaliber-fhir/structureDefinition/provider-first-name",
        valueString: data.providerFirstName
      },
      {
        url: "http://xcaliber-fhir/structureDefinition/provider-last-name",
        valueString: data.providerLastName
      },
      {
        url: "http://xcaliber-fhir/structureDefinition/category",
        valueString: data.categoryOption || "order"
      }
    ],
    subject: { reference: `Patient/${patientId}` }
  };

  console.log("📤 Encounter POST body:", body);

  return await fhirFetch(`/Encounter`, {
    sourceId,
    method: "POST",
    body,
    headers: { "Content-Type": "application/fhir+json" }
  });
}
