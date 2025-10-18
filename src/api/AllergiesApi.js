// src/api/AllergiesApi.js
import { cachedFhirFetch } from "./cachedFhirFetch";
import { fhirFetch } from "./fhir";

const ELATION_SOURCE_ID = import.meta.env.VITE_SOURCE_ID_ELATION;

// ✅ Fetch allergies for a patient
export async function fetchAllergies(patientId, sourceId, departmentId, setLatestCurl) {
  const url =
    sourceId === ELATION_SOURCE_ID
      ? `/AllergyIntolerance?patient=${patientId}`
      : `/AllergyIntolerance?patient=${patientId}&departmentId=${departmentId}`;


  return cachedFhirFetch(
    url,
    {
      sourceId,
      headers: {
        "x-interaction-mode": "false",
      },
      setLatestCurl,
    },
     24 * 60 * 60 * 1000 // 1 day TTL
  );
}

// ✅ Create a new allergy (all user-entered values)

export async function createAllergy(patientId, sourceId, departmentId, values, setLatestCurl) {
  const allergyMap = {
    Penicillin: "12345", // allergy name → allergenid & code
    "Fish Containing Products": "24442",
    "fish derived": "19244",
    "fish oil": "20408",
    crayfish: "92426",
    "shellfish derived": "25168",
  };

  const allergenid = allergyMap[values.allergy] || "";

  const allergy = {
    resourceType: "AllergyIntolerance",

    code: {
      coding: [
        {
          system: "athena",      // hidden fixed system
          code: allergenid,      // set from allergyMap
          display: values.allergy // allergy name from dropdown
        },
      ],
      text: values.allergy,
    },

    category: values.category ? [values.category] : ["medication"],

    patient: {
      reference: `Patient/${patientId}`,
    },

    criticality: values.criticality || "high",

    note: values.note ? [{ text: values.note }] : [],

    onsetDateTime: values.onsetDateTime
      ? new Date(values.onsetDateTime).toISOString()
      : new Date().toISOString(),

    reaction: [],

    allergenid: allergenid, // required field

    extension: [
      ...(values.deactivatedDate
        ? [
            {
              url: "http://xcaliber-fhir/structureDefinition/DEACTIVATEDDATE",
              valueString: new Date(values.deactivatedDate).toISOString(),
            },
          ]
        : []),

      ...(values.reactivatedDate
        ? [
            {
              url: "http://xcaliber-fhir/structureDefinition/REACTIVATEDATE",
              valueDate: values.reactivatedDate,
            },
          ]
        : []),

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
    setLatestCurl,
  });
}
