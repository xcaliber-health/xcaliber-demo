import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT } from "../../core-utils/constants";
import store from "../../Redux/store";

export const PatientService = {
  getPatientById: async (id) => {
    try {
      const response = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/Patient/${id}?departmentId=${localStorage.getItem(
          `DEPARTMENT_ID`
        )}`,
        {
          headers: {
            "apikey": `${process.env.REACT_APP_AUTHORIZATION}`,
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
