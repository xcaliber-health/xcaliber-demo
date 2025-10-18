import { fhirFetch } from "./fhir";
import { cachedFhirFetch } from "./cachedFhirFetch";

// Relationship → code mapping
const relationshipCodeMap = {
  "Mother": "1",
  "Father": "2",
  "Brother": "3",
  "Sister": "4",
  "Son": "5",
  "Daughter": "6",
  "Maternal Grandmother": "7",
  "Maternal Grandfather": "8",
  "Paternal Grandmother": "9",
  "Paternal Grandfather": "10",
  "Maternal Aunt": "11",
  "Maternal Uncle": "12",
  "Paternal Aunt": "13",
  "Paternal Uncle": "14",
  "Unspecified Relation": "15"
};

// ✅ Fetch Family History
export async function fetchFamilyHistory(patientId, sourceId, departmentId, setLatestCurl) {
  const bundle = await cachedFhirFetch( 
    `/FamilyMemberHistory?patient=${patientId}&departmentId=${departmentId}`,
    {
      sourceId,
      headers: { "x-interaction-mode": "false" },
      setLatestCurl
    },
    5 * 60 * 1000 // TTL 5 minutes
  );
  return bundle;
}

// ✅ Create Family History
export async function createFamilyHistory(patientId, sourceId, departmentId, data) {
  const relationshipCode = relationshipCodeMap[data.relation] || "0"; // fallback code

  const body = {
    resourceType: "FamilyMemberHistory",
    relationship: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/v3-FamilyMember",
          code: relationshipCode,
          display: data.relation
        }
      ]
    },
    condition: [
      {
        code: {
          coding: [
            {
              system: "http://snomed.info/sct",
              code: "73211009", // fixed code for any condition
              display: data.condition
            }
          ]
        },
        note: [
          {
            text: `Diagnosed at age ${new Date().getFullYear() - 1970}` // Example note
          }
        ]
      }
    ],
    extension: [
      {
        url: "http://xcaliber-fhir/structureDefinition/SECTION_NOTE",
        valueString: "Family history notes"
      },
      {
        url: "http://xcaliber-fhir/structureDefinition/department-id",
        valueString: String(departmentId)
      }
    ],
    patient: { reference: `Patient/${patientId}` }
  };

  console.log("📤 FamilyHistory POST body:", body);

  return await fhirFetch(`/FamilyMemberHistory`, {
    sourceId,
    method: "POST",
    body,
    headers: { "Content-Type": "application/fhir+json" }
  });
}
