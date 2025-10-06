
// src/api/providers.js
import { fhirFetch } from "./fhir";

export async function fetchProvidersDirectory(sourceId, departmentId, name = "", providerId = "") {
  if (!sourceId) throw new Error("Missing sourceId");
  if (!departmentId) throw new Error("Missing departmentId");

  let providers = [];

  try {
    if (providerId) {
      // 🔹 Fetch by ID
      const p = await fhirFetch(`/Practitioner/${providerId}`, { sourceId });
      const npi = p.identifier?.find(id => id.system === "http://hl7.org/fhir/sid/us-npi")?.value || null;
      providers.push({
        id: p.id,
        name: p.name?.[0]?.text || `${p.name?.[0]?.given?.join(" ") || ""} ${p.name?.[0]?.family || ""}`.trim(),
        identifier: p.id, // Provider ID
        npi,             // NPI if exists
        specialty: p.qualification?.[0]?.code?.coding?.[0]?.display || null,
        providerType: null,
        phone: p.telecom?.find((t) => t.system === "phone")?.value || null,
        email: p.telecom?.find((t) => t.system === "email")?.value || null,
      });
    } else {
      // 🔹 Fetch by name
      let url = `/Practitioner?_count=100`;
      if (name) url += `&name=${encodeURIComponent(name)}`;

      const bundle = await fhirFetch(url, {
        sourceId,
        headers: { "x-interaction-mode": "true" },
      });

      providers = (bundle.entry || []).map((e) => {
        const p = e.resource;
        const npi = p.identifier?.find(id => id.system === "http://hl7.org/fhir/sid/us-npi")?.value || null;
        return {
          id: p.id,
          name: p.name?.[0]?.text || `${p.name?.[0]?.given?.join(" ") || ""} ${p.name?.[0]?.family || ""}`.trim(),
          identifier: p.id, // Provider ID
          npi,             // NPI if exists
          specialty: p.qualification?.[0]?.code?.coding?.[0]?.display || null,
          providerType: null,
          phone: p.telecom?.find((t) => t.system === "phone")?.value || null,
          email: p.telecom?.find((t) => t.system === "email")?.value || null,
        };
      });
    }

    return { providers };
  } catch (err) {
    throw new Error(`Failed to fetch providers: ${err.message}`);
  }
}

// 2. Find Appointment → includes departmentId + optional search (name or id)
export async function fetchProviders(sourceId, departmentId, count = 100, search = "") {
  if (!sourceId) throw new Error("Missing sourceId");
  if (!departmentId) throw new Error("Missing departmentId");

  let providers = [];
  let total = 0;

  try {
    if (search && /^\d+$/.test(search)) {
      // 🔹 Treat search as Provider ID
      const practitioner = await fhirFetch(`/Practitioner/${search}`, {
        sourceId,
        headers: { "x-interaction-mode": "true" },
      });

      if (practitioner) {
        providers.push({
          id: practitioner.id,
          name:
            practitioner.name?.[0]?.text ||
            `${practitioner.name?.[0]?.given?.[0] || ""} ${practitioner.name?.[0]?.family || ""}`.trim(),
          identifier: practitioner.identifier?.[0]?.value || null,
          phone: practitioner.telecom?.find((t) => t.system === "phone")?.value || null,
          email: practitioner.telecom?.find((t) => t.system === "email")?.value || null,
        });
        total = 1;
      }
    } else {
      // 🔹 Default search by name
      let url = `/Practitioner?_count=${count}`;
      if (search) {
        url += `&name=${encodeURIComponent(search)}`;
      }

      const bundle = await fhirFetch(url, {
        sourceId,
        headers: { "x-interaction-mode": "true" },
      });

      providers = (bundle.entry || []).map((e) => {
        const p = e.resource;
        return {
          id: p.id,
          name:
            p.name?.[0]?.text ||
            `${p.name?.[0]?.given?.[0] || ""} ${p.name?.[0]?.family || ""}`.trim(),
          identifier: p.identifier?.[0]?.value || null,
          phone: p.telecom?.find((t) => t.system === "phone")?.value || null,
          email: p.telecom?.find((t) => t.system === "email")?.value || null,
        };
      });

      total = bundle.total || providers.length;
    }

    return { providers, total };
  } catch (err) {
    throw new Error(`Failed to fetch providers: ${err.message}`);
  }
}

// Fetch provider by ID (simple, for search by ID)
export async function fetchProviderByIdSimple(providerId, sourceId) {
  if (!providerId) throw new Error("Missing providerId");
  if (!sourceId) throw new Error("Missing sourceId");

  const p = await fhirFetch(`/Practitioner/${providerId}`, { sourceId });

  return {
    id: p.id,
    name:
      p.name?.[0]?.text ||
      `${p.name?.[0]?.given?.[0] || ""} ${p.name?.[0]?.family || ""}`.trim(),
    identifier: p.identifier?.[0]?.value || null,
    phone: p.telecom?.find((t) => t.system === "phone")?.value || null,
    email: p.telecom?.find((t) => t.system === "email")?.value || null,
  };
}


// Fetch provider by ID (Practitioner + roles)
export async function fetchProviderById(providerId, sourceId) {
  const url =
    `/PractitionerRole?practitioner=${providerId}` +
    `&_include=PractitionerRole:organization` +
    `&_include=PractitionerRole:location`;

  const bundle = await fhirFetch(url, { sourceId });

  const roles = [];
  const orgs = {};
  const locations = {};
  (bundle.entry || []).forEach((e) => {
    const r = e.resource;
    if (r.resourceType === "Organization") orgs[r.id] = r;
    if (r.resourceType === "Location") locations[r.id] = r;
    if (r.resourceType === "PractitionerRole") roles.push(r);
  });

  const practitioner = await fhirFetch(`/Practitioner/${providerId}`, {
    sourceId,
  });

  return {
    id: practitioner.id,
    name:
      practitioner.name?.[0]?.text ||
      `${practitioner.name?.[0]?.given?.[0] || ""} ${
        practitioner.name?.[0]?.family || ""
      }`.trim(),
    identifier: practitioner.identifier?.[0]?.value || null,
    gender: practitioner.gender || null,
    qualifications:
      practitioner.qualification?.map(
        (q) => q.code?.coding?.[0]?.display || q.code?.text
      ) || [],
    roles: roles.map((r) => ({
      specialty: r.specialty?.[0]?.coding?.[0]?.display,
      organization: orgs[r.organization?.reference?.split("/")[1]]?.name,
      locations: (r.location || [])
        .map((l) => locations[l.reference?.split("/")[1]])
        .filter(Boolean),
      services: r.healthcareService?.map((s) => s.display) || [],
      telecom: r.telecom || [],
    })),
    phone:
      practitioner.telecom?.find((t) => t.system === "phone")?.value ||
      roles.flatMap((r) => r.telecom || []).find((t) => t.system === "phone")
        ?.value ||
      null,
    email:
      practitioner.telecom?.find((t) => t.system === "email")?.value ||
      roles.flatMap((r) => r.telecom || []).find((t) => t.system === "email")
        ?.value ||
      null,
  };
}
