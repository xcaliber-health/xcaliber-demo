

import { fhirFetch } from "./fhir";

// Create Order
export async function createOrder({
  sourceId,
  departmentId,
  categoryCode,
  categoryDisplay,
  categoryText,
  reasonCodes, // Array: [{ code, display }]
  priority,
  performerReference,
  performerDisplay,
}) {
  if (!sourceId || !departmentId) {
    throw new Error("Missing sourceId or departmentId for createOrder");
  }
  const postBody = {
    resourceType: "ServiceRequest",
    encounter: {
      reference: "Encounter/34507",
    },
    subject: {
      reference: "Patient/Patient/4406",
    },
    contained: [],
    category: [
      {
        coding: [
          {
            system: "http://hl7.org/fhir/ValueSet/servicerequest-category",
            code: categoryCode,
            display: categoryDisplay,
          },
        ],
      },
      {
        text: categoryText,
        coding: [
          {
            system: "ATHENA",
            code: "342223",
            display: categoryDisplay,
          },
        ],
      },
    ],
    reasonCode: [
      {
        coding: reasonCodes.map(({ code, display }) => ({
          system: "http://snomed.info/sct",
          code,
          display,
        })),
      },
    ],
    priority,
    authoredOn: new Date().toISOString(),
    requester: {
      reference: "Practitioner/67",
    },
    performer: [
      {
        reference: performerReference,
        display: performerDisplay,
      },
    ],
    status: "active",
    extension: [
      {
        url: "http://xcaliber-fhir/structureDefinition/department-id",
        valueString: departmentId.toString(),
      },
    ],
  };

  const response = await fetch(
    "https://blitz.xcaliberapis.com/fhir-gateway-2/fhir/R4/ServiceRequest",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_API_TOKEN}`,
        "source-id": sourceId,
        "x-interaction-mode": "false",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postBody),
    }
  );

  if (!response.ok) {
    let error;
    try {
      error = await response.json();
    } catch {
      throw new Error("Failed to create order: Unknown error");
    }
    throw new Error(error?.issue?.[0]?.details?.text || "Failed to create order");
  }

  return await response.json();
}

/**
 * Fetch ServiceRequest orders
 */
export async function fetchOrders({
  patientId,
  encounterId,
  sourceId,
  departmentId,
  category,
}) {
  if (!patientId || !sourceId) {
    throw new Error("Missing patientId or sourceId when calling fetchOrders");
  }

  let url = `/ServiceRequest?patient=${patientId}&encounter=${encounterId}`;
  if (departmentId) url += `&departmentId=${departmentId}`;
  if (category) url += `&category=${category}`;

  const bundle = await fhirFetch(url, {
    sourceId,
    headers: {
      "Authorization": `Bearer ${import.meta.env.VITE_API_TOKEN}`,
    },
  });

  return (bundle.entry || []).map((e) => {
    const r = e.resource;
    return {
      id: r.id,
      type: r.category?.[0]?.coding?.[0]?.display || "N/A",
      code: r.category?.[1]?.coding?.[0]?.code || "N/A",
      status: r.status || "N/A",
      priority: r.priority || "N/A",
      date: r.authoredOn || null,
    };
  });
}
