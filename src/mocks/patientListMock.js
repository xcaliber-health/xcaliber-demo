
export const ECW_MOCK_PATIENTS = [
  {
    id: "6341",
    name: [{ family: "Kuhlman", given: ["William"], use: "official" }],
    fullName: "William Kuhlman",
    birthDate: "1990-07-29",
    gender: "F",
    telecom: [{ system: "phone", value: "5558590167", use: "home" }],
    address: [],
    status: "active",
    appointments: [
  {
    id: "appt-001",
    participant: [
      { actor: { reference: "Practitioner/123" } },
      { actor: { reference: "Patient/6341" } }
    ],
    appointmentType: { text: "General Checkup" },
    start: "2025-10-20T10:30:00Z",
    status: "booked"
  },
  {
    id: "appt-002",
    participant: [
      { actor: { reference: "Practitioner/456" } },
      { actor: { reference: "Patient/6341" } }
    ],
    appointmentType: { text: "Follow-up" },
    start: "2025-11-05T14:00:00Z",
    status: "booked"
  }
],

    vitals: [
      { code: { coding: [{ display: "Blood Pressure (Systolic)" }] }, valueQuantity: { value: 120, unit: "mmHg" }, meta: { lastUpdated: "2025-10-16T10:00:00Z" } },
      { code: { coding: [{ display: "Blood Pressure (Diastolic)" }] }, valueQuantity: { value: 80, unit: "mmHg" }, meta: { lastUpdated: "2025-10-16T10:00:00Z" } },
      { code: { coding: [{ display: "Heart Rate" }] }, valueQuantity: { value: 72, unit: "bpm" }, meta: { lastUpdated: "2025-10-16T10:05:00Z" } },
      { code: { coding: [{ display: "Temperature" }] }, valueQuantity: { value: 36.7, unit: "°C" }, meta: { lastUpdated: "2025-10-16T10:05:00Z" } }
    ],
    allergies: [
      {
        code: "Penicillin",
        reaction: [
          { description: "Rash", severity: "high", onset: "2020-01-10T10:00:00Z" },
          { description: "Hives", severity: "low", onset: "2020-01-12T10:00:00Z" },
          { description: "Swelling", severity: "medium", onset: "2020-01-15T08:00:00Z" }
        ],
        clinicalStatus: "active",
        onsetDateTime: "2020-01-10T10:00:00Z",
        meta: { created: "2020-01-05T08:30:00Z" }
      },
      {
        code: "Latex",
        reaction: [
          { description: "Itching", severity: "medium", onset: "2021-06-01T12:00:00Z" },
          { description: "Sneezing", severity: "low", onset: "2021-06-02T09:00:00Z" }
        ],
        clinicalStatus: "inactive",
        onsetDateTime: "2021-06-01T12:00:00Z",
        meta: { created: "2021-05-28T10:00:00Z" }
      }
    ],
    diagnosticReports: [
      ["Complete Blood Count", "final", "09/15/2025"],
      ["Lipid Panel", "preliminary", "08/20/2025"],
      ["Metabolic Panel", "final", "07/10/2025"]
    ],
    serviceRequests: [
      { type: "Lab", code: "CBC", status: "completed", priority: "routine", date: "2025-09-15" },
      { type: "Lab", code: "Lipid", status: "in-progress", priority: "stat", date: "2025-08-20" },
      { type: "Imaging", code: "XR-Chest", status: "requested", priority: "routine", date: "2025-07-01" }
    ],
    immunizations: [],
    encounters: [
      {
        period: { start: "2025-10-15T10:00:00Z", end: "2025-10-15T10:30:00Z" },
        extension: [
          { url: "http://xcaliber-fhir/structureDefinition/provider-first-name", valueString: "Alice" },
          { url: "http://xcaliber-fhir/structureDefinition/provider-last-name", valueString: "Jones" }
        ]
      },
      {
        period: { start: "2025-09-20T11:00:00Z", end: "2025-09-20T11:45:00Z" },
        extension: [
          { url: "http://xcaliber-fhir/structureDefinition/provider-first-name", valueString: "Bob" },
          { url: "http://xcaliber-fhir/structureDefinition/provider-last-name", valueString: "Smith" }
        ]
      }
    ],
    procedures: [
      { code: { display: "Kidney function study" }, status: "completed", performedDate: "2025-10-01" },
      { code: { display: "Colonoscopy" }, status: "in-progress", performedDate: "2025-09-15" }
    ],
    documents: [
      {
        description: "Consultation Note",
        category: [{ coding: [{ code: "progress-note" }] }],
        author: [{ display: "Dr. Alice Jones" }],
        date: "2025-10-16T09:00:00Z",
        status: "final"
      },
      {
        description: "Discharge Summary",
        category: [{ coding: [{ code: "summary" }] }],
        author: [{ display: "Dr. Bob Smith" }],
        date: "2025-10-01T14:30:00Z",
        status: "preliminary"
      }
    ],
    conditions: [
      {
        code: { coding: [{ display: "Hypertension" }] },
        extension: [
          { url: "http://xcaliber-fhir/structureDefinition/status", valueString: "active" },
          { url: "http://xcaliber-fhir/structureDefinition/on-set-date", valueDateTime: "2020-01-01" }
        ],
        status: null,
        onsetDateTime: null
      },
      {
        code: { coding: [{ display: "Diabetes Mellitus" }] },
        extension: [
          { url: "http://xcaliber-fhir/structureDefinition/status", valueString: "resolved" },
          { url: "http://xcaliber-fhir/structureDefinition/on-set-date", valueDateTime: "2018-05-15" }
        ],
        status: null,
        onsetDateTime: null
      }
    ],
    familyHistory: [
      {
        relationship: { coding: [{ display: "Mother" }] },
        condition: [
          { code: { coding: [{ display: "Diabetes Mellitus" }] } },
          { code: { coding: [{ display: "Hypertension" }] } }
        ]
      },
      {
        relationship: { coding: [{ display: "Father" }] },
        condition: [
          { code: { coding: [{ display: "Coronary Artery Disease" }] } }
        ]
      }
    ],
    questionnaireResponses: [
      {
        extension: [{ url: "http://xcaliber-fhir/structureDefinition/category", valueString: "Allergy History" }],
        status: "completed",
        meta: { lastUpdated: "2025-09-10" },
        item: [
          {
            text: "Do you have allergies?",
            answer: [{ valueString: "No" }],
            extension: [{ url: "http://xcaliber-fhir/structureDefinition/last-modified-by", valueString: "Nurse Jane" }]
          }
        ]
      },
      {
        extension: [{ url: "http://xcaliber-fhir/structureDefinition/category", valueString: "Smoking Status" }],
        status: "completed",
        meta: { lastUpdated: "2025-08-05" },
        item: [
          {
            text: "Do you smoke?",
            answer: [{ valueString: "Yes" }],
            extension: [{ url: "http://xcaliber-fhir/structureDefinition/last-modified-by", valueString: "Dr. Alice Jones" }]
          }
        ]
      }
    ]
  },
  {
    id: "6605",
    name: [{ family: "Jenkins", given: ["William"], use: "official" }],
    fullName: "William Jenkins",
    birthDate: "1990-08-14",
    gender: "F",
    telecom: [
      { system: "phone", value: "5555133200", use: "home" },
      { system: "email", value: "ted.hellerest697876@waelchi.biz" }
    ],
    address: [],
    status: "active",
    appointments: [
  {
    id: "appt-001",
    participant: [
      { actor: { reference: "Practitioner/123" } },
      { actor: { reference: "Patient/6341" } }
    ],
    appointmentType: { text: "General Checkup" },
    start: "2025-10-20T10:30:00Z",
    status: "booked"
  },
  {
    id: "appt-002",
    participant: [
      { actor: { reference: "Practitioner/456" } },
      { actor: { reference: "Patient/6341" } }
    ],
    appointmentType: { text: "Follow-up" },
    start: "2025-11-05T14:00:00Z",
    status: "booked"
  }
]
,
    vitals: [
      { code: { coding: [{ display: "Weight" }] }, valueQuantity: { value: 70, unit: "kg" }, meta: { lastUpdated: "2025-10-16T10:10:00Z" } },
      { code: { coding: [{ display: "Height" }] }, valueQuantity: { value: 175, unit: "cm" }, meta: { lastUpdated: "2025-10-16T10:10:00Z" } },
      { code: { coding: [{ display: "Respiratory Rate" }] }, valueQuantity: { value: 16, unit: "/min" }, meta: { lastUpdated: "2025-10-16T10:15:00Z" } }
    ],
    allergies: [
      {
        code: "Shellfish",
        reaction: [
          { description: "Swelling", severity: "high", onset: "2021-03-15T09:00:00Z" },
          { description: "Nausea", severity: "medium", onset: "2021-03-16T10:00:00Z" }
        ],
        clinicalStatus: "inactive",
        onsetDateTime: "2021-03-15T09:00:00Z",
        meta: { created: "2021-03-10T12:00:00Z" }
      },
      {
        code: "Peanuts",
        reaction: [
          { description: "Anaphylaxis", severity: "high", onset: "2020-12-10T08:00:00Z" }
        ],
        clinicalStatus: "active",
        onsetDateTime: "2020-12-10T08:00:00Z",
        meta: { created: "2020-12-05T08:00:00Z" }
      }
    ],
    diagnosticReports: [
      ["Chest X-Ray", "final", "09/10/2025"],
      ["MRI Brain", "preliminary", "07/05/2025"]
    ],
    serviceRequests: [
      { type: "Lab", code: "BMP", status: "completed", priority: "routine", date: "2025-08-01" },
      { type: "Imaging", code: "CT-Head", status: "in-progress", priority: "stat", date: "2025-07-20" }
    ],
    immunizations: [],
    encounters: [
      {
        period: { start: "2025-10-10T09:00:00Z", end: "2025-10-10T09:30:00Z" },
        extension: [
          { url: "http://xcaliber-fhir/structureDefinition/provider-first-name", valueString: "Charles" },
          { url: "http://xcaliber-fhir/structureDefinition/provider-last-name", valueString: "Green" }
        ]
      }
    ],
    procedures: [
      { code: { display: "Blood Test" }, status: "completed", performedDate: "2025-10-01" }
    ],
    documents: [
      {
        description: "MRI Report",
        category: [{ coding: [{ code: "imaging-report" }] }],
        author: [{ display: "Dr. Charles Green" }],
        date: "2025-09-12T15:45:00Z",
        status: "final"
      }
    ],
    conditions: [
      {
        code: { coding: [{ display: "Asthma" }] },
        extension: [
          { url: "http://xcaliber-fhir/structureDefinition/status", valueString: "active" }
        ],
        status: null,
        onsetDateTime: null
      }
    ],
    familyHistory: [
      {
        relationship: { coding: [{ display: "Sister" }] },
        condition: [ { code: { coding: [{ display: "Asthma" }] } } ]
      }
    ],
    questionnaireResponses: [
      {
        extension: [{ url: "http://xcaliber-fhir/structureDefinition/category", valueString: "Physical Activity" }],
        status: "completed",
        meta: { lastUpdated: "2025-09-20" },
        item: [
          {
            text: "Do you exercise?", 
            answer: [{ valueString: "Yes" }],
            extension: [{ url: "http://xcaliber-fhir/structureDefinition/last-modified-by", valueString: "PA Specialist" }]
          }
        ]
      }
    ]
  },
  // Similarly add the structures and data for other patients (35055, 48816, 99999) following the same pattern...
];
