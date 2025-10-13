const SOURCE_ID = "ef123977-6ef1-3e8e-a30f-3879cea0b344";
const BEARER_TOKEN = import.meta.env.VITE_API_TOKEN; 
const DEPARTMENT_ID = 1;

// Build FHIR Patient resource with only 4 fields editable
function buildPatientResource(patient) {
  const [givenName, familyName] = patient.entity_value
    ? patient.entity_value.split(" ")
    : ["Unknown", "Unknown"];

  return {
    resourceType: "Patient",
    name: [
      {
        family: familyName || "Unknown",
        given: [givenName || "Unknown"],
        text: patient.entity_value,
        use: "official",
      },
      {
        given: [" "],
        text: "",
        use: "usual",
      },
    ],
    birthDate: patient.birth_datetime || "1970-01-01",
    gender: patient.sex?.toLowerCase().startsWith("m") ? "male" : "female",
    address: [
      {
        city: "Floral Park",
        postalCode: "11001",
        state: "NY",
        type: "both",
        use: "home",
      },
    ],
    telecom: [
      {
        extension: [
          { url: "https://foldhealth.io/structure/is-verified" }
        ],
        rank: 1,
        system: "email",
        use: "home",
        value: "rajeevc+testapp@fold.health",
      },
      { system: "phone", use: "mobile", value: "" },
      { system: "phone", use: "home", value: "" },
    ],
    communication: [{ language: {}, preferred: true }],
    contained: [
      {
        resourceType: "Consent",
        category: [],
        extension: [
          { url: "http://xcaliber-fhir/structureDefinition/consent-to-call", valueBoolean: true },
          { url: "http://xcaliber-fhir/structureDefinition/consent-to-text", valueBoolean: true },
        ],
        scope: {},
        status: "active",
      },
    ],
    extension: [
      {
        url: "http://xcaliber-fhir/structureDefinition/us-core-birthsex",
        valueCode: patient.sex?.toLowerCase().startsWith("m") ? "M" : "F",
      },
      {
        url: "http://xcaliber-fhir/structureDefinition/blood-group-id",
        valueString: "a6f47e00-4981-4fcc-bab8-e5e1b629c1ef",
      },
      {
        url: "http://xcaliber-fhir/structureDefinition/department-id",
        valueString: String(DEPARTMENT_ID),
      },
    ],
    generalPractitioner: [],
    identifier: [
      {
        use: "official",
        system: "http://xcaliber-fhir/patient-id",
        value: patient.patient_id,
      },
    ],
  };
}

// Submit function for entity container
export async function submitEntity(entityContainer) {
  try {
    if (entityContainer.patients?.length > 0) {
      for (const patient of entityContainer.patients) {
        const resource = buildPatientResource(patient);
        const url = `https://blitz.xcaliberapis.com/fhir-gateway-2/fhir/R4/Patient?patient=${patient.patient_id}`;

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/fhir+json",
            "Authorization": `Bearer ${BEARER_TOKEN}`,
            "X-Source-Id": SOURCE_ID,
          },
          body: JSON.stringify(resource),
        });

        const data = await res.json();
        console.log("✅ Submitted patient:", data);
      }
    }

    // TODO: Handle other resources like observations, labs, encounters, etc.
  } catch (err) {
    console.error("❌ Error submitting entity:", err);
  }
}
