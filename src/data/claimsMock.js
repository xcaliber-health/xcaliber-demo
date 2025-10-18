export const ECW_MOCK_CLAIMS = {
  entry: [
    {
      resource: {
        resourceType: "Claim",
        id: "claim-001",
        status: "active",
        created: "2025-09-22",
        billablePeriod: {
          start: "2025-09-01",
          end: "2025-09-01",
        },
        patient: {
          reference: "Patient/pat-001",
          display: "John Doe",
        },
        provider: {
          reference: "Practitioner/prov-001",
          display: "Dr. Emily Carter",
        },
        priority: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/processpriority",
              code: "normal",
              display: "Normal",
            },
          ],
        },
        total: {
          value: 1200.0,
          currency: "USD",
        },
        payment: {
          amount: {
            value: 950.0,
            currency: "USD",
          },
        },
        diagnosis: [
          {
            sequence: 1,
            diagnosisCodeableConcept: {
              coding: [
                {
                  system: "http://hl7.org/fhir/sid/icd-10",
                  code: "E11.9",
                  display: "Type 2 diabetes mellitus without complications",
                },
              ],
            },
            type: [{ text: "Primary" }],
          },
        ],
        procedure: [
          {
            sequence: 1,
            procedureCodeableConcept: {
              coding: [
                {
                  system: "http://www.ama-assn.org/go/cpt",
                  code: "99213",
                  display: "Office visit, established patient, 15 minutes",
                },
              ],
            },
            extension: [
              {
                url: "http://xcaliber-fhir/structureDefinition/amount",
                valueString: "1200",
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/procedure-transaction-id",
                valueString: "txn-101",
              },
            ],
          },
        ],
        insurance: [
          {
            sequence: 1,
            coverage: {
              reference: "Coverage/ins-001",
              extension: [
                {
                  url: "http://xcaliber-fhir/structureDefinition/primary-insurance-package-id",
                  valueString: "BlueShield-PPO",
                },
                {
                  url: "http://xcaliber-fhir/structureDefinition/primary-insurance-status",
                  valueString: "Active",
                },
              ],
            },
          },
        ],
        extension: [
          {
            url: "http://xcaliber-fhir/structureDefinition/transaction-details",
            valueString: JSON.stringify({
              procedure1: "1200.00",
            }),
          },
        ],
        contained: [
          {
            resourceType: "Basic",
            id: "note-001",
            code: {
              coding: [{ code: "claim-note" }],
            },
            extension: [
              {
                url: "http://xcaliber-fhir/structureDefinition/claim-note-status",
                valueString: "Pending",
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/global-claim-rule-name",
                valueString: "Billing Validation Rule",
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/fix-text",
                valueString: "Verify ICD-10 code and modifier",
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/pending-flag",
                valueString: "Y",
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        resourceType: "Claim",
        id: "claim-002",
        status: "finalized",
        created: "2025-09-28",
        billablePeriod: {
          start: "2025-09-15",
          end: "2025-09-15",
        },
        patient: {
          reference: "Patient/pat-002",
          display: "Jane Smith",
        },
        provider: {
          reference: "Practitioner/prov-002",
          display: "Dr. Raj Patel",
        },
        priority: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/processpriority",
              code: "stat",
              display: "Urgent",
            },
          ],
        },
        total: {
          value: 800.0,
          currency: "USD",
        },
        payment: {
          amount: {
            value: 800.0,
            currency: "USD",
          },
        },
        diagnosis: [
          {
            sequence: 1,
            diagnosisCodeableConcept: {
              coding: [
                {
                  system: "http://hl7.org/fhir/sid/icd-10",
                  code: "J06.9",
                  display: "Acute upper respiratory infection, unspecified",
                },
              ],
            },
            type: [{ text: "Primary" }],
          },
        ],
        procedure: [
          {
            sequence: 1,
            procedureCodeableConcept: {
              coding: [
                {
                  system: "http://www.ama-assn.org/go/cpt",
                  code: "87804",
                  display: "Influenza test by immunoassay",
                },
              ],
            },
            extension: [
              {
                url: "http://xcaliber-fhir/structureDefinition/amount",
                valueString: "800",
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/procedure-transaction-id",
                valueString: "txn-202",
              },
            ],
          },
        ],
        insurance: [
          {
            sequence: 1,
            coverage: {
              reference: "Coverage/ins-002",
              extension: [
                {
                  url: "http://xcaliber-fhir/structureDefinition/primary-insurance-package-id",
                  valueString: "UnitedHealth-Gold",
                },
                {
                  url: "http://xcaliber-fhir/structureDefinition/primary-insurance-status",
                  valueString: "Active",
                },
              ],
            },
          },
        ],
        extension: [
          {
            url: "http://xcaliber-fhir/structureDefinition/transaction-details",
            valueString: JSON.stringify({
              procedure1: "800.00",
            }),
          },
        ],
        contained: [
          {
            resourceType: "Basic",
            id: "note-002",
            code: {
              coding: [{ code: "claim-note" }],
            },
            extension: [
              {
                url: "http://xcaliber-fhir/structureDefinition/claim-note-status",
                valueString: "Approved",
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/global-claim-rule-name",
                valueString: "Auto Adjudication",
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/fix-text",
                valueString: "Claim auto-approved by payer",
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/pending-flag",
                valueString: "N",
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        resourceType: "Claim",
        id: "claim-003",
        status: "active",
        created: "2025-11-1",
        billablePeriod: {
          start: "2025-11-10",
          end: "2025-11-10",
        },
        patient: {
          reference: "Patient/pat-003",
          display: "Robert Johnson",
        },
        provider: {
          reference: "Practitioner/prov-003",
          display: "Dr. Sarah Williams",
        },
        priority: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/processpriority",
              code: "urgent",
              display: "Urgent",
            },
          ],
        },
        total: {
          value: 45000.0,
          currency: "USD",
        },
        payment: {
          amount: {
            value: 0.0,
            currency: "USD",
          },
        },
        diagnosis: [
          {
            sequence: 1,
            diagnosisCodeableConcept: {
              coding: [
                {
                  system: "http://hl7.org/fhir/sid/icd-10",
                  code: "M17.11",
                  display: "Unilateral primary osteoarthritis, right knee",
                },
              ],
            },
            type: [{ text: "Primary" }],
          },
          {
            sequence: 2,
            diagnosisCodeableConcept: {
              coding: [
                {
                  system: "http://hl7.org/fhir/sid/icd-10",
                  code: "M17.12",
                  display: "Unilateral primary osteoarthritis, left knee",
                },
              ],
            },
            type: [{ text: "Secondary" }],
          },
        ],
        procedure: [
          {
            sequence: 1,
            procedureCodeableConcept: {
              coding: [
                {
                  system: "http://www.ama-assn.org/go/cpt",
                  code: "27447",
                  display:
                    "Arthroplasty, knee, condyle and plateau; medial AND lateral compartments with or without patella resurfacing (total knee arthroplasty)",
                },
              ],
            },
            extension: [
              {
                url: "http://xcaliber-fhir/structureDefinition/amount",
                valueString: "45000",
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/procedure-transaction-id",
                valueString: "txn-301",
              },
            ],
          },
        ],
        insurance: [
          {
            sequence: 1,
            coverage: {
              reference: "Coverage/ins-003",
              extension: [
                {
                  url: "http://xcaliber-fhir/structureDefinition/primary-insurance-package-id",
                  valueString: "Medicare-PartA",
                },
                {
                  url: "http://xcaliber-fhir/structureDefinition/primary-insurance-status",
                  valueString: "Active",
                },
              ],
            },
          },
        ],
        extension: [
          {
            url: "http://xcaliber-fhir/structureDefinition/transaction-details",
            valueString: JSON.stringify({
              procedure1: "45000.00",
            }),
          },
        ],
        contained: [
          {
            resourceType: "Basic",
            id: "note-003",
            code: {
              coding: [{ code: "claim-note" }],
            },
            extension: [
              {
                url: "http://xcaliber-fhir/structureDefinition/claim-note-status",
                valueString: "Pending",
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/global-claim-rule-name",
                valueString: "Major Surgery Authorization",
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/fix-text",
                valueString: "Pre-authorization required for major surgery",
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/pending-flag",
                valueString: "Y",
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        resourceType: "Claim",
        id: "claim-004",
        status: "active",
        created: "2025-11-1",
        billablePeriod: {
          start: "2025-11-18",
          end: "2025-11-18",
        },
        patient: {
          reference: "Patient/pat-004",
          display: "Maria Garcia",
        },
        provider: {
          reference: "Practitioner/prov-004",
          display: "Dr. Michael Chen",
        },
        priority: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/processpriority",
              code: "urgent",
              display: "Urgent",
            },
          ],
        },
        total: {
          value: 25000.0,
          currency: "USD",
        },
        payment: {
          amount: {
            value: 0.0,
            currency: "USD",
          },
        },
        diagnosis: [
          {
            sequence: 1,
            diagnosisCodeableConcept: {
              coding: [
                {
                  system: "http://hl7.org/fhir/sid/icd-10",
                  code: "I25.10",
                  display:
                    "Atherosclerotic heart disease of native coronary artery without angina pectoris",
                },
              ],
            },
            type: [{ text: "Primary" }],
          },
        ],
        procedure: [
          {
            sequence: 1,
            procedureCodeableConcept: {
              coding: [
                {
                  system: "http://www.ama-assn.org/go/cpt",
                  code: "92928",
                  display:
                    "Percutaneous transcatheter placement of intracoronary stent(s), with coronary angioplasty when performed",
                },
              ],
            },
            extension: [
              {
                url: "http://xcaliber-fhir/structureDefinition/amount",
                valueString: "25000",
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/procedure-transaction-id",
                valueString: "txn-401",
              },
            ],
          },
        ],
        insurance: [
          {
            sequence: 1,
            coverage: {
              reference: "Coverage/ins-004",
              extension: [
                {
                  url: "http://xcaliber-fhir/structureDefinition/primary-insurance-package-id",
                  valueString: "Aetna-Premier",
                },
                {
                  url: "http://xcaliber-fhir/structureDefinition/primary-insurance-status",
                  valueString: "Active",
                },
              ],
            },
          },
        ],
        extension: [
          {
            url: "http://xcaliber-fhir/structureDefinition/transaction-details",
            valueString: JSON.stringify({
              procedure1: "25000.00",
            }),
          },
        ],
        contained: [
          {
            resourceType: "Basic",
            id: "note-004",
            code: {
              coding: [{ code: "claim-note" }],
            },
            extension: [
              {
                url: "http://xcaliber-fhir/structureDefinition/claim-note-status",
                valueString: "Pending",
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/global-claim-rule-name",
                valueString: "Cardiac Procedure Authorization",
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/fix-text",
                valueString: "Cardiology consultation required",
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/pending-flag",
                valueString: "Y",
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        resourceType: "Claim",
        id: "claim-005",
        status: "finalized",
        created: "2025-11-1",
        billablePeriod: {
          start: "2025-11-22",
          end: "2025-11-22",
        },
        patient: {
          reference: "Patient/pat-005",
          display: "Jennifer Davis",
        },
        provider: {
          reference: "Practitioner/prov-005",
          display: "Dr. Lisa Thompson",
        },
        priority: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/processpriority",
              code: "urgent",
              display: "Urgent",
            },
          ],
        },
        total: {
          value: 8500.0,
          currency: "USD",
        },
        payment: {
          amount: {
            value: 6800.0,
            currency: "USD",
          },
        },
        diagnosis: [
          {
            sequence: 1,
            diagnosisCodeableConcept: {
              coding: [
                {
                  system: "http://hl7.org/fhir/sid/icd-10",
                  code: "O80",
                  display: "Encounter for full-term uncomplicated delivery",
                },
              ],
            },
            type: [{ text: "Primary" }],
          },
        ],
        procedure: [
          {
            sequence: 1,
            procedureCodeableConcept: {
              coding: [
                {
                  system: "http://www.ama-assn.org/go/cpt",
                  code: "59400",
                  display:
                    "Routine obstetric care including antepartum care, vaginal delivery (with or without episiotomy), and postpartum care",
                },
              ],
            },
            extension: [
              {
                url: "http://xcaliber-fhir/structureDefinition/amount",
                valueString: "8500",
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/procedure-transaction-id",
                valueString: "txn-501",
              },
            ],
          },
        ],
        insurance: [
          {
            sequence: 1,
            coverage: {
              reference: "Coverage/ins-005",
              extension: [
                {
                  url: "http://xcaliber-fhir/structureDefinition/primary-insurance-package-id",
                  valueString: "Cigna-Family",
                },
                {
                  url: "http://xcaliber-fhir/structureDefinition/primary-insurance-status",
                  valueString: "Active",
                },
              ],
            },
          },
        ],
        extension: [
          {
            url: "http://xcaliber-fhir/structureDefinition/transaction-details",
            valueString: JSON.stringify({
              procedure1: "8500.00",
            }),
          },
        ],
        contained: [
          {
            resourceType: "Basic",
            id: "note-005",
            code: {
              coding: [{ code: "claim-note" }],
            },
            extension: [
              {
                url: "http://xcaliber-fhir/structureDefinition/claim-note-status",
                valueString: "Approved",
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/global-claim-rule-name",
                valueString: "Maternity Care Coverage",
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/fix-text",
                valueString: "Standard maternity coverage applied",
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/pending-flag",
                valueString: "N",
              },
            ],
          },
        ],
      },
    },
  ],
};
