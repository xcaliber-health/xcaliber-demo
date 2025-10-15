
// src/api/bulkData.js

// Simulated delay helper
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function getResources(ehrName) {
  console.log(`Fetching resources for ${ehrName}`);
  await delay(700);
  // Simulated list of FHIR resources
  return ["Patient", "Observation", "Condition", "Encounter", "AllergyIntolerance"];
}

export async function getIdsForResource(ehrName, resourceName) {
  console.log(`Fetching IDs for ${ehrName} - ${resourceName}`);
  await delay(700);
  // Simulated source IDs
  return Array.from({ length: 3 }, (_, i) => `${resourceName}-${i + 1}`);
}

export async function getMappingForId(sourceEHR, targetEHR, resourceName, id) {
  console.log(`Mapping ${id} from ${sourceEHR} → ${targetEHR}`);
  await delay(1000);
  // Simulated realistic target ID — looks like a real ID, not a label
  const numericPart = id.split("-").pop();
  return `${targetEHR.substring(0, 3).toUpperCase()}-${resourceName}-${numericPart}`;
}
