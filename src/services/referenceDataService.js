import axios from "axios";
import { Helper } from "../core-utils/helper";

export const ReferenceDataService = {
  getReferenceData: async (practiceId, sourceId) => {
    try {
      let sourceUrl = Helper.getSourceUrl();
      const response = await axios.get(
        `${sourceUrl}/ReferenceData?resourceType=servicerequest&category=lab&searchString=b/&practiceId=${practiceId}&limit=100`,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "X-Source-Id": sourceId,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
};
