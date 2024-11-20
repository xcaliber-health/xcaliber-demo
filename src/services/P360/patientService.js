import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT, EPIC_XCHANGE_ENDPOINT } from "../../core-utils/constants";
import store from "../../Redux/store";
import { Helper } from '../../core-utils/helper';

export const PatientService = {
  getPatientById: async (id) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl = Helper.getSourceUrl()
      const response = await axios.get(
        `${sourceUrl}/Patient/${id}?departmentId=${localStorage.getItem(
          `DEPARTMENT_ID`
        )}`,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "x-source-id": localStorage.getItem(`XCALIBER_TOKEN`),
          },
        }
      );
      return response.data?.data ? response.data?.data : response.data;
    } catch (error) {
      //Handle Exception
      console.log(error);
    }
  },
};
