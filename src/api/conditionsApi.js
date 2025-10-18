import { fhirFetch } from "./fhir";
import { cachedFhirFetch } from "./cachedFhirFetch"; 

// ---------------- SNOMED mapping ----------------
export const conditionMapping = {
  "Cough": "49727002",
  "Fever": "386661006",
  "Headache": "25064002",
};

// ---------------- Clinical Status Options ----------------
export const clinicalStatusOptions = ["Active", "inactive", "resolved", "chronic"];

// Fetch all conditions for a patient
export async function fetchConditions(patientId, departmentId, sourceId, setLatestCurl) {
  if (!patientId || !departmentId || !sourceId) {
    throw new Error("Missing required parameters for fetchConditions");
  }

  const url = `/Condition?patient=${patientId}&departmentId=${departmentId}&category=problem-list-item`;


  const bundle = await cachedFhirFetch(
    url,
    {
      sourceId,
      headers: { "x-interaction-mode": "false" },
      setLatestCurl,
    },
     24 * 60 * 60 * 1000 // 1 day TTL
  );

  return bundle.entry?.map((e) => e.resource) || [];
}

// Map FHIR Condition resource to table row
export function mapConditionRow(res) {
  const conditionName = res.code?.coding?.[0]?.display;
  const clinicalStatus =
    res.extension?.find(
      (ext) => ext.url === "http://xcaliber-fhir/structureDefinition/status"
    )?.valueString || res.status;
  const onsetDate =
    res.extension?.find(
      (ext) => ext.url === "http://xcaliber-fhir/structureDefinition/on-set-date"
    )?.valueDateTime || res.onsetDateTime;

  return [
    conditionName,
    clinicalStatus,
    onsetDate && new Date(onsetDate).toLocaleDateString(),
  ].filter(Boolean);
}

// Build FHIR Condition POST body
export function buildConditionBody(formData, patientId, departmentId) {
  const clinicalStatusCode =
    formData.clinicalStatus.toLowerCase() === "chronic" ? "CHRONIC" : formData.clinicalStatus.charAt(0)
    + formData.clinicalStatus.slice(1);

  const extensionStatus =
    formData.clinicalStatus.toLowerCase() === "chronic" ? "CHRONIC" : formData.clinicalStatus;

  return {
    resourceType: "Condition",
    category: [
      {
        coding: [
          {
            code: formData.category,
            display: "Problem List Item",
            system: "http://terminology.hl7.org/CodeSystem/condition-category",
          },
        ],
        text: "Problem",
      },
    ],
    clinicalStatus: {
      coding: [
        {
          code: clinicalStatusCode,
          display: clinicalStatusCode,
        },
      ],
    },
    code: {
      coding: [
        {
          code: conditionMapping[formData.conditionName],
          display: formData.conditionName + " (finding)",
          system: "http://snomed.info/sct",
        },
        {
          code: "R05.9",
          display: formData.conditionName + ", unspecified",
          system: "ICD10",
          extension: [{ url: "http://foldhealth.io/Structure/cross-walked-codes", valueBoolean: true }],
        },
        {
          code: "R05.9",
          display: formData.conditionName + ", unspecified",
          system: "http://hl7.org/fhir/sid/icd-10-cm",
          extension: [{ url: "http://foldhealth.io/Structure/cross-walked-codes", valueBoolean: true }],
        },
      ],
      text: formData.conditionName + " (finding)",
    },
    contained: [
      {
        resourceType: "ClinicalImpression",
        status: "completed",
        subject: { reference: `Patient/${patientId}` },
        extension: [{ url: "http://xcaliber-fhir/structureDefinition/status", valueString: "" }],
      },
    ],
    extension: [
      { url: "https://foldhealth.io/structure/account-uuid", valueString: "49a6927a-c3d6-4284-ac67-4b5f9ad47604" },
      { url: "https://foldhealth.io/structure/ehr-code", valueString: "FOLD_ELATION_EHR" },
      { url: "https://foldhealth.io/structure/location-group-id", valueString: "74802ba4-0fdc-48f9-bee0-34bd9e5c738d" },
      { url: "http://foldhealth.io/Structure/cross-walked-codes", valueString: "true" },
      { url: "http://xcaliber-fhir/structureDefinition/status", valueString: extensionStatus },
      { url: "http://xcaliber-fhir/structureDefinition/department-id", valueString: `${departmentId}` },
    ],
    identifier: [
      { system: "https://foldhealth.io/structure/resource-group-identifier", value: "f93d28a6-8cc7-41c0-bb88-3f6f02bddabf" },
      { system: "https://foldhealth.io/structure/resource-version-identifier", value: "703f8839-90e2-4e43-946f-c55e0b8c40cd" },
    ],
    meta: { lastUpdated: new Date().toISOString() },
    note: formData.note ? [{ text: formData.note }] : undefined,
    onsetDateTime: formData.onsetDate || undefined,
    subject: { reference: `Patient/${patientId}` },
  };
}

// Create a new condition
export async function createCondition(formData, patientId, departmentId, sourceId, setLatestCurl) {
  if (!sourceId) throw new Error("sourceId is required to create condition");

  const body = buildConditionBody(formData, patientId, departmentId);

  return await fhirFetch(`/Condition`, {
    sourceId,
    method: "POST",
    body,
    headers: { "Content-Type": "application/fhir+json" },
    setLatestCurl,
  });
}
