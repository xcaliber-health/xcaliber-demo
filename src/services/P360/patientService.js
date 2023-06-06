import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT, EPIC_XCHANGE_ENDPOINT } from "../../core-utils/constants";
import store from "../../Redux/store";

export const PatientService = {
  getPatientById: async (id) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? EPIC_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      const response = await axios.get(
        `${sourceUrl}/api/v1/Patient/${id}?departmentId=${localStorage.getItem(
          `DEPARTMENT_ID`
        )}`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": localStorage.getItem(`XCALIBER_TOKEN`),
          },
        }
      );
      return response.data?.data;
    } catch (error) {
      //Handle Exception
      console.log(error);
    }
  },
};
