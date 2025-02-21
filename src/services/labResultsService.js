import axios from "axios";
import { Helper } from "../core-utils/helper";

export const LabResultsService = {

  createLabResult: async (payload, sourceId) => {
    sourceId;
    try {
      let sourceUrl = Helper.getSourceUrl();
      const response = await axios.post(
        `https://xchange-sandbox.xcaliberapis.com/api/v2/DiagnosticReport`,
        payload,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "Content-Type": "application/json",
            "x-source-id": sourceId,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating service request:", error);
    }
  },
  // getLabResultById: async (id, patientId) => {
  //   try {
  //     let sourceType = localStorage.getItem("XCALIBER_SOURCE");
  //     let sourceUrl = Helper.getSourceUrl();
  //     const result = await axios.get(
  //       `${sourceUrl}/Condition/${id}?patient=${patientId}&category=problem-list-item${
  //         sourceType !== "ECW"
  //           ? `&departmentId=${localStorage.getItem(`DEPARTMENT_ID`)}`
  //           : ""
  //       }`,
  //       {
  //         headers: {
  //           Authorization: Helper.getSourceToken(),
  //           "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
  //         },
  //       }
  //     );
  //     return result?.data?.data ? result?.data?.data : result?.data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
};
