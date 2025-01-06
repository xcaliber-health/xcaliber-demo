import axios from "axios";
import { Helper } from "../core-utils/helper";

export const PractitionerService = {
  getPractitionerById: async (id) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl = Helper.getSourceUrl();
      const response = await axios.get(
        `${sourceUrl}/Practitioner?practitioner=${id}`,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "x-source-id": localStorage.getItem(`XCALIBER_TOKEN`),
          },
        }
      );
      console.log(id);
      console.log(response.data?.data);
      return response.data?.data ? response.data?.data : response.data;
    } catch (error) {
      //Handle Exception
      console.log(error);
    }
  },
};
