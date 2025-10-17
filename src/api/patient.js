


// import { fhirFetch } from "./fhir";
// import { ECW_MOCK_PATIENTS } from "../mocks/patientListMock";


// export async function fetchPatients(
//   sourceId,
//   ehr,
//   baseUrl,
//   search = "william",
//   departmentId,
//   setLatestCurl,
//   options = {}
// ) {
//   if (!sourceId) throw new Error("Missing sourceId when calling fetchPatients");

//   // ✅ ECW data
//   if (sourceId === import.meta.env.VITE_SOURCE_ID_ECW) {
//     const delay = Math.floor(Math.random() * 400) + 1800;
//     await new Promise((resolve) => setTimeout(resolve, delay));
//     const safeSearch = (search || "").toLowerCase();
//     return ECW_MOCK_PATIENTS.filter((p) => p.name.toLowerCase().includes(safeSearch));
//   }

//   // Non-ECW: original logic
//   const safeSearch = String(search || "");
//   const isNumeric = /^[0-9]+$/.test(safeSearch);
//   const includeDept = sourceId !== import.meta.env.VITE_SOURCE_ID_ECW;

//   let url;
//   if (isNumeric) {
//     url = includeDept
//       ? `/Patient/${safeSearch}?departmentId=${departmentId}`
//       : `/Patient/${safeSearch}`;
//   } else {
//     url = includeDept
//       ? `/Patient?departmentId=${departmentId}&name=${encodeURIComponent(safeSearch)}`
//       : `/Patient?name=${encodeURIComponent(safeSearch)}`;
//   }

//   console.log("Fetching patients with path:", url);

//   const bundle = await fhirFetch(url, { baseUrl, sourceId, headers: options.headers, setLatestCurl });
//   console.log("Raw FHIR Patient bundle:", bundle);

//   if (bundle.entry && bundle.entry.length > 0) {
//     return bundle.entry.map((e) => {
//       const p = e.resource;
//       const email = p.telecom?.find((t) => t.system === "email")?.value || null;
//       const phone = p.telecom?.find((t) => t.system === "phone")?.value || null;
//       const status = p.extension?.find(
//         (ext) => ext.url === "http://xcaliber-fhir/structureDefinition/patient-status"
//       )?.valueString || null;

//       return {
//         id: p.id,
//         name: p.name?.[0]?.text || `${p.name?.[0]?.given?.[0] || ""} ${p.name?.[0]?.family || ""}`.trim(),
//         gender: p.gender || "unknown",
//         birthDate: p.birthDate || "-",
//         email,
//         phone,
//         status,
//       };
//     });
//   }

//   if (!bundle.entry && bundle.id) {
//     const p = bundle;
//     const email = p.telecom?.find((t) => t.system === "email")?.value || null;
//     const phone = p.telecom?.find((t) => t.system === "phone")?.value || null;
//     const status = p.extension?.find(
//       (ext) => ext.url === "http://xcaliber-fhir/structureDefinition/patient-status"
//     )?.valueString || null;

//     return [
//       {
//         id: p.id,
//         name: p.name?.[0]?.text || `${p.name?.[0]?.given?.[0] || ""} ${p.name?.[0]?.family || ""}`.trim(),
//         gender: p.gender || "unknown",
//         birthDate: p.birthDate || "-",
//         email,
//         phone,
//         status,
//       },
//     ];
//   }

//   return [];
// }

// // Fetch a single patient by ID
// export async function fetchPatient(id, sourceId, setLatestCurl) {
//   if (!id || !sourceId) throw new Error("Missing id or sourceId when calling fetchPatient");

//   // ✅ ECW data
//   if (sourceId === import.meta.env.VITE_SOURCE_ID_ECW) {
//     const delay = Math.floor(Math.random() * 400) + 1800;
//     await new Promise((resolve) => setTimeout(resolve, delay));
//     return ECW_MOCK_PATIENTS.find((p) => p.id === id) || null;
//   }

//   // Non-ECW
//   const url = `/Patient/${id}`;
//   return fhirFetch(url, { sourceId, setLatestCurl });
// }
import { fhirFetch } from "./fhir"; 
import { ECW_MOCK_PATIENTS } from "../data/patientListMock";

export async function fetchPatients(
  sourceId,
  ehr,
  baseUrl,
  search = "william",
  departmentId,
  setLatestCurl,
  options = {}
) {
  if (!sourceId) throw new Error("Missing sourceId when calling fetchPatients");

  const safeSearch = (search || "").toLowerCase();

  // Use ECW data for ECW and all other non-Athena/Elation sources
  if (
    sourceId === import.meta.env.VITE_SOURCE_ID_ECW ||
    (sourceId !== import.meta.env.VITE_SOURCE_ID_ATHENA &&
      sourceId !== import.meta.env.VITE_SOURCE_ID_ELATION)
  ) {
    const delay = Math.floor(Math.random() * 400) + 800;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return ECW_MOCK_PATIENTS.filter((p) =>
      p.name.toLowerCase().includes(safeSearch)
    );
  }

  // Real fetch for Athena/Elation
  const isNumeric = /^[0-9]+$/.test(safeSearch);
  const includeDept = sourceId !== import.meta.env.VITE_SOURCE_ID_ECW;

  let url;
  if (isNumeric) {
    url = includeDept
      ? `/Patient/${safeSearch}?departmentId=${departmentId}`
      : `/Patient/${safeSearch}`;
  } else {
    url = includeDept
      ? `/Patient?departmentId=${departmentId}&name=${encodeURIComponent(
          safeSearch
        )}`
      : `/Patient?name=${encodeURIComponent(safeSearch)}`;
  }

  console.log("Fetching patients with path:", url);

  const bundle = await fhirFetch(url, {
    baseUrl,
    sourceId,
    headers: options.headers,
    setLatestCurl,
  });
  console.log("Raw FHIR Patient bundle:", bundle);

  if (bundle.entry && bundle.entry.length > 0) {
    return bundle.entry.map((e) => {
      const p = e.resource;
      const email = p.telecom?.find((t) => t.system === "email")?.value || null;
      const phone = p.telecom?.find((t) => t.system === "phone")?.value || null;
      const status =
        p.extension?.find(
          (ext) =>
            ext.url ===
            "http://xcaliber-fhir/structureDefinition/patient-status"
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

  if (!bundle.entry && bundle.id) {
    const p = bundle;
    const email = p.telecom?.find((t) => t.system === "email")?.value || null;
    const phone = p.telecom?.find((t) => t.system === "phone")?.value || null;
    const status =
      p.extension?.find(
        (ext) =>
          ext.url ===
          "http://xcaliber-fhir/structureDefinition/patient-status"
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

  return [];
}
