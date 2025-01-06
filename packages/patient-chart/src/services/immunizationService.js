import axios from "axios";
import { Helper } from "../core-utils/helper";

export const ImmunizationService = {
  getImmunization: async (patientId) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl = Helper.getSourceUrl();
      const result = await axios.get(
        `${sourceUrl}/Immunization?patient=${patientId}${
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
      return result?.data?.data?.entry
        ? result?.data?.data?.entry
        : result?.data?.entry;
    } catch (error) {
      console.log(error);
    }
  },
  createImmunization: async (immunizationPayload) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl = Helper.getSourceUrl();
      const result = await axios.post(
        `${sourceUrl}/Immunization`,
        immunizationPayload,
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
  getImmunizationById: async (id) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl = Helper.getSourceUrl();
      const result = await axios.get(`${sourceUrl}/Immunization/${id}`, {
        headers: {
          Authorization: Helper.getSourceToken(),
          "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
        },
      });

      return result?.data?.data ? result?.data?.data : result?.data;
    } catch (error) {
      console.log(error);
    }
  },
};
