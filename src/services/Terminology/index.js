import axios from "axios";
import { TERMINOLOGY_API_ENDPOINT } from "../../core-utils/constants";
import { TERMINOLOGY_TAG_API_ENDPOINT } from "../../core-utils/constants";
export const TerminologyService = {
  getSnomedResultsByTerm: async (term, limit = 60) => {
    try {
      let url = TERMINOLOGY_API_ENDPOINT?.replace("${SEARCH_TERM_VALUE}", term);
      url = url.replace("${LIMIT_VALUE}", limit);
      const response = await axios.get(url);
      return response;
    } catch (error) {
      //Handle Exception
    }
  },
};

export const TerminologyTagService = {
  getSnomedResultsByTermAndTag: async (term, Tags, limit = 60) => {
    try {
      let url = TERMINOLOGY_TAG_API_ENDPOINT?.replace("${SEARCH_TERM_VALUE}", term);
      url = url.replace("${LIMIT_VALUE}", limit);
      url = url.replace("${TAGS}", Tags);
      const response = await axios.get(url);
      return response.data?.items;
    } catch (error) {
      //Handle Exception
    }
  },
};