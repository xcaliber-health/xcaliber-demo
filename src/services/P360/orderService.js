import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT, EPIC_XCHANGE_ENDPOINT } from "../../core-utils/constants";
import { Helper } from '../../core-utils/helper';

export const OrderService = {
  getOrders: async (patientId) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl = Helper.getSourceUrl();
      let url = '';
      // hardcode encounter id for now 
      if (sourceType === "ATHENA") {
        url = `${sourceUrl}/ServiceRequest?patient=${patientId}&departmentId=${localStorage.getItem(
          `DEPARTMENT_ID`)}&encounter=44602&categorycode=108252007`
      } else {
        url = `${sourceUrl}/ServiceRequest?patient=${patientId}${sourceType !== 'ECW' ? `&departmentId=${localStorage.getItem(
          `DEPARTMENT_ID`
        )}` : ""}`
      }
      const result = await axios.get(
        url,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          },
        }
      );
      return result.data?.data?.entry;
    } catch (error) {
      //Handle Exception
      console.log(error);
    }
  }
}