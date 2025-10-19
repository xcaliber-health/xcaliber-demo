import { fhirFetch } from "./fhir"; 
import { cachedFhirFetch } from "./cachedFhirFetch";
import { ECW_MOCK_PATIENTS } from "../data/patientListMock";

export async function fetchPatients(
  sourceId,
  ehr,
  baseUrl,
  search = "",
  departmentId,
  setLatestCurl,
  options = {}
) {
  if (!sourceId) throw new Error("Missing sourceId when calling fetchPatients");

  // Determine the search term: use "sofia" only for Athena, otherwise use user input
  let searchForUrl = search || "";
  if (ehr.toLowerCase().startsWith("athena")) {
    searchForUrl = "sofia";
  }

  const safeSearch = searchForUrl.toLowerCase();

  // -------------------- Mock source (ECW or others) --------------------
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

  // -------------------- Real fetch for Athena/Elation --------------------
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

  // const bundle = await cachedFhirFetch(
  //   url,
  //   {
  //     baseUrl,
  //     sourceId,
  //     headers: options.headers,
  //     setLatestCurl,
  //   },
  //    24 * 60 * 60 * 1000 // 1 day TTL
  // );
  const bundle = await fhirFetch(url, {
    baseUrl,
    sourceId,
    headers: options.headers,
    setLatestCurl,
  });

  let patients = [];

  if (bundle.entry && bundle.entry.length > 0) {
    patients = bundle.entry.map((e) => {
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
        //gender: p.gender || "unknown",
        gender:
  p.gender ||
  p.extension?.find(
    (ext) => ext.url === "http://xcaliber-fhir/structureDefinition/legal-sex"
  )?.valueCode ||
  "unknown",

        birthDate: p.birthDate || "-",
        email,
        phone,
        status,
      };
    });
  } else if (!bundle.entry && bundle.id) {
    const p = bundle;
    const email = p.telecom?.find((t) => t.system === "email")?.value || null;
    const phone = p.telecom?.find((t) => t.system === "phone")?.value || null;
    const status =
      p.extension?.find(
        (ext) =>
          ext.url ===
          "http://xcaliber-fhir/structureDefinition/patient-status"
      )?.valueString || null;

    patients = [
      {
        id: p.id,
        name:
          p.name?.[0]?.text ||
          `${p.name?.[0]?.given?.[0] || ""} ${p.name?.[0]?.family || ""}`.trim(),
        // gender: p.gender || "unknown",
        gender:
  p.gender ||
  p.extension?.find(
    (ext) => ext.url === "http://xcaliber-fhir/structureDefinition/legal-sex"
  )?.valueCode ||
  "unknown",

        birthDate: p.birthDate || "-",
        email,
        phone,
        status,
      },
    ];
  }

  return patients;
}
