import { fhirFetch } from "./fhir";

export async function fetchInboxItems(category, patientId) {
  let path;

  switch (category) {
    case "Messages":
      path = `/Communication?patient=${patientId}&_count=50`;
      break;
    case "Tasks":
      path = `/Task?patient=${patientId}&_count=50`;
      break;
    case "Labs":
      path = `/DiagnosticReport?patient=${patientId}&_count=50`;
      break;
    case "Documents":
      path = `/DocumentReference?patient=${patientId}&_count=50`;
      break;
    default:
      throw new Error(`Unknown inbox category: ${category}`);
  }

  const bundle = await fhirFetch(path);

  return (bundle.entry || []).map((e) => {
    const r = e.resource;

    switch (category) {
      case "Messages":
        return {
          id: r.id,
          type: "Communication",
          sender: r.sender?.display || "Unknown",
          date: r.sent || r.meta?.lastUpdated,
          subject: r.topic?.text || r.payload?.[0]?.contentString?.slice(0, 30) || "Message",
          content: r.payload?.[0]?.contentString || "No content",
          patient: {
            name: r.subject?.display || "Unknown",
            dob: "", // FHIR Communication usually doesn’t carry DOB
          },
        };

      case "Tasks":
        return {
          id: r.id,
          type: "Task",
          sender: r.requester?.display || "System",
          date: r.authoredOn || r.meta?.lastUpdated,
          subject: r.description || "Task",
          content: r.note?.[0]?.text || "",
          patient: {
            name: r.for?.display || "Unknown",
            dob: "",
          },
        };

      case "Labs":
        return {
          id: r.id,
          type: "Lab",
          sender: r.performer?.[0]?.display || "Lab",
          date: r.issued || r.meta?.lastUpdated,
          subject: r.code?.text || "Lab Report",
          content: r.conclusion || "",
          patient: {
            name: r.subject?.display || "Unknown",
            dob: "",
          },
        };

      case "Documents":
        return {
          id: r.id,
          type: "Document",
          sender: r.custodian?.display || "Facility",
          date: r.date || r.meta?.lastUpdated,
          subject: r.type?.text || "Document",
          content: "", // DocumentReference just points to binary
          patient: {
            name: r.subject?.display || "Unknown",
            dob: "",
          },
        };

      default:
        return null;
    }
  });
}
