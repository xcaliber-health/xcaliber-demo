// src/api/AllergiesApi.js
import { fhirFetch } from "./fhir";

// ✅ Fetch allergies for a patient
export async function fetchAllergies(patientId, sourceId,departmentId) {
  return fhirFetch(`/AllergyIntolerance?patient=${patientId}&departmentId=${departmentId}`, {
    sourceId,
    headers: { "x-interaction-mode": "true" },
  });
}

// ✅ Create a new allergy
export async function createAllergy(patientId, sourceId,departmentId, values) {
  const now = new Date().toISOString();

  const allergy = {
    resourceType: "AllergyIntolerance",
    clinicalStatus: {
      coding: [
        { system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical", code: values.status || "active" },
      ],
    },
    verificationStatus: {
      coding: [
        { system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification", code: "unconfirmed" },
      ],
    },
    type: "allergy",
    category: ["food", "medication", "environment", "other"],
    patient: { reference: `Patient/${patientId}` },
    code: { text: values.allergy },
    reaction: [
      {
        description: values.reaction,
        severity: values.severity,
        onset: values.onsetDate || now,
      },
    ],
  };

  return fhirFetch(`/AllergyIntolerance?patient=${patientId}&departmentId=${departmentId}`, {
    sourceId,
    method: "POST",
    headers: { "Content-Type": "application/fhir+json" },
    body: JSON.stringify(allergy),
  });
}
