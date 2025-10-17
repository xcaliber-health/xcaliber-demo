

export const ECW_MOCK_PATIENTS =[
  {
    "id": "6341",
    "name": [
      {
        "family": "Ross",
        "given": [
          "Sofia"
        ],
        "use": "official"
      }
    ],
    "fullName": "Sofia Ross",
    "birthDate": "1973-09-12",
    "gender": "F",
    "telecom": [
      {
        "system": "phone",
        "value": "4155550137",
        "use": "home"
      },
      {
        "system": "email",
        "value": "sofia.ross@example.com"
      }
    ],
    "address": [
      {
        "line": [
          "789 Magnolia Ave"
        ],
        "city": "San Francisco",
        "state": "CA",
        "postalCode": "94107",
        "country": "USA",
        "use": "home"
      }
    ],
    "status": "active",
    "appointments": [
      {
        "id": "appt-001",
        "participant": [
          {
            "actor": {
              "reference": "Practitioner/123"
            }
          },
          {
            "actor": {
              "reference": "Patient/6341"
            }
          }
        ],
        "appointmentType": {
          "text": "Oncology follow-up"
        },
        "start": "2025-11-15T10:00:00Z",
        "status": "booked"
      },
      {
        "id": "appt-002",
        "participant": [
          {
            "actor": {
              "reference": "Practitioner/456"
            }
          },
          {
            "actor": {
              "reference": "Patient/6341"
            }
          }
        ],
        "appointmentType": {
          "text": "Imaging review"
        },
        "start": "2025-11-05T14:00:00Z",
        "status": "booked"
      }
    ],
    "vitals": [
      {
        "code": {
          "coding": [
            {
              "display": "Blood Pressure (Systolic)"
            }
          ]
        },
        "valueQuantity": {
          "value": 118,
          "unit": "mmHg"
        },
        "meta": {
          "lastUpdated": "2025-10-16T10:00:00Z"
        }
      },
      {
        "code": {
          "coding": [
            {
              "display": "Blood Pressure (Diastolic)"
            }
          ]
        },
        "valueQuantity": {
          "value": 78,
          "unit": "mmHg"
        },
        "meta": {
          "lastUpdated": "2025-10-16T10:00:00Z"
        }
      },
      {
        "code": {
          "coding": [
            {
              "display": "Heart Rate"
            }
          ]
        },
        "valueQuantity": {
          "value": 72,
          "unit": "bpm"
        },
        "meta": {
          "lastUpdated": "2025-10-16T10:05:00Z"
        }
      },
      {
        "code": {
          "coding": [
            {
              "display": "Temperature"
            }
          ]
        },
        "valueQuantity": {
          "value": 36.7,
          "unit": "\u00b0C"
        },
        "meta": {
          "lastUpdated": "2025-10-16T10:05:00Z"
        }
      }
    ],
    "allergies": [
      {
        "code": "Penicillin",
        "reaction": [
          {
            "description": "Rash",
            "severity": "high",
            "onset": "2020-01-10T10:00:00Z"
          }
        ],
        "clinicalStatus": "active",
        "onsetDateTime": "2020-01-10T10:00:00Z",
        "meta": {
          "created": "2020-01-05T08:30:00Z"
        }
      },
      {
        "code": "Latex",
        "reaction": [
          {
            "description": "Itching",
            "severity": "medium",
            "onset": "2021-06-01T12:00:00Z"
          }
        ],
        "clinicalStatus": "inactive",
        "onsetDateTime": "2021-06-01T12:00:00Z",
        "meta": {
          "created": "2021-05-28T10:00:00Z"
        }
      }
    ],
    
    "diagnosticReports":[
  {
    "code": { "coding": [{ "display": "Breast core needle biopsy - pathology" }] },
    "status": "final",
    "effectiveDateTime": "2023-03-14T00:00:00Z"
  },
  {
    "code": { "coding": [{ "display": "Post-treatment CT chest/abdomen/pelvis" }] },
    "status": "final",
    "effectiveDateTime": "2024-03-01T00:00:00Z"
  },
  {
    "code": { "coding": [{ "display": "CA 15-3 tumor marker" }] },
    "status": "final",
    "effectiveDateTime": "2025-10-10T00:00:00Z"
  }
],

    "serviceRequests": [
    {
  "category": [
    { "coding": [{ "display": "Lab" }] },
    { "coding": [{ "code": "CA15-3" }] }
  ],
  "status": "completed",
  "priority": "routine",
  "authoredOn": "2025-10-10"
},
{
  "category": [
    { "coding": [{ "display": "Imaging" }] },
    { "coding": [{ "code": "MRI-Breast-Right" }] }
  ],
  "status": "scheduled",
  "priority": "routine",
  "authoredOn": "2025-11-05"
},
],


    "immunizations": [],
    

    "encounters": [
  {
  "class": {
    "code": "AMB",
    "display": "ambulatory",
    "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode"
  },
  "status": "finished",
  "period": {
    "start": "2023-04-01T08:00:00Z",
    "end": "2023-09-15T16:00:00Z"
  },
  "type": "Neoadjuvant chemotherapy (AC \u2192 Paclitaxel)",
        "extension": [
          {
            "url": "http://xcaliber-fhir/structureDefinition/provider-first-name",
            "valueString": "Marco"
          },
          {
            "url": "http://xcaliber-fhir/structureDefinition/provider-last-name",
            "valueString": "Bellini"
          }
        ]
}
,
  {
  "class": {
    "code": "AMB",
    "display": "ambulatory",
    "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode"
  },
  "status": "finished",
  "period": {
    "start": "2023-10-10T07:30:00Z",
    "end": "2023-10-10T11:00:00Z"
  },
  "type": "Left modified radical mastectomy",
        "extension": [
          {
            "url": "http://xcaliber-fhir/structureDefinition/provider-first-name",
            "valueString": "Marco"
          },
          {
            "url": "http://xcaliber-fhir/structureDefinition/provider-last-name",
            "valueString": "Bellini"
          }
        ]
}
]

,
"tasks": [
  {
    "description": "Review lab results for patient Sofia Ross",
    "status": "completed",
    "intent": "order"
  },
  {
    "description": "Schedule follow-up appointment",
    "status": "in-progress",
    "intent": "plan"
  },
  {
    "code": {
      "coding": [
        { "display": "Medication refill request" }
      ]
    },
    "status": "requested",
    "intent": "order"
  }
]
,
    "procedures": [
  {
    "code": {
      "coding": [
        { "display": "Ultrasound-guided core needle biopsy, left breast" }
      ]
    },
    "status": "completed",
    "performedDateTime": "2023-03-10"
  },
  {
    "code": {
      "coding": [
        { "display": "Port-a-cath insertion (right subclavian)" }
      ]
    },
    "status": "completed",
    "performedDateTime": "2023-03-28"
  },
  {
    "code": {
      "coding": [
        { "display": "Left modified radical mastectomy with axillary lymph node dissection" }
      ]
    },
    "status": "completed",
    "performedDateTime": "2023-10-10",
    "note": "3/12 nodes positive"
  }
]
,
    "documents": [
      {
        "description": "Oncology Consultation Note",
        "category": [
          {
            "coding": [
              {
                "code": "progress-note"
              }
            ]
          }
        ],
        "author": [
          {
            "display": "Dr. Marco Bellini"
          }
        ],
        "date": "2025-10-16T09:00:00Z",
        "status": "final"
      },
      {
        "description": "Surgical Pathology Report",
        "category": [
          {
            "coding": [
              {
                "code": "pathology-report"
              }
            ]
          }
        ],
        "author": [
          {
            "display": "Dr. Lucia Moretti"
          }
        ],
        "date": "2023-10-12T14:00:00Z",
        "status": "final"
      }
    ],
    "conditions": [
      {
        "code": {
          "coding": [
            {
              "display": "Invasive ductal carcinoma, left breast",
              "code": "C50.912"
            }
          ]
        },
        "extension": [
          {
            "url": "http://xcaliber-fhir/structureDefinition/status",
            "valueString": "active"
          },
          {
            "url": "http://xcaliber-fhir/structureDefinition/on-set-date",
            "valueDateTime": "2023-03-14"
          }
        ],
        "status": "active",
        "onsetDateTime": "2023-03-14"
      },
      {
        "code": {
          "coding": [
            {
              "display": "BRCA1 gene mutation carrier",
              "code": "Z15.01"
            }
          ]
        },
        "extension": [
          {
            "url": "http://xcaliber-fhir/structureDefinition/status",
            "valueString": "active"
          },
          {
            "url": "http://xcaliber-fhir/structureDefinition/on-set-date",
            "valueDateTime": "2023-04-10"
          }
        ],
        "status": "active",
        "onsetDateTime": "2023-04-10"
      }
    ],
    "familyHistory": [
      {
        "relationship": {
          "coding": [
            {
              "display": "Mother"
            }
          ]
        },
        "condition": [
          {
            "code": {
              "coding": [
                {
                  "display": "Breast cancer"
                }
              ]
            }
          }
        ]
      }
    ],
    "basics": [
  {
    "resourceType": "Basic",
    "id": "basic-001",
    "code": {
      "text": "Risk Contract"
    },
    "meta": {
      "lastUpdated": "2025-10-16T10:00:00Z"
    }
  },
  {
    "resourceType": "Basic",
    "id": "basic-002",
    "code": {
      "text": "Clinical Risk Assessment"
    },
    "meta": {
      "lastUpdated": "2025-09-25T09:30:00Z"
    }
  },
  {
    "resourceType": "Basic",
    "id": "basic-003",
    "code": {
      "text": "Patient Intake Form"
    },
    "meta": {
      "lastUpdated": "2025-08-10T14:45:00Z"
    }
  }
]
,
    "questionnaireResponses": [
      {
        "extension": [
          {
            "url": "http://xcaliber-fhir/structureDefinition/category",
            "valueString": "Allergy History"
          }
        ],
        "status": "completed",
        "meta": {
          "lastUpdated": "2025-09-10"
        },
        "item": [
          {
            "text": "Do you have allergies?",
            "answer": [
              {
                "valueString": "No"
              }
            ],
            "extension": [
              {
                "url": "http://xcaliber-fhir/structureDefinition/last-modified-by",
                "valueString": "Nurse Jane"
              }
            ]
          }
        ]
      },
      {
        "extension": [
          {
            "url": "http://xcaliber-fhir/structureDefinition/category",
            "valueString": "Smoking Status"
          }
        ],
        "status": "completed",
        "meta": {
          "lastUpdated": "2025-08-05"
        },
        "item": [
          {
            "text": "Do you smoke?",
            "answer": [
              {
                "valueString": "No"
              }
            ],
            "extension": [
              {
                "url": "http://xcaliber-fhir/structureDefinition/last-modified-by",
                "valueString": "Dr. Marco Bellini"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "6605",
    "name": [
      {
        "family": "Novak",
        "given": [
          "Hanah"
        ],
        "use": "official"
      }
    ],
    "fullName": "Hanah Novak",
    "birthDate": "1986-04-22",
    "gender": "F",
    "telecom": [
      {
        "system": "phone",
        "value": "3105550163",
        "use": "home"
      },
      {
        "system": "email",
        "value": "hanah.novak@example.com"
      }
    ],
    "address": [
      {
        "line": [
          "2207 Demo Street"
        ],
        "city": "Los Angeles",
        "state": "CA",
        "postalCode": "90017",
        "country": "USA",
        "use": "home"
      }
    ],
    "status": "active",
    "appointments": [
      {
        "id": "appt-101",
        "participant": [
          {
            "actor": {
              "reference": "Practitioner/789"
            }
          },
          {
            "actor": {
              "reference": "Patient/6605"
            }
          }
        ],
        "appointmentType": {
          "text": "Gyn/Oncology follow-up"
        },
        "start": "2025-12-02T11:00:00Z",
        "status": "booked"
      }
    ],
    "vitals": [
      {
        "code": {
          "coding": [
            {
              "display": "Blood Pressure (Systolic)"
            }
          ]
        },
        "valueQuantity": {
          "value": 122,
          "unit": "mmHg"
        },
        "meta": {
          "lastUpdated": "2025-10-16T10:00:00Z"
        }
      },
      {
        "code": {
          "coding": [
            {
              "display": "Blood Pressure (Diastolic)"
            }
          ]
        },
        "valueQuantity": {
          "value": 80,
          "unit": "mmHg"
        },
        "meta": {
          "lastUpdated": "2025-10-16T10:00:00Z"
        }
      },
      {
        "code": {
          "coding": [
            {
              "display": "Heart Rate"
            }
          ]
        },
        "valueQuantity": {
          "value": 76,
          "unit": "bpm"
        },
        "meta": {
          "lastUpdated": "2025-10-16T10:05:00Z"
        }
      }
    ],
    "allergies": [],
    "diagnosticReports": [
      [
        "Ovarian mass surgical pathology",
        "final",
        "2024-04-15"
      ],
      [
        "CT Abdomen/Pelvis with contrast",
        "final",
        "2024-03-28"
      ]
    ],
    "serviceRequests": [
      {
        "type": "Imaging",
        "code": "CT-AbdomenPelvis",
        "status": "completed",
        "priority": "routine",
        "date": "2024-03-28"
      },
      {
        "type": "Genetics",
        "code": "BRCA testing",
        "status": "completed",
        "priority": "routine",
        "date": "2024-04-01"
      }
    ],
    "immunizations": [],
    "encounters": [
      {
        "period": {
          "start": "2024-04-10T07:30:00Z",
          "end": "2024-04-10T13:00:00Z"
        },
        "type": "Total abdominal hysterectomy with bilateral salpingo-oophorectomy and omentectomy",
        "extension": [
          {
            "url": "http://xcaliber-fhir/structureDefinition/provider-first-name",
            "valueString": "Elena"
          },
          {
            "url": "http://xcaliber-fhir/structureDefinition/provider-last-name",
            "valueString": "Petrova"
          }
        ]
      }
    ],
    "procedures": [
      {
        "code": {
          "display": "Total abdominal hysterectomy with BSO"
        },
        "status": "completed",
        "performedDate": "2024-04-10"
      },
      {
        "code": {
          "display": "Omentectomy"
        },
        "status": "completed",
        "performedDate": "2024-04-10"
      }
    ],
    "documents": [
      {
        "description": "Surgical Pathology Report - Ovarian carcinoma",
        "category": [
          {
            "coding": [
              {
                "code": "pathology-report"
              }
            ]
          }
        ],
        "author": [
          {
            "display": "Dr. Elena Petrova"
          }
        ],
        "date": "2024-04-15T11:00:00Z",
        "status": "final"
      },
      {
        "description": "Genetic Testing Report - BRCA2",
        "category": [
          {
            "coding": [
              {
                "code": "genetics-report"
              }
            ]
          }
        ],
        "author": [
          {
            "display": "Genetics Lab"
          }
        ],
        "date": "2024-04-05T09:30:00Z",
        "status": "final"
      }
    ],
    "conditions": [
      {
        "code": {
          "coding": [
            {
              "display": "Ovarian serous carcinoma",
              "code": "C56.9"
            }
          ]
        },
        "extension": [
          {
            "url": "http://xcaliber-fhir/structureDefinition/status",
            "valueString": "active"
          },
          {
            "url": "http://xcaliber-fhir/structureDefinition/on-set-date",
            "valueDateTime": "2024-04-15"
          }
        ],
        "status": "active",
        "onsetDateTime": "2024-04-15"
      },
      {
        "code": {
          "coding": [
            {
              "display": "BRCA2 gene mutation carrier",
              "code": "Z15.02"
            }
          ]
        },
        "extension": [
          {
            "url": "http://xcaliber-fhir/structureDefinition/status",
            "valueString": "active"
          },
          {
            "url": "http://xcaliber-fhir/structureDefinition/on-set-date",
            "valueDateTime": "2024-04-05"
          }
        ],
        "status": "active",
        "onsetDateTime": "2024-04-05"
      }
    ],
    "familyHistory": [
      {
        "relationship": {
          "coding": [
            {
              "display": "Mother"
            }
          ]
        },
        "condition": [
          {
            "code": {
              "coding": [
                {
                  "display": "Breast cancer"
                }
              ]
            }
          }
        ]
      }
    ],
    "questionnaireResponses": []
  },
  {
    "id": "7001",
    "name": [
      {
        "family": "Ramirez",
        "given": [
          "Carlos"
        ],
        "use": "official"
      }
    ],
    "fullName": "Carlos Ramirez",
    "birthDate": "1979-11-30",
    "gender": "M",
    "telecom": [
      {
        "system": "phone",
        "value": "7205550177",
        "use": "home"
      },
      {
        "system": "email",
        "value": "carlos.ramirez@example.com"
      }
    ],
    "address": [
      {
        "line": [
          "1500 Wynkoop St"
        ],
        "city": "Denver",
        "state": "CO",
        "postalCode": "80202",
        "country": "USA",
        "use": "home"
      }
    ],
    "status": "active",
    "appointments": [],
    "vitals": [
      {
        "code": {
          "coding": [
            {
              "display": "Weight"
            }
          ]
        },
        "valueQuantity": {
          "value": 88,
          "unit": "kg"
        },
        "meta": {
          "lastUpdated": "2025-10-10T08:00:00Z"
        }
      }
    ],
    "allergies": [],
    "diagnosticReports": [
      [
        "PSA",
        "final",
        "2025-03-01"
      ]
    ],
    "serviceRequests": [
      {
        "type": "Imaging",
        "code": "BoneScan",
        "status": "completed",
        "priority": "routine",
        "date": "2025-03-05"
      }
    ],
    "immunizations": [],
    "encounters": [
      {
        "period": {
          "start": "2025-03-01T09:00:00Z",
          "end": "2025-03-01T09:30:00Z"
        },
        "type": "Urology consult"
      }
    ],
    "procedures": [
      {
        "code": {
          "display": "Transrectal ultrasound guided biopsy"
        },
        "status": "completed",
        "performedDate": "2025-03-01"
      }
    ],
    "documents": [
      {
        "description": "Urology Report",
        "category": [
          {
            "coding": [
              {
                "code": "progress-note"
              }
            ]
          }
        ],
        "author": [
          {
            "display": "Dr. Mark Stevens"
          }
        ],
        "date": "2025-03-01T10:00:00Z",
        "status": "final"
      }
    ],
    "conditions": [
      {
        "code": {
          "coding": [
            {
              "display": "Prostate adenocarcinoma",
              "code": "C61"
            }
          ]
        },
        "extension": [
          {
            "url": "http://xcaliber-fhir/structureDefinition/status",
            "valueString": "active"
          },
          {
            "url": "http://xcaliber-fhir/structureDefinition/on-set-date",
            "valueDateTime": "2025-03-01"
          }
        ],
        "status": "active",
        "onsetDateTime": "2025-03-01"
      }
    ],
    "familyHistory": [],
    "questionnaireResponses": []
  },
  {
    "id": "6606",
    "name": [
      {
        "family": "Thompson",
        "given": [
          "Noah"
        ],
        "use": "official"
      }
    ],
    "fullName": "Noah Thompson",
    "birthDate": "1990-08-14",
    "gender": "M",
    "telecom": [
      {
        "system": "phone",
        "value": "4155553200",
        "use": "home"
      },
      {
        "system": "email",
        "value": "noah.thompson@example.com"
      }
    ],
    "address": [
      {
        "line": [
          "1234 Example Lane",
          "Apt 4B"
        ],
        "city": "San Francisco",
        "state": "CA",
        "postalCode": "94105",
        "country": "USA",
        "use": "home"
      }
    ],
    "status": "active",
    "appointments": [
      {
        "id": "appt-201",
        "participant": [
          {
            "actor": {
              "reference": "Practitioner/123"
            }
          },
          {
            "actor": {
              "reference": "Patient/6606"
            }
          }
        ],
        "appointmentType": {
          "text": "Oncology - Immunotherapy review"
        },
        "start": "2025-10-20T09:00:00Z",
        "status": "booked"
      }
    ],
    "vitals": [
      {
        "code": {
          "coding": [
            {
              "display": "Weight"
            }
          ]
        },
        "valueQuantity": {
          "value": 82,
          "unit": "kg"
        },
        "meta": {
          "lastUpdated": "2025-10-16T10:10:00Z"
        }
      }
    ],
    "allergies": [
      {
        "code": "Penicillin",
        "reaction": [
          {
            "description": "Rash",
            "severity": "medium",
            "onset": "2019-05-10T09:00:00Z"
          }
        ],
        "clinicalStatus": "inactive",
        "onsetDateTime": "2019-05-10T09:00:00Z",
        "meta": {
          "created": "2019-05-09T08:00:00Z"
        }
      }
    ],
    "diagnosticReports": [
      [
        "Excisional biopsy - skin lesion",
        "final",
        "2025-06-10"
      ],
      [
        "PET-CT whole body",
        "final",
        "2025-06-20"
      ]
    ],
    "serviceRequests": [
      {
        "type": "Imaging",
        "code": "PET-CT",
        "status": "completed",
        "priority": "stat",
        "date": "2025-06-20"
      }
    ],
    "immunizations": [],
    "encounters": [
      {
        "period": {
          "start": "2025-06-10T08:00:00Z",
          "end": "2025-06-10T12:00:00Z"
        },
        "type": "Excisional biopsy and sentinel node biopsy",
        "extension": [
          {
            "url": "http://xcaliber-fhir/structureDefinition/provider-first-name",
            "valueString": "Charles"
          },
          {
            "url": "http://xcaliber-fhir/structureDefinition/provider-last-name",
            "valueString": "Green"
          }
        ]
      }
    ],
    "procedures": [
      {
        "code": {
          "display": "Excisional biopsy of skin lesion"
        },
        "status": "completed",
        "performedDate": "2025-06-10"
      },
      {
        "code": {
          "display": "Nivolumab infusion"
        },
        "status": "in-progress",
        "performedDate": "2025-07-01"
      }
    ],
    "documents": [
      {
        "description": "Surgical Pathology Report - Melanoma",
        "category": [
          {
            "coding": [
              {
                "code": "pathology-report"
              }
            ]
          }
        ],
        "author": [
          {
            "display": "Dr. Charles Green"
          }
        ],
        "date": "2025-06-12T14:30:00Z",
        "status": "final"
      }
    ],
    "conditions": [
      {
        "code": {
          "coding": [
            {
              "display": "Malignant melanoma of skin",
              "code": "C43.62"
            }
          ]
        },
        "extension": [
          {
            "url": "http://xcaliber-fhir/structureDefinition/status",
            "valueString": "active"
          },
          {
            "url": "http://xcaliber-fhir/structureDefinition/on-set-date",
            "valueDateTime": "2025-06-10"
          }
        ],
        "status": "active",
        "onsetDateTime": "2025-06-10"
      }
    ],
    "familyHistory": [
      {
        "relationship": {
          "coding": [
            {
              "display": "Mother"
            }
          ]
        },
        "condition": [
          {
            "code": {
              "coding": [
                {
                  "display": "Skin cancer"
                }
              ]
            }
          }
        ]
      }
    ],
    "questionnaireResponses": []
  },
  {
    "id": "7002",
    "name": [
      {
        "family": "Patel",
        "given": [
          "Amina"
        ],
        "use": "official"
      }
    ],
    "fullName": "Amina Patel",
    "birthDate": "1988-05-22",
    "gender": "F",
    "telecom": [
      {
        "system": "phone",
        "value": "6465550189",
        "use": "home"
      },
      {
        "system": "email",
        "value": "amina.patel@example.com"
      }
    ],
    "address": [
      {
        "line": [
          "250 Park Ave S",
          "Floor 10"
        ],
        "city": "New York",
        "state": "NY",
        "postalCode": "10003",
        "country": "USA",
        "use": "home"
      }
    ],
    "status": "active",
    "appointments": [
      {
        "id": "appt-301",
        "participant": [
          {
            "actor": {
              "reference": "Practitioner/321"
            }
          },
          {
            "actor": {
              "reference": "Patient/7002"
            }
          }
        ],
        "appointmentType": {
          "text": "Oncology consult"
        },
        "start": "2025-10-30T11:00:00Z",
        "status": "booked"
      }
    ],
    "vitals": [
      {
        "code": {
          "coding": [
            {
              "display": "Blood Pressure (Systolic)"
            }
          ]
        },
        "valueQuantity": {
          "value": 120,
          "unit": "mmHg"
        },
        "meta": {
          "lastUpdated": "2025-10-16T09:00:00Z"
        }
      }
    ],
    "allergies": [],
    "diagnosticReports": [
      [
        "Colonoscopy - pathology",
        "final",
        "2025-02-15"
      ]
    ],
    "serviceRequests": [
      {
        "type": "Lab",
        "code": "CEA",
        "status": "completed",
        "priority": "routine",
        "date": "2025-02-15"
      }
    ],
    "immunizations": [],
    "encounters": [
      {
        "period": {
          "start": "2025-02-15T08:00:00Z",
          "end": "2025-02-15T10:00:00Z"
        },
        "type": "Colonoscopy and polypectomy"
      }
    ],
    "procedures": [
      {
        "code": {
          "display": "Colonoscopy with polypectomy"
        },
        "status": "completed",
        "performedDate": "2025-02-15"
      }
    ],
    "documents": [
      {
        "description": "Pathology Report - Colon adenocarcinoma",
        "category": [
          {
            "coding": [
              {
                "code": "pathology-report"
              }
            ]
          }
        ],
        "author": [
          {
            "display": "Dr. Karen Lee"
          }
        ],
        "date": "2025-02-17T12:00:00Z",
        "status": "final"
      }
    ],
    "conditions": [
      {
        "code": {
          "coding": [
            {
              "display": "Colon adenocarcinoma, sigmoid colon",
              "code": "C18.7"
            }
          ]
        },
        "extension": [
          {
            "url": "http://xcaliber-fhir/structureDefinition/status",
            "valueString": "active"
          },
          {
            "url": "http://xcaliber-fhir/structureDefinition/on-set-date",
            "valueDateTime": "2025-02-10"
          }
        ],
        "status": "active",
        "onsetDateTime": "2025-02-10"
      }
    ],
    "familyHistory": [],
    "questionnaireResponses": []
  }
]