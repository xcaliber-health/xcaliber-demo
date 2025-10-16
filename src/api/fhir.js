

const BASE = import.meta.env.VITE_API_BASE;
const TOKEN = import.meta.env.VITE_API_TOKEN;

export async function fhirFetch(
  path,
  { baseUrl, sourceId, method = "GET", body, headers = {}, setLatestCurl } = {}
) {
  if (!sourceId) {
    throw new Error("sourceId is missing when calling fhirFetch");
  }

  const BASE = baseUrl || import.meta.env.VITE_API_BASE;
  //const url = `${BASE}${path}`;
  const url = `${BASE}${path}`;
  console.log("➡️ fhirFetch Request:", method, url, "sourceId:", sourceId);

  const finalHeaders = {
    "x-source-id": sourceId,
    "Content-Type": "application/fhir+json",
    Authorization: `Bearer ${TOKEN}`,
    ...headers,
  };

  // ➡ Generate cURL command string
  let curlCommand = `curl "${url}" \\\n  -X ${method}`;

  Object.entries(finalHeaders).forEach(([key, value]) => {
    curlCommand += ` \\\n  -H "${key}: ${value}"`;
  });

  if (body) {
    curlCommand += ` \\\n  -d '${JSON.stringify(body, null, 2)}'`;
  }

  // ➡ Store for DashboardLayout floating button
  if (typeof setLatestCurl === "function") {
    setLatestCurl(curlCommand);
  }

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  console.log("⬅️ fhirFetch Response status:", response.status, response.statusText);

  let responseBody;
  // try {
  //   responseBody = await response.json();
  // } catch {
  //   responseBody = await response.text();
  // }
  const text = await response.text();
try {
  responseBody = text ? JSON.parse(text) : {};
} catch {
  responseBody = text;
}


  if (!response.ok) {
    console.error("❌ fhirFetch error body:", responseBody);
    throw new Error(`${response.status} — ${response.statusText}`);
  }

  console.log("📦 fhirFetch JSON:", responseBody);
  return responseBody;
}

