import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT, EPIC_XCHANGE_ENDPOINT } from "../../core-utils/constants";
export const MedicationOrderService = {
  createMedicationOrder: async (
    payLoad,
    appointmentId = "0",
    patientId,
    medicationReason
  ) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? EPIC_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
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
            `${sourceUrl}/api/v1/Appointment`,
            appointmentPayload,
            {
              headers: {
                Authorization: localStorage.getItem("XCALIBER_SOURCE") === "EPIC" ? `${process.env.REACT_APP_EPIC_AUTHORIZATION}` : `${process.env.REACT_APP_AUTHORIZATION}`,
                "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
              },
            }
          );
          appointmentId = result.data?.data?.id;
        }
        await axios
          .patch(
            `${sourceUrl}/api/v1/Appointment/${appointmentId}`,
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
                Authorization: localStorage.getItem("XCALIBER_SOURCE") === "EPIC" ? `${process.env.REACT_APP_EPIC_AUTHORIZATION}` : `${process.env.REACT_APP_AUTHORIZATION}`,
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
            `${sourceUrl}/api/v1/Appointment/${appointmentId}`,
            {
              headers: {
                Authorization: localStorage.getItem("XCALIBER_SOURCE") === "EPIC" ? `${process.env.REACT_APP_EPIC_AUTHORIZATION}` : `${process.env.REACT_APP_AUTHORIZATION}`,
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
        `${sourceUrl}/api/v1/Condition`,
        diagnosisPayload,
        {
          headers: {
            Authorization: localStorage.getItem("XCALIBER_SOURCE") === "EPIC" ? `${process.env.REACT_APP_EPIC_AUTHORIZATION}` : `${process.env.REACT_APP_AUTHORIZATION}`,
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
        `${sourceUrl}/api/v1/MedicationRequest`,
        payLoad,
        {
          headers: {
            Authorization: localStorage.getItem("XCALIBER_SOURCE") === "EPIC" ? `${process.env.REACT_APP_EPIC_AUTHORIZATION}` : `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );
      return response.data?.data?.id;
    } catch (error) {
      console.log(error);
    }
  },

  getMedicationOrders: async (patientId) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? EPIC_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      if (localStorage.getItem(`XCALIBER_SOURCE`) === "ATHENA") {
        const encounterResponse = await axios.get(
          `${sourceUrl}/api/v1/Encounter?patient=${patientId}&departmentId=${localStorage.getItem(
            `DEPARTMENT_ID`
          )}`,
          {
            headers: {
              Authorization: localStorage.getItem("XCALIBER_SOURCE") === "EPIC" ? `${process.env.REACT_APP_EPIC_AUTHORIZATION}` : `${process.env.REACT_APP_AUTHORIZATION}`,
              "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods":
                "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            },
          }
        );
        let count = 0;
        const medicationOrders = [];
        for (let i = 0; i < encounterResponse?.data?.data?.entry?.length; i++) {
          const encounterId =
            encounterResponse?.data?.data?.entry?.[i]?.resource?.id;
          const medicationOrdersResponse = await axios.get(
            `${sourceUrl}/api/v1/MedicationRequest?patient=${patientId}&encounter=${encounterId}`,
            {
              headers: {
                Authorization: localStorage.getItem("XCALIBER_SOURCE") === "EPIC" ? `${process.env.REACT_APP_EPIC_AUTHORIZATION}` : `${process.env.REACT_APP_AUTHORIZATION}`,
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
