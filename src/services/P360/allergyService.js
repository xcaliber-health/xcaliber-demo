import axios from "axios";
import { result } from "lodash";
import {
  EPIC_XCHANGE_ENDPOINT,
  XCHANGE_SERVICE_ENDPOINT,
} from "../../core-utils/constants";
import { Helper } from '../../core-utils/helper';


export const AllergyService = {
  getAllergies: async (patientId) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl = Helper.getSourceUrl()

      const result = await axios.get(
        `${sourceUrl}/AllergyIntolerance?patient=${patientId}${sourceType !== 'ECW' ? `&departmentId=${localStorage.getItem(
          `DEPARTMENT_ID`
        )}` : ""}`,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          },
        }
      );
      return result?.data?.data?.entry ? result?.data?.data?.entry : result?.data?.entry;
    } catch (error) {
      console.log(error);
    }
  },
  createAllergies: async (allergyPayload) => {
    try {
      let sourceUrl = Helper.getSourceUrl()
      const result = await axios.post(
        `${sourceUrl}/AllergyIntolerance`,
        allergyPayload,
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
  getAllergyById: async (id) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl = Helper.getSourceUrl()
      const result = await axios.get(`${sourceUrl}/AllergyIntolerance/${id}`, {
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
