
import { fhirFetch } from "./fhir";
const TOKEN = import.meta.env.VITE_API_TOKEN;
// Fetch appointments
export async function fetchAppointments({ patientId, providerId, sourceId, departmentId,setLatestCurl }) {
  if (!patientId || !sourceId) {
    throw new Error("Missing patientId or sourceId when calling fetchAppointments");
  }

  const isAthena = sourceId.startsWith("ef");

  let url = `/Appointment?patient=${patientId}&_count=10`;

  if (isAthena && departmentId) {
    url += `&departmentId=${departmentId}`;
  }

  if (providerId) {
    url += `&actor=Practitioner/${providerId}`;
  }

  const bundle = await fhirFetch(url, {
    sourceId,
    headers: isAthena ? { "x-interaction-mode": "false" } : undefined,
    setLatestCurl,
  });

  return (bundle.entry || []).map((e) => {
    const a = e.resource;
    const extStatus = a.extension?.find(
      (ext) =>
        ext.url ===
        "http://xcaliber-fhir/structureDefinition/appointment-status"
    );

    return {
      id: a.id,
      type:
        a.appointmentType?.text ||
        a.appointmentType?.coding?.[0]?.display ||
        "Appointment",
      status: extStatus?.valueCoding?.display || a.status || "N/A",
      start: a.start,
      end: a.end,
      duration: a.minutesDuration || null,
      location:
        a.participant?.find((p) =>
          p.actor?.reference?.startsWith("Location/")
        )?.actor?.reference || null,
      practitioner:
        a.participant?.find((p) =>
          p.actor?.reference?.startsWith("Practitioner/")
        )?.actor?.reference || null,
    };
  });
}

// Mapping of appointment types → location overrides (Athena specific)
const appointmentMappings = {
  "562": { display: "Nurse Visit", location: "Location/150" },
  "502": { display: "XRAY", location: "Location/1" },
  "62": { display: "Consult", location: "Location/1" },
  "423": { display: "Collaborative 2", location: "Location/1" },
  "962": { display: "Health History Checkup", location: "Location/1" },
  "1064": { display: "Any angela", location: "Location/1" },
  "443": { display: "Hearing Eval", location: "Location/1" },
};

// Create appointment
export async function createAppointment({
  patientId,
  providerId,
  start,
  end,
  sourceId,
  departmentId,
  appointmentType = { code: "562", display: "Nurse Visit" },
  setLatestCurl, // default
}) {
  if (!patientId || !providerId || !start || !end || !sourceId) {
    throw new Error("Missing required fields for createAppointment");
  }

  const isAthena = sourceId.startsWith("ef");

  // Determine display & location from mapping
  const typeInfo = appointmentMappings[appointmentType.code] || appointmentType;
  const locationRef = typeInfo.location || "Location/150";

  // Build Appointment resource (Athena expects system+code+display)
  const resource = {
    resourceType: "Appointment",
    status: "booked",
    start,
    end,
    appointmentType: {
      coding: [
        {
          system: "http://athenahealth.com/fhir/appointment-type", // required
          code: appointmentType.code,
          display: typeInfo.display,
        },
      ],
      text: typeInfo.display,
    },
    participant: [
      {
        actor: { reference: locationRef },
        status: "accepted",
      },
      {
        actor: { reference: `Practitioner/${providerId}` },
        status: "accepted",
      },
      {
        actor: { reference: `Patient/${patientId}` },
        status: "accepted",
      },
    ],
  };

  // Athena requires departmentId in query string
  let url = "/Appointment";
  if (isAthena && departmentId) {
    url += `?departmentId=${departmentId}`;
  }

  const response = await fhirFetch(url, {
    method: "POST",
    sourceId,
    body: resource, // fhirFetch handles JSON.stringify
    headers: isAthena ? { "x-interaction-mode": "true" } : undefined,
    setLatestCurl,
  });

  return response;
}

export async function getAppointment(id) {
  console.log("Fetching appointment with ID:", id);
  const res = await fetch(
    `https://blitz.xcaliberapis.com/fhir-gateway-2/fhir/R4/Appointment/${id}`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "X-Source-Id": "ef123977-6ef1-3e8e-a30f-3879cea0b344",
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch appointment");
  return res.json();
}

