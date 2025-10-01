

const BASE = import.meta.env.VITE_API_BASE;
const TOKEN = import.meta.env.VITE_API_TOKEN;

export async function fhirFetch(
  path,
  { sourceId, method = "GET", body, headers = {} } = {}
) {
  if (!sourceId) {
    throw new Error("sourceId is missing when calling fhirFetch");
  }

  const url = `${BASE}${path}`;
  console.log("➡️ fhirFetch Request:", method, url, "sourceId:", sourceId);

  const response = await fetch(url, {
    method,
    headers: {
      "x-source-id": sourceId,
      "Content-Type": "application/fhir+json", // ✅ required for FHIR
      Authorization: `Bearer ${TOKEN}`,
      ...headers, // allow overrides/extra headers
    },
    body: body ? JSON.stringify(body) : undefined, // ✅ ensure JSON encoding
  });

  console.log(
    "⬅️ fhirFetch Response status:",
    response.status,
    response.statusText
  );

  let responseBody;
  try {
    responseBody = await response.json();
  } catch {
    responseBody = await response.text();
  }

  if (!response.ok) {
    console.error("❌ fhirFetch error body:", responseBody);
    throw new Error(
      `${response.status} — ${response.statusText}`
    );
  }

  console.log("📦 fhirFetch JSON:", responseBody);
  return responseBody;
}


