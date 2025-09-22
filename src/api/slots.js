import { fhirFetch } from "./fhir";

export async function fetchSlots({ providerId, sourceId, departmentId, start, end }) {
  if (!providerId || !sourceId) {
    throw new Error("Missing providerId or sourceId for fetchSlots");
  }

  const isAthena = sourceId.startsWith("ef");

  let url = "";
  if (isAthena) {
    if (!departmentId) {
      throw new Error("Athena requires departmentId for slots");
    }
    url = `/Slot?schedule.actor=Practitioner/${providerId}&start=ge${start}&end=le${end}&departmentId=${departmentId}`;
  } else {
    url = `/Slot?schedule.actor=Practitioner/${providerId}&start=ge${start}&end=le${end}`;
  }

  const bundle = await fhirFetch(url, { sourceId });
  return (bundle.entry || []).map((e) => {
    const s = e.resource;
    return {
      id: s.id,
      start: s.start,
      end: s.end,
    };
  });
}
