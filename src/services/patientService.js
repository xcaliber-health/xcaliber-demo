import axios from "axios";
import { Helper } from "../core-utils/helper";

export const PatientService = {
  getPatientById: async (id,departmentId="150") => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl = Helper.getSourceUrl();
      console.log(sourceUrl);
      const response = await axios.get(
        `${sourceUrl}/Patient/${id}?departmentId=${departmentId}`,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "x-source-id": "083fe714-e36e-4851-b2e7-a7166b439f67",
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
