const SAMPLE_BFF_URL = import.meta.env.VITE_SAMPLE_BFF_URL;

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

  // Simulated response: each object has an id and a display name
  const idsWithNames = [
    { id: "Lt2IFR5Ah76n4d8TFP5gBBtbOkJO5BGTAI4czidqc8I", name: "John William" },
    { id: "Lt2IFR5Ah76n4d8TFP5gBHRWfrw193tyBW53NMBgCq8", name: "Andrew Mills" },
  ];

  return idsWithNames;
}

// frontend/api.js
export async function getMappingForId(patientId) {

  if (!patientId) throw new Error("patientId is required");

  try {
    console.log(`Calling /api/migrate for patientId: ${patientId}`);
    const url = `${SAMPLE_BFF_URL}/api/migrate?patientId=${patientId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("came after BFF call")
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${errorText}`);
    }

    const data = await response.json();
    console.log("Migration result:", data);

    return data.fhirResponse.data.id; // contains migrated patient info
  } catch (err) {
    console.error("Error calling /api/migrate:", err);
    return null;
  }
}
