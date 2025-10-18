// src/api/procedureApi.js
import { fhirFetch } from "./fhir";
import { cachedFhirFetch } from "./cachedFhirFetch";

// ✅ Named export for fetchProcedures
export async function fetchProcedures({ patientId, departmentId, sourceId, setLatestCurl }) {
  const url = `/Procedure?patient=${patientId}&departmentId=${departmentId}`;
  const bundle = await cachedFhirFetch(
    url,
    {
      method: "GET",
      sourceId,
      headers: { "x-interaction-mode": "false" },
      setLatestCurl,
    },
     24 * 60 * 60 * 1000 // 1 day TTL
  );
  return bundle.entry?.map((e) => e.resource) || [];
}

// ✅ Named export for mapProcedureRow
export function mapProcedureRow(res) {
  const procedure = res.code?.coding?.[0]?.display || "N/A";
  const status = res.status || "N/A";
  const date = res.performedDateTime
    ? new Date(res.performedDateTime).toLocaleDateString()
    : "N/A";
  return [procedure, status, date];
}

// ✅ Named export for addProcedure
export async function addProcedure({ patientId, departmentId, sourceId, setLatestCurl, data }) {
  const postBody = {
    resourceType: "Procedure",
    subject: { reference: `Patient/${patientId}` },
    status: data.status || "unknown",
    performedDateTime: new Date(data.performedDate).toISOString(),
    code: {
      coding: [
        {
          system: "CPT",
          code: data.procedureCode,
          display: data.procedureDisplay,
        },
      ],
    },
    note: data.note ? [{ text: data.note }] : [],
    extension: [
      {
        url: "http://xcaliber-fhir/structureDefinition/department-id",
        valueString: departmentId.toString(),
      },
    ],
  };

  return await fhirFetch("/Procedure", {
    method: "POST",
    sourceId,
    headers: { "Content-Type": "application/fhir+json" },
    body: postBody,
    setLatestCurl,
  });
}
