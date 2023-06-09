import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT, EPIC_XCHANGE_ENDPOINT } from "../../core-utils/constants";
import store from "../../Redux/store";
import { Helper } from '../../core-utils/helper';

export const PractitionerService = {
  getPractitionerById: async (id) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl = Helper.getSourceUrl()
      const response = await axios.get(
        `${sourceUrl}/api/v1/Practitioner?practitioner=${id}`,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "x-source-id": localStorage.getItem(`XCALIBER_TOKEN`),
          },
        }
      );
      console.log(id);
      console.log(response.data?.data);
      return response.data?.data;
    } catch (error) {
      //Handle Exception
      console.log(error);
    }
  },
};
