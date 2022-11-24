import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT } from "../../core-utils/constants";

export const ImmunizationService = {
  getImmunization: async (patientId) => {
    try {
      const result = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/Immunization?patient=${patientId}&departmentId=${localStorage.getItem(
          `DEPARTMENT_ID`
        )}`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          },
        }
      );
      return result?.data?.data?.entry?.slice(0, 2);
    } catch (error) {
      console.log(error);
    }
  },
};
