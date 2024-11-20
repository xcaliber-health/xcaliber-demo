import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT, EPIC_XCHANGE_ENDPOINT } from "../../core-utils/constants";
import { Helper } from '../../core-utils/helper';

export const MedicationOrderService = {
  createMedicationOrder: async (
    payLoad,
    appointmentId = "0",
    patientId,
    medicationReason
  ) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl = Helper.getSourceUrl()
      let encounterId = "0";
      if (localStorage.getItem(`XCALIBER_SOURCE`) === "ATHENA") {
        if (appointmentId === undefined || appointmentId === "0") {
          const appointmentPayload = {
            context: {
              departmentId: localStorage.getItem(`DEPARTMENT_ID`),
            },
            data: {
              resourceType: "Appointment",
              start: new Date().toISOString(),
              minutesDuration: 15,
              appointmentType: {
                coding: [
                  {
                    system: "https://hl7.org/fhir/v2/ValueSet/appointment-type",
                    code: "1189",
                    display: "",
                  },
                ],
              },
              status: "booked",
              extension:
                localStorage.getItem(`XCALIBER_SOURCE`) === "ATHENA"
                  ? [
                      {
                        url: "http://xcaliber-fhir/structureDefinition/copay",
                        valueString: {
                          collectedforother: 0,
                          collectedforappointment: 0,
                          insurancecopay: 0,
                        },
                      },
                      {
                        url: "http://xcaliber-fhir/structureDefinition/copay",
                        valueString: 0,
                      },
                      {
                        url: "http://xcaliber-fhir/structureDefinition/department-id",
                        valueInteger: localStorage.getItem(`DEPARTMENT_ID`),
                      },
                    ]
                  : [],
              participant: [
                {
                  actor: {
                    reference:
                      localStorage.getItem(`XCALIBER_SOURCE`) === "ELATION"
                        ? "Practitioner/140857915539458"
                        : "Practitioner/111",
                  },
                },
                {
                  actor: {
                    reference: "HealthcareService/140857911017476",
                  },
                },
                {
                  actor: {
                    reference: `Patient/${patientId}`,
                  },
                },
                localStorage.getItem(`XCALIBER_SOURCE`) === "ELATION"
                  ? {}
                  : {
                      actor: {
                        reference: `Location/${localStorage.getItem(
                          `DEPARTMENT_ID`
                        )}`,
                      },
                    },
              ],
            },
          };
          const result = await axios.post(
            `${sourceUrl}/Appointment`,
            appointmentPayload,
            {
              headers: {
                Authorization: Helper.getSourceToken(),
                "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
              },
            }
          );
          appointmentId = result.data?.data?.id;
        }
        await axios
          .patch(
            `${sourceUrl}/Appointment/${appointmentId}`,
            {
              context: {
                departmentId: localStorage.getItem(`DEPARTMENT_ID`),
              },
              data: {
                status: "checked-in",
              },
            },
            {
              headers: {
                Authorization: Helper.getSourceToken(),
                "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods":
                  "GET,PUT,POST,DELETE,PATCH,OPTIONS",
              },
            }
          )
          .then((res) => {})
          .catch((error) => {
            console.log(error);
          });
        await axios
          .get(
            `${sourceUrl}/Appointment/${appointmentId}`,
            {
              headers: {
                Authorization: Helper.getSourceToken(),
                "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods":
                  "GET,PUT,POST,DELETE,PATCH,OPTIONS",
              },
            }
          )
          .then((res) => {
            encounterId =
              res.data?.data?.supportingInformation?.[0]?.reference?.split(
                "Encounter/"
              )[1];
          })
          .catch(() => {
            console.log(error);
          });
      }
      const diagnosisPayload = {
        context: {
          departmentId: localStorage.getItem(`DEPARTMENT_ID`),
        },
        data: {
          resourceType: "Condition",
          subject: {
            reference: `Patient/${patientId}`,
          },
          category: [
            {
              coding: [
                {
                  code: "encounter-diagnosis",
                },
              ],
            },
          ],
          encounter: {
            reference: `Encounter/${encounterId}`,
          },
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: medicationReason,
              },
            ],
          },
        },
      };
      const diagnosisResponse = await axios.post(
        `${sourceUrl}/Condition`,
        diagnosisPayload,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );
      payLoad.data.encounter = {
        reference: `Encounter/${encounterId}`,
      };
      const response = await axios.post(
        `${sourceUrl}/MedicationRequest`,
        payLoad,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );
      return response.data?.data?.id ? response.data?.data?.id : response.data?.id;
    } catch (error) {
      console.log(error);
    }
  },

  getMedicationOrders: async (patientId) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl = Helper.getSourceUrl()
      if (localStorage.getItem(`XCALIBER_SOURCE`) === "ATHENA") {
        // const encounterResponse = await axios.get(
        //   `${sourceUrl}/Encounter?patient=${patientId}&departmentId=${localStorage.getItem(
        //     `DEPARTMENT_ID`
        //   )}`,
        //   {
        //     headers: {
        //       Authorization: Helper.getSourceToken(),
        //       "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
        //       "Access-Control-Allow-Origin": "*",
        //       "Access-Control-Allow-Methods":
        //         "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        //     },
        //   }
        // );
        let count = 0;
        const medicationOrders = [];
        for (let i = 0; i < 1; i++) {
          const encounterId = 44602;
          const medicationOrdersResponse = await axios.get(
            `${sourceUrl}/MedicationRequest?patient=${patientId}&encounter=${encounterId}`,
            {
              headers: {
                Authorization: Helper.getSourceToken(),
                "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods":
                  "GET,PUT,POST,DELETE,PATCH,OPTIONS",
              },
            }
          );
          for (
            let j = 0;
            j < medicationOrdersResponse?.data?.data?.entry?.length;
            j++
          ) {
            if (count < 10) {
              medicationOrders.push(
                medicationOrdersResponse?.data?.data?.entry?.[j]
              );
              count++;
            } else {
              break;
            }
          }
          if (count >= 10) {
            break;
          }
        }
        return medicationOrders;
      }
    } catch (error) {
      console.log(error);
    }
  },
};
