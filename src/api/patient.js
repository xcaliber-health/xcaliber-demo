
// import { fhirFetch } from "./fhir";

// // Fetch list of patients (by name or ID)
// export async function fetchPatients(sourceId, ehr, search = "william", departmentId,setLatestCurl, options = {}) {
//   if (!sourceId) throw new Error("Missing sourceId when calling fetchPatients");

//   // Detect if search is numeric → treat as patient ID
//   const isNumeric = /^[0-9]+$/.test(search);
//   let url;

//   if (isNumeric) {
//     // Search by ID
//     url = `/Patient/${search}?departmentId=${departmentId}`;
//   } else {
//     // Search by name
//     url = `/Patient?departmentId=${departmentId}&name=${encodeURIComponent(search)}`;
//   }

//   console.log("Fetching patients with URL:", url);

//   const bundle = await fhirFetch(url, { sourceId, headers: options.headers,setLatestCurl, });
//   console.log("Raw FHIR Patient bundle:", bundle);

//   // If searching by ID, bundle.entry might not exist (single patient)
//   const entries = bundle.entry ? bundle.entry : [{ resource: bundle }];

//   return entries.map((e) => {
//     const p = e.resource;
//     const email = p.telecom?.find((t) => t.system === "email")?.value || null;
//     const phone = p.telecom?.find((t) => t.system === "phone")?.value || null;
//     const status =
//       p.extension?.find(
//         (ext) => ext.url === "http://xcaliber-fhir/structureDefinition/patient-status"
//       )?.valueString || null;

//     return {
//       id: p.id,
//       name:
//         p.name?.[0]?.text ||
//         `${p.name?.[0]?.given?.[0] || ""} ${p.name?.[0]?.family || ""}`.trim(),
//       gender: p.gender || "unknown",
//       birthDate: p.birthDate || "-",
//       email,
//       phone,
//       status,
//     };
//   });
// }
import { fhirFetch } from "./fhir";
export async function fetchPatients(sourceId, ehr, search = "william", departmentId, setLatestCurl, options = {}) {
  if (!sourceId) throw new Error("Missing sourceId when calling fetchPatients");

  const isNumeric = /^[0-9]+$/.test(search);
  let url;

  if (isNumeric) {
    url = `/Patient/${search}?departmentId=${departmentId}`;
  } else {
    url = `/Patient?departmentId=${departmentId}&name=${encodeURIComponent(search)}`;
  }

  console.log("Fetching patients with URL:", url);

  const bundle = await fhirFetch(url, { sourceId, headers: options.headers, setLatestCurl });
  console.log("Raw FHIR Patient bundle:", bundle);

  // If bundle.entry exists and has entries, map them
  if (bundle.entry && bundle.entry.length > 0) {
    return bundle.entry.map((e) => {
      const p = e.resource;
      const email = p.telecom?.find((t) => t.system === "email")?.value || null;
      const phone = p.telecom?.find((t) => t.system === "phone")?.value || null;
      const status = p.extension?.find(
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

  // If searching by ID and bundle is a single patient, check if it has an ID
  if (!bundle.entry && bundle.id) {
    const p = bundle;
    const email = p.telecom?.find((t) => t.system === "email")?.value || null;
    const phone = p.telecom?.find((t) => t.system === "phone")?.value || null;
    const status = p.extension?.find(
      (ext) => ext.url === "http://xcaliber-fhir/structureDefinition/patient-status"
    )?.valueString || null;

    return [
      {
        id: p.id,
        name:
          p.name?.[0]?.text ||
          `${p.name?.[0]?.given?.[0] || ""} ${p.name?.[0]?.family || ""}`.trim(),
        gender: p.gender || "unknown",
        birthDate: p.birthDate || "-",
        email,
        phone,
        status,
      },
    ];
  }

  // If no patients found, return empty array
  return [];
}


// Fetch a single patient by ID
export async function fetchPatient(id, sourceId, setLatestCurl) {
  if (!id || !sourceId) throw new Error("Missing id or sourceId when calling fetchPatient");
  const url = `/Patient/${id}`;
  return fhirFetch(url, { sourceId, setLatestCurl  });
}
