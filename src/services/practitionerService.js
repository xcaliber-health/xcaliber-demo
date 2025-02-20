import axios from "axios";
import { Helper } from "../core-utils/helper";

export const PractitionerService = {
  getPractitioners: async (category, name, zip, practiceId, sourceId) => {
    try {
      let sourceUrl = Helper.getSourceUrl();
      const result = await axios.get(
        `${sourceUrl}/Practitioner?category=${category}&name=${name}&zip=${zip}&practiceId=${practiceId}`,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "x-source-id": `${sourceId}`,
          },
        }
      );
      return result?.data?.data?.entry || result?.data?.entry;
    } catch (error) {
      console.log("Error fetching practitioners:", error);
      return null;
    }
  },
};
