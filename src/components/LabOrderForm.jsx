import { useEffect, useState } from "react";
import { LabOrderService } from "../services/labOrderService";
import { PractitionerService } from "../services/practitionerService";
import { ProblemService } from "../services/problemService";
import { ReferenceDataService } from "../services/referenceDataService";
import { LabResultsService } from "../services/labResultsService";
import { Button } from "./ui/button";
import { Combobox } from "./ui/combobox";
import { Label } from "./ui/label";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Select from "react-select";
export default function LabOrderForm({
  patientId,
  departmentId,
  encounterId,
  sourceId,
  practitionerId,
  practiceId,
}) {
  const [formData, setFormData] = useState({
    collectionDate: "",
    collectionTime: "",
    approvingProvider: "Ach, Chip",
    orderingProvider: "Ach, Chip",
    npi1: "",
    npi2: "",
    accountName: "",
    address: "",
    phone: "",
    noteToLab: "",
    internalNote: "",
    stat: false,
    standingOrder: false,
    publishResults: false,
    reference: "",
    problem: "",
    encounterDiagnosis: "",
    zip: "",
  });

  const [referenceOptions, setReferenceOptions] = useState([]);
  const [problemOptions, setProblemOptions] = useState([]);
  const [encounterDiagnosisOptions, setEncounterDiagnosisOptions] = useState(
    []
  );
  const [practitioners, setPractitioners] = useState([]);

  // ✅ Fetch Reference Data
  const fetchReferenceData = async () => {
    try {
      const response = await ReferenceDataService.getReferenceData(
        practiceId,
        sourceId
      );

      if (response?.data?.result && Array.isArray(response.data.result)) {
        setReferenceOptions(response.data.result);
      } else {
        console.warn("API Response did not contain 'result' array.");
        setReferenceOptions([]);
      }
    } catch (error) {
      console.error("Error fetching reference data:", error);
      setReferenceOptions([]);
    }
  };

  // ✅ Combine Problems & Encounter Diagnosis in a Single Dropdown
  const [diagnosisOptions, setDiagnosisOptions] = useState([]);

  // ✅ Fetch & Merge Problems + Encounter Diagnoses
  useEffect(() => {
    const fetchDiagnosisData = async () => {
      try {
        const problems = await ProblemService.getProblems(
          patientId,
          departmentId,
          sourceId
        );
        const diagnoses = await ProblemService.getDiagnosis(
          patientId,
          departmentId,
          sourceId,
          encounterId,
          practiceId
        );

        // ✅ Format & Merge Problems & Diagnoses
        const formattedProblems =
          problems?.map((item) => ({
            value: `${item.resource.code.coding[0].code}-${item.resource.id}`,
            label: `Problem: ${item.resource.code.coding[0].display}`,
          })) || [];

        const formattedDiagnoses =
          diagnoses?.map((item) => ({
            value: `${item.resource.code.coding[0].code}-${item.resource.id}`,
            label: `Diagnosis: ${item.resource.code.coding[0].display}`,
          })) || [];

        setDiagnosisOptions([...formattedDiagnoses, ...formattedProblems]);
        setDiagnosisOptions([...formattedDiagnoses, ...formattedProblems]);
      } catch (error) {
        console.error("Error fetching diagnosis data:", error);
        setDiagnosisOptions([]);
      }
    };

    if (patientId && sourceId) {
      fetchDiagnosisData();
    }
  }, [patientId, sourceId, departmentId, encounterId, practiceId]);

  // ✅ Fetch Practitioners based on Zipcode
  useEffect(() => {
    if (formData.zip && practiceId) {
      const fetchPractitioners = async () => {
        try {
          const response = await PractitionerService.getPractitioners(
            "clinical-provider",
            "roc",
            formData.zip, // Ensure this is correct
            practiceId,
            sourceId
          );

          setPractitioners(response || []);
        } catch (error) {
          console.error("Error fetching practitioners:", error);
          setPractitioners([]);
        }
      };
      fetchPractitioners();
    }
  }, [formData.zip, practiceId, sourceId]);

  // ✅ useEffect for Reference Data
  useEffect(() => {
    if (practiceId && sourceId) {
      fetchReferenceData();
    }
  }, [practiceId, sourceId]);

  // ✅ Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedOrderType = referenceOptions.find(
      (option) =>
        option.ordertypeid.toString() === formData.reference?.ordertypeid
    );

    const payload = {
      context: { departmentId: departmentId },
      data: {
        resourceType: "ServiceRequest",
        encounter: { reference: `Encounter/${encounterId}` },
        subject: { reference: `Patient/${patientId}` },
        contained: [],
        category: [
          {
            coding: [
              {
                system: "http://hl7.org/fhir/ValueSet/servicerequest-category",
                code: "108252007",
                display: "Lab",
              },
            ],
          },
          {
            text: selectedOrderType?.name || "Unknown Order Type",
            coding: [
              {
                system: "ATHENA",
                code: selectedOrderType?.ordertypeid || "Unknown Code",
                display: selectedOrderType?.name || "Unknown Order Type",
              },
            ],
          },
        ],
        reasonCode: formData.problem
          ? [
              {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: parseInt(formData.problem),
                    display:
                      diagnosisOptions.find((p) => p.value === formData.problem)
                        ?.label || "Unknown",
                  },
                ],
              },
            ]
          : [],

        priority: formData.stat ? "urgent" : "routine",
        authoredOn: new Date().toISOString(),
        requester: { reference: `Practitioner/${practitionerId}` },
        performer: [
          { reference: "Organization/10848074", display: "CVS/Pharmacy #5590" },
        ],
        status: "REVIEW",
      },
    };

    let payloadLabResult = {
      context: { departmentId: departmentId },
      data: {
        resourceType: "DiagnosticReport",
        status: "Final",
        category: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/v2-0074",
                code: "Lab",
              },
            ],
          },
          {
            coding: [
              {
                system: "athena",
                code: "LABRESULT",
                extension: [],
              },
            ],
          },
        ],
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: "58410-2",
              display: "CBC",
            },
          ],
          text: "CBC",
        },
        subject: {
          reference: `Patient/${patientId}`,
        },
        text: {
          div: '{"performinglabcity":"Winter Park","documentclass":"LABRESULT","priority":"2","labresultloinc":"58410-2","performinglabzip":"32789","resultstatus":"Final","lastmodifieddatetime":"2024-12-18T12:01:13-05:00","departmentid":"1","observations":[{"analytename":"glucose","value":"250","observationidentifier":"53328-1","analyteid":5521,"resultstatus":"final","loinc":"53328-1"},{"analytename":"protein","value":"TRACE","observationidentifier":"50561-0","analyteid":5522,"resultstatus":"final","loinc":"50561-0"},{"analytename":"color","value":"YELLOW","observationidentifier":"5778-6","analyteid":5523,"resultstatus":"final","loinc":"5778-6"},{"analytename":"clarity","value":"CLEAR","observationidentifier":"32167-9","analyteid":5524,"resultstatus":"final","loinc":"32167-9"}],"providerid":70,"actionnote":"scrambled notes","createddatetime":"2016-04-26T17:03:38-04:00","createddate":"04/26/2016","lastmodifieduser":"API-27306","pages":[],"documentsource":"INTERFACE","observationdatetime":"2015-12-16T21:23:00-05:00","labresultid":116866,"status":"CLOSED","ordertype":"LAB","providerusername":"landerson17","resultcategory":"UNKNOWN","documenttypeid":342116,"documentroute":"INTERFACE","encounterdate":"12/16/2015","performinglabstate":"FL","description":"CBC","facilityid":12372415,"lastmodifieddate":"12/18/2024","observationdate":"12/16/2015","createduser":"INTERFACE","performinglabname":"Mdp - Relaymed Results","isreviewedbyprovider":true}',
        },
        performer: [
          {
            reference: "Practitioner/70",
          },
        ],
        effectiveDateTime: new Date().toISOString(),
        result: [
          {
            reference: "Observation/5521",
          },
          {
            reference: "Observation/5522",
          },
          {
            reference: "Observation/5523",
          },
          {
            reference: "Observation/5524",
          },
          {
            reference: "Observation/22052",
          },
          {
            reference: "Observation/22053",
          },
          {
            reference: "Observation/22054",
          },
          {
            reference: "Observation/22055",
          },
          {
            reference: "Observation/22079",
          },
          {
            reference: "Observation/22080",
          },
          {
            reference: "Observation/22081",
          },
          {
            reference: "Observation/22082",
          },
          {
            reference: "Observation/22083",
          },
          {
            reference: "Observation/22084",
          },
          {
            reference: "Observation/22085",
          },
          {
            reference: "Observation/22086",
          },
        ],
        presentedForm: [
          {
            extension: [
              {
                url: "http://xcaliber-fhir/structureDefinition/created-date",
                valueDateTime: new Date().toISOString(),
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/status",
                valueString: "CLOSED",
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/document-source",
                valueString: "INTERFACE",
              },
            ],
          },
        ],
        issued: new Date().toISOString(),
        extension: [
          {
            url: "http://xcaliber-fhir/structureDefinition/priority",
            valueString: "2",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/facility-id",
            valueInteger: 12372415,
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/is-reviewed-by-provider",
            valueBoolean: true,
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/lab-result-date",
            valueDate: "2015-12-16",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/created-user",
            valueString: "INTERFACE",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/department-id",
            valueString: "1",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/document-source",
            valueString: "INTERFACE",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/document-route",
            valueString: "INTERFACE",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/document-type-id",
            valueInteger: 342116,
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/encounter-date",
            valueDate: "2015-12-16",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/last-modified-datetime",
            valueDateTime: "2024-12-18T12:01:13-05:00",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/last-modified-user",
            valueString: "API-27306",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/order-type",
            valueString: "LAB",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/status",
            valueString: "CLOSED",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/action-note",
            valueString: "scrambled notes",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/result-category",
            valueString: "UNKNOWN",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/provider-user-name",
            valueString: "landerson17",
          },
        ],
        // contained: [
        //   {
        //     resourceType: "Observation",
        //     status: "final",
        //     code: {
        //       coding: [
        //         {
        //           display: "White Blood Cells (WBC)",
        //           extension: [
        //             {
        //               url: "http://xcaliber-fhir/structureDefinition/analytes/observation-identifier",
        //               valueString: "6690-2",
        //             },
        //           ],
        //         },
        //         {
        //           system: "http://loinc.org",
        //           code: "6690-2",
        //           display: "White Blood Cells (WBC)",
        //         },
        //       ],
        //     },
        //     category: [
        //       {
        //         coding: [
        //           {
        //             code: "laboratory",
        //           },
        //         ],
        //       },
        //     ],
        //     extension: [],
        //     id: 5525,
        //     subject: {
        //       reference: "Patient/{patientId}",
        //     },
        //     valueQuantity: {
        //       value: 7.5,
        //       unit: "x10^9/L",
        //       system: "http://unitsofmeasure.org",
        //       code: "10*9/L",
        //     },
        //   },
        //   {
        //     resourceType: "Observation",
        //     status: "final",
        //     code: {
        //       coding: [
        //         {
        //           display: "Red Blood Cells (RBC)",
        //           extension: [
        //             {
        //               url: "http://xcaliber-fhir/structureDefinition/analytes/observation-identifier",
        //               valueString: "789-8",
        //             },
        //           ],
        //         },
        //         {
        //           system: "http://loinc.org",
        //           code: "789-8",
        //           display: "Red Blood Cells (RBC)",
        //         },
        //       ],
        //     },
        //     category: [
        //       {
        //         coding: [
        //           {
        //             code: "laboratory",
        //           },
        //         ],
        //       },
        //     ],
        //     extension: [],
        //     id: 5526,
        //     subject: {
        //       reference: "Patient/{patientId}",
        //     },
        //     valueQuantity: {
        //       value: 4.8,
        //       unit: "x10^12/L",
        //       system: "http://unitsofmeasure.org",
        //       code: "10*12/L",
        //     },
        //   },
        //   {
        //     resourceType: "Observation",
        //     status: "final",
        //     code: {
        //       coding: [
        //         {
        //           display: "Hemoglobin (Hb)",
        //           extension: [
        //             {
        //               url: "http://xcaliber-fhir/structureDefinition/analytes/observation-identifier",
        //               valueString: "718-7",
        //             },
        //           ],
        //         },
        //         {
        //           system: "http://loinc.org",
        //           code: "718-7",
        //           display: "Hemoglobin (Hb)",
        //         },
        //       ],
        //     },
        //     category: [
        //       {
        //         coding: [
        //           {
        //             code: "laboratory",
        //           },
        //         ],
        //       },
        //     ],
        //     extension: [],
        //     id: 5527,
        //     subject: {
        //       reference: "Patient/{patientId}",
        //     },
        //     valueQuantity: {
        //       value: 14.5,
        //       unit: "g/dL",
        //       system: "http://unitsofmeasure.org",
        //       code: "g/dL",
        //     },
        //   },
        //   {
        //     resourceType: "Observation",
        //     status: "final",
        //     code: {
        //       coding: [
        //         {
        //           display: "Hematocrit (Hct)",
        //           extension: [
        //             {
        //               url: "http://xcaliber-fhir/structureDefinition/analytes/observation-identifier",
        //               valueString: "4544-3",
        //             },
        //           ],
        //         },
        //         {
        //           system: "http://loinc.org",
        //           code: "4544-3",
        //           display: "Hematocrit (Hct)",
        //         },
        //       ],
        //     },
        //     category: [
        //       {
        //         coding: [
        //           {
        //             code: "laboratory",
        //           },
        //         ],
        //       },
        //     ],
        //     extension: [],
        //     id: 5528,
        //     subject: {
        //       reference: "Patient/{patientId}",
        //     },
        //     valueQuantity: {
        //       value: 43,
        //       unit: "%",
        //       system: "http://unitsofmeasure.org",
        //       code: "%",
        //     },
        //   },
        //   {
        //     resourceType: "Observation",
        //     status: "final",
        //     code: {
        //       coding: [
        //         {
        //           display: "Mean Corpuscular Volume (MCV)",
        //           extension: [
        //             {
        //               url: "http://xcaliber-fhir/structureDefinition/analytes/observation-identifier",
        //               valueString: "787-2",
        //             },
        //           ],
        //         },
        //         {
        //           system: "http://loinc.org",
        //           code: "787-2",
        //           display: "Mean Corpuscular Volume (MCV)",
        //         },
        //       ],
        //     },
        //     category: [
        //       {
        //         coding: [
        //           {
        //             code: "laboratory",
        //           },
        //         ],
        //       },
        //     ],
        //     extension: [],
        //     id: 5529,
        //     subject: {
        //       reference: "Patient/{patientId}",
        //     },
        //     valueQuantity: {
        //       value: 90,
        //       unit: "fL",
        //       system: "http://unitsofmeasure.org",
        //       code: "fL",
        //     },
        //   },
        //   {
        //     resourceType: "Observation",
        //     status: "final",
        //     code: {
        //       coding: [
        //         {
        //           display: "Platelets (PLT)",
        //           extension: [
        //             {
        //               url: "http://xcaliber-fhir/structureDefinition/analytes/observation-identifier",
        //               valueString: "777-3",
        //             },
        //           ],
        //         },
        //         {
        //           system: "http://loinc.org",
        //           code: "777-3",
        //           display: "Platelets (PLT)",
        //         },
        //       ],
        //     },
        //     category: [
        //       {
        //         coding: [
        //           {
        //             code: "laboratory",
        //           },
        //         ],
        //       },
        //     ],
        //     extension: [],
        //     id: 5530,
        //     subject: {
        //       reference: "Patient/{patientId}",
        //     },
        //     valueQuantity: {
        //       value: 250,
        //       unit: "x10^9/L",
        //       system: "http://unitsofmeasure.org",
        //       code: "10*9/L",
        //     },
        //   },
        //   {
        //     resourceType: "Organization",
        //     id: "195903",
        //     address: [
        //       {
        //         line: [],
        //         city: "Winter Park",
        //         state: "FL",
        //         postalCode: "32789",
        //       },
        //     ],
        //   },
        // ],

        contained: [
          {
            resourceType: "Observation",
            status: "final",
            code: {
              coding: [
                {
                  display: "White Blood Cells (WBC)",
                  extension: [
                    {
                      url: "http://xcaliber-fhir/structureDefinition/analytes/observation-identifier",
                      valueString: "6690-2",
                    },
                  ],
                },
                {
                  system: "http://loinc.org",
                  code: "6690-2",
                  display: "White Blood Cells (WBC)",
                },
              ],
            },
            category: [
              {
                coding: [
                  {
                    code: "laboratory",
                  },
                ],
              },
            ],
            id: 5525,
            subject: {
              reference: "Patient/{patientId}",
            },
            valueQuantity: {
              value: 7.5,
              unit: "x10^9/L",
              system: "http://unitsofmeasure.org",
              code: "10*9/L",
              extension: [
                {
                  url: "http://xcaliber-fhir/structureDefinition/result-status",
                  valueString: "Normal",
                },
              ],
            },
            referenceRange: [
              {
                low: { value: 4.5, unit: "x10^9/L" },
                high: { value: 11.0, unit: "x10^9/L" },
              },
            ],
          },
          {
            resourceType: "Observation",
            status: "final",
            code: {
              coding: [
                {
                  display: "Red Blood Cells (RBC)",
                  extension: [
                    {
                      url: "http://xcaliber-fhir/structureDefinition/analytes/observation-identifier",
                      valueString: "789-8",
                    },
                  ],
                },
                {
                  system: "http://loinc.org",
                  code: "789-8",
                  display: "Red Blood Cells (RBC)",
                },
              ],
            },
            category: [
              {
                coding: [
                  {
                    code: "laboratory",
                  },
                ],
              },
            ],
            id: 5526,
            subject: {
              reference: "Patient/{patientId}",
            },
            valueQuantity: {
              value: 4.8,
              unit: "x10^12/L",
              system: "http://unitsofmeasure.org",
              code: "10*12/L",
              extension: [
                {
                  url: "http://xcaliber-fhir/structureDefinition/result-status",
                  valueString: "Normal",
                },
              ],
            },
            referenceRange: [
              {
                low: { value: 4.5, unit: "x10^12/L" },
                high: { value: 5.5, unit: "x10^12/L" },
              },
            ],
          },
          {
            resourceType: "Observation",
            status: "final",
            code: {
              coding: [
                {
                  display: "Hemoglobin (Hb)",
                  extension: [
                    {
                      url: "http://xcaliber-fhir/structureDefinition/analytes/observation-identifier",
                      valueString: "718-7",
                    },
                  ],
                },
                {
                  system: "http://loinc.org",
                  code: "718-7",
                  display: "Hemoglobin (Hb)",
                },
              ],
            },
            category: [
              {
                coding: [
                  {
                    code: "laboratory",
                  },
                ],
              },
            ],
            id: 5527,
            subject: {
              reference: "Patient/{patientId}",
            },
            valueQuantity: {
              value: 14.5,
              unit: "g/dL",
              system: "http://unitsofmeasure.org",
              code: "g/dL",
              extension: [
                {
                  url: "http://xcaliber-fhir/structureDefinition/result-status",
                  valueString: "Normal",
                },
              ],
            },
            referenceRange: [
              {
                low: { value: 13.5, unit: "g/dL" },
                high: { value: 17.5, unit: "g/dL" },
              },
            ],
          },
          {
            resourceType: "Observation",
            status: "final",
            code: {
              coding: [
                {
                  display: "Hematocrit (Hct)",
                  extension: [
                    {
                      url: "http://xcaliber-fhir/structureDefinition/analytes/observation-identifier",
                      valueString: "4544-3",
                    },
                  ],
                },
                {
                  system: "http://loinc.org",
                  code: "4544-3",
                  display: "Hematocrit (Hct)",
                },
              ],
            },
            category: [
              {
                coding: [
                  {
                    code: "laboratory",
                  },
                ],
              },
            ],
            id: 5528,
            subject: {
              reference: "Patient/{patientId}",
            },
            valueQuantity: {
              value: 43,
              unit: "%",
              system: "http://unitsofmeasure.org",
              code: "%",
              extension: [
                {
                  url: "http://xcaliber-fhir/structureDefinition/result-status",
                  valueString: "Normal",
                },
              ],
            },
            referenceRange: [
              {
                low: { value: 40, unit: "%" },
                high: { value: 52, unit: "%" },
              },
            ],
          },
          {
            resourceType: "Observation",
            status: "final",
            code: {
              coding: [
                {
                  display: "Platelets (PLT)",
                  extension: [
                    {
                      url: "http://xcaliber-fhir/structureDefinition/analytes/observation-identifier",
                      valueString: "777-3",
                    },
                  ],
                },
                {
                  system: "http://loinc.org",
                  code: "777-3",
                  display: "Platelets (PLT)",
                },
              ],
            },
            category: [
              {
                coding: [
                  {
                    code: "laboratory",
                  },
                ],
              },
            ],
            id: 5530,
            subject: {
              reference: "Patient/{patientId}",
            },
            valueQuantity: {
              value: 250,
              unit: "x10^9/L",
              system: "http://unitsofmeasure.org",
              code: "10*9/L",
              extension: [
                {
                  url: "http://xcaliber-fhir/structureDefinition/result-status",
                  valueString: "Normal",
                },
              ],
            },
            referenceRange: [
              {
                low: { value: 150, unit: "x10^9/L" },
                high: { value: 450, unit: "x10^9/L" },
              },
            ],
          },
          {
            resourceType: "Observation",
            status: "final",
            code: {
              coding: [
                {
                  display: "Mean Corpuscular Hemoglobin (MCH)",
                  extension: [
                    {
                      url: "http://xcaliber-fhir/structureDefinition/analytes/observation-identifier",
                      valueString: "785-6",
                    },
                  ],
                },
                {
                  system: "http://loinc.org",
                  code: "785-6",
                  display: "Mean Corpuscular Hemoglobin (MCH)",
                },
              ],
            },
            category: [{ coding: [{ code: "laboratory" }] }],
            id: 5531,
            subject: { reference: "Patient/{patientId}" },
            valueQuantity: {
              value: 30,
              unit: "pg",
              system: "http://unitsofmeasure.org",
              code: "pg",
              extension: [
                {
                  url: "http://xcaliber-fhir/structureDefinition/result-status",
                  valueString: "Normal",
                },
              ],
            },
            referenceRange: [
              {
                low: { value: 27, unit: "pg" },
                high: { value: 33, unit: "pg" },
              },
            ],
          },
          {
            resourceType: "Observation",
            status: "final",
            code: {
              coding: [
                {
                  display: "Mean Corpuscular Hemoglobin Concentration (MCHC)",
                  extension: [
                    {
                      url: "http://xcaliber-fhir/structureDefinition/analytes/observation-identifier",
                      valueString: "786-4",
                    },
                  ],
                },
                {
                  system: "http://loinc.org",
                  code: "786-4",
                  display: "Mean Corpuscular Hemoglobin Concentration (MCHC)",
                },
              ],
            },
            category: [{ coding: [{ code: "laboratory" }] }],
            id: 5532,
            subject: { reference: "Patient/{patientId}" },
            valueQuantity: {
              value: 34,
              unit: "g/dL",
              system: "http://unitsofmeasure.org",
              code: "g/dL",
              extension: [
                {
                  url: "http://xcaliber-fhir/structureDefinition/result-status",
                  valueString: "Normal",
                },
              ],
            },
            referenceRange: [
              {
                low: { value: 32, unit: "g/dL" },
                high: { value: 36, unit: "g/dL" },
              },
            ],
          },
          {
            resourceType: "Organization",
            id: "195903",
            address: [
              {
                line: [],
                city: "Winter Park",
                state: "FL",
                postalCode: "32789",
              },
            ],
          },
        ],
      },
    };

    try {
      const response = await LabOrderService.createLabOrder(payload, sourceId);
      const basedOn = [
        {
          reference: `ServiceRequest/${response?.data.id || "UNKNOWN"}`,
        },
      ];
      payloadLabResult = { ...payloadLabResult, basedOn: basedOn };
      const responseLabResult = await LabResultsService.createLabResult(
        payloadLabResult,
        sourceId
      );
      console.log("Create Lab Order Response:", response);
      console.log("Create Lab Result Response:", responseLabResult);

      if (response.data.status === "success") {
        toast.success("Form submitted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  // ✅ Handles form input changes
  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-bold">LAB ORDER DETAILS</h1>
        </div>

        <Label className="text-base">Select Receiver</Label>
        {/* Zipcode Input */}
        <div className="mt-4">
          <Label>Enter Zip Code</Label>
          <input
            type="text"
            name="zip"
            value={formData.zip}
            onChange={handleInputChange}
            placeholder="Enter Zip Code"
            className="border px-4 py-2 w-full rounded-md"
          />
        </div>
        {/* Practitioners Dropdown */}
        <div className="mt-4">
          <Label>Select Practitioner</Label>
          {practitioners.length === 0 && !formData.zip ? (
            // ✅ Show a disabled input field with the text instead of the dropdown
            <input
              type="text"
              value="Enter a ZIP to see Practitioners"
              disabled
              className="border px-4 py-2 w-full rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          ) : (
            <Select
              label="Select a Practitioner"
              options={practitioners.map((p) => ({
                value: p.resource.id,
                label: p.resource.name?.[0]?.text || "Unknown Practitioner",
              }))}
              value={formData.orderingProvider}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, orderingProvider: value }))
              }
              isSearchable
              placeholder="Select a reference"
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensures highest z-index
                menu: (base) => ({ ...base, zIndex: 9999 }), // Backup for menu styling
              }}
            />
          )}
        </div>

        <div className="border-b border-gray-300 my-5" />

        {/* Reference Dropdown */}
        <div>
          <Label className="text-base">Select Order Type</Label>
          <Select
            label="Select a reference"
            options={referenceOptions.map((option) => ({
              value: option.ordertypeid.toString(), // Ensure this is a string
              label: option.name, // Display name correctly
            }))}
            value={
              formData.reference
                ? {
                    value: formData.reference.ordertypeid.toString(),
                    label: formData.reference.name,
                  }
                : null
            } // Ensure the value is an object
            onChange={(selectedOption) => {
              const selectedOptionData = referenceOptions.find(
                (option) =>
                  option.ordertypeid.toString() === selectedOption?.value
              );

              if (selectedOptionData) {
                setFormData((prev) => ({
                  ...prev,
                  reference: {
                    ordertypeid: selectedOptionData.ordertypeid.toString(),
                    name: selectedOptionData.name,
                  },
                }));
              }
            }}
            isSearchable
            placeholder="Select a reference"
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensures highest z-index
              menu: (base) => ({ ...base, zIndex: 9999 }), // Backup for menu styling
            }}
          />
        </div>

        <div className="mt-4">
          <Label className="text-base">Select Problem or Diagnosis</Label>
          <Select
            options={diagnosisOptions}
            value={diagnosisOptions.find(
              (option) => option.value === formData.problem
            )}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, problem: value?.value }));
            }}
            isSearchable
            placeholder="Select Problem or Diagnosis"
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensures highest z-index
              menu: (base) => ({ ...base, zIndex: 9999 }), // Backup for menu styling
            }}
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" type="submit">
            SUBMIT ORDER
          </Button>
          <ToastContainer />
        </div>
      </form>
    </div>
  );
}
