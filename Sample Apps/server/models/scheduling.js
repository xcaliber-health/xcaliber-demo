const providers = [
  { id: "prov-1", name: "Dr. Alice Smith", specialty: "Cardiology" },
  { id: "prov-2", name: "Dr. John Doe", specialty: "Dermatology" },
];

let slots = [
  { id: "slot-1", providerId: "prov-1", providerName: "Dr. Alice Smith", start: "2025-09-05T09:00:00Z" },
  { id: "slot-2", providerId: "prov-1", providerName: "Dr. Alice Smith", start: "2025-09-05T09:30:00Z" },
  { id: "slot-3", providerId: "prov-2", providerName: "Dr. John Doe", start: "2025-09-06T10:00:00Z" },
];

let appointments = [
  {
    id: 1,
    patientId: "patient-123",
    providerId: 1,
    providerName: "Dr. Alice Smith",
    start: "2025-09-05T09:00:00Z",
    end: "2025-09-05T09:30:00Z",
    status: "booked",
  },
];


module.exports = { providers, slots, appointments};