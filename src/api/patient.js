
import { fhirFetch } from "./fhir";

// Fetch list of patients (by name or ID)
export async function fetchPatients(sourceId, ehr, search = "william", departmentId, options = {}) {
  if (!sourceId) throw new Error("Missing sourceId when calling fetchPatients");

  // Detect if search is numeric → treat as patient ID
  const isNumeric = /^[0-9]+$/.test(search);
  let url;

  if (isNumeric) {
    // Search by ID
    url = `/Patient/${search}?departmentId=${departmentId}`;
  } else {
    // Search by name
    url = `/Patient?departmentId=${departmentId}&name=${encodeURIComponent(search)}`;
  }

  console.log("Fetching patients with URL:", url);

  const bundle = await fhirFetch(url, { sourceId, headers: options.headers });
  console.log("Raw FHIR Patient bundle:", bundle);

  // If searching by ID, bundle.entry might not exist (single patient)
  const entries = bundle.entry ? bundle.entry : [{ resource: bundle }];

  return entries.map((e) => {
    const p = e.resource;
    const email = p.telecom?.find((t) => t.system === "email")?.value || null;
    const phone = p.telecom?.find((t) => t.system === "phone")?.value || null;
    const status =
      p.extension?.find(
        (ext) => ext.url === "http://xcaliber-fhir/structureDefinition/patient-status"
      )?.valueString || null;

    return {
      id: p.id,
      name:
        p.name?.[0]?.text ||
        `${p.name?.[0]?.given?.[0] || ""} ${p.name?.[0]?.family || ""}`.trim(),
      gender: p.gender || "unknown",
      birthDate: p.birthDate || "-",
      email,
      phone,
      status,
    };
  });
}

// Fetch a single patient by ID
export async function fetchPatient(id, sourceId) {
  if (!id || !sourceId) throw new Error("Missing id or sourceId when calling fetchPatient");
  const url = `/Patient/${id}`;
  return fhirFetch(url, { sourceId });
}
