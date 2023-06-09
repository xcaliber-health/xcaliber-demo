import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT, EPIC_XCHANGE_ENDPOINT } from "../../core-utils/constants";
import { Helper } from '../../core-utils/helper';

export const MedicationService = {
  getMedications: async (patientId) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl = Helper.getSourceUrl()
      const result = await axios.get(
        `${sourceUrl}/api/v1/MedicationStatement?patient=${patientId}&category=problem-list-item&departmentId=${localStorage.getItem(
          `DEPARTMENT_ID`
        )}`,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          },
        }
      );
      return result?.data?.data?.entry;
    } catch (error) {
      console.log(error);
    }
  },
  createMedicationInAthena: async (requestPayLoad) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl = Helper.getSourceUrl()
      const result = await axios.post(
        `${sourceUrl}/api/v1/MedicationStatement`,
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
      return result?.data?.data;
    } catch (error) {
      console.log(error);
    }
  },
};
