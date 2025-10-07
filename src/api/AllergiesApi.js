// src/api/AllergiesApi.js
import { fhirFetch } from "./fhir";

// ✅ Fetch allergies for a patient
export async function fetchAllergies(patientId, sourceId,departmentId) {
  return fhirFetch(`/AllergyIntolerance?patient=${patientId}&departmentId=${departmentId}`, {
    sourceId,
    headers: { "x-interaction-mode": "false" },
  });
}

// ✅ Create a new allergy
// export async function createAllergy(patientId, sourceId,departmentId, values) {
//   const now = new Date().toISOString();

//   const allergy = {
//     resourceType: "AllergyIntolerance",
//     clinicalStatus: {
//       coding: [
//         { system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical", code: values.status || "active" },
//       ],
//     },
//     verificationStatus: {
//       coding: [
//         { system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification", code: "unconfirmed" },
//       ],
//     },
//     type: "allergy",
//     category: ["food", "medication", "environment", "other"],
//     patient: { reference: `Patient/${patientId}` },
//     code: { text: values.allergy },
//     reaction: [
//       {
//         description: values.reaction,
//         severity: values.severity,
//         onset: values.onsetDate || now,
//       },
//     ],
//   };

//   return fhirFetch(`/AllergyIntolerance?patient=${patientId}&departmentId=${departmentId}`, {
//     sourceId,
//     method: "POST",
//     headers: { "Content-Type": "application/fhir+json" },
//     body: JSON.stringify(allergy),
//   });
// }
// ✅ Create a new allergy (all user-entered values)
export async function createAllergy(patientId, sourceId, departmentId, values) {
  const now = new Date().toISOString();

  const allergy = {
    resourceType: "AllergyIntolerance",
    clinicalStatus: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
          code: values.status || "active",
        },
      ],
    },
    verificationStatus: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification",
          code: "unconfirmed",
        },
      ],
    },
    type: "allergy",
    category: values.category ? [values.category] : ["medication"],
    code: {
      coding: [
        {
          system: "athena",
          code: values.code || "",
          display: values.allergy || "",
        },
      ],
      text: values.allergy || "",
    },
    patient: { reference: `Patient/${patientId}` },
    criticality: values.criticality || "high",
    note: values.note ? [{ text: values.note }] : [],
    onsetDateTime: values.onsetDate ? new Date(values.onsetDate).toISOString() : now,
    reaction: values.reaction
      ? [
          {
            description: values.reaction,
            severity: values.severity || "moderate",
            onset: values.onsetDate ? new Date(values.onsetDate).toISOString() : now,
          },
        ]
      : [],
    extension: [
      {
        url: "http://xcaliber-fhir/structureDefinition/department-id",
        valueString: String(departmentId),
      },
    ],
  };

  console.log("📤 createAllergy body:", allergy);

  return fhirFetch(`/AllergyIntolerance?patient=${patientId}&departmentId=${departmentId}`, {
    sourceId,
    method: "POST",
    body: allergy,
    headers: { "Content-Type": "application/fhir+json" },
  });
}
