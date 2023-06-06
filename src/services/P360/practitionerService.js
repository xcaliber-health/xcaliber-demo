import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT, BLITZ_XCHANGE_ENDPOINT } from "../../core-utils/constants";
import store from "../../Redux/store";

export const PractitionerService = {
  getPractitionerById: async (id) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? BLITZ_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      const response = await axios.get(
        `${sourceUrl}/api/v1/Practitioner?practitioner=${id}`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
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
