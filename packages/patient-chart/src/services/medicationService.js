import axios from "axios";
import { Helper } from "../core-utils/helper";

export const MedicationService = {
  getMedications: async (patientId) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl = Helper.getSourceUrl();
      const result = await axios.get(
        `${sourceUrl}/MedicationStatement?patient=${patientId}&category=problem-list-item${
          sourceType !== "ECW"
            ? `&departmentId=${localStorage.getItem(`DEPARTMENT_ID`)}`
            : ""
        }`,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          },
        }
      );
      console.log(
        "MedicationService -> getMedications -> result",
        result?.data?.data?.entry
      );
      return result?.data?.data?.entry
        ? result?.data?.data?.entry
        : result?.data?.entry;
    } catch (error) {
      console.log(error);
    }
  },
  createMedicationInAthena: async (requestPayLoad) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl = Helper.getSourceUrl();
      const result = await axios.post(
        `${sourceUrl}/MedicationStatement`,
        requestPayLoad,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );
      return result?.data?.data ? result?.data?.data : result?.data;
    } catch (error) {
      console.log(error);
    }
  },
};
