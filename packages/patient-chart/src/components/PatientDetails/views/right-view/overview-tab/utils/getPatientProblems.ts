import { ProblemService } from "../../../../../../services/problemService.js";
import { ProblemProps } from "../problems/ProblemDetails.js";
import { Helper } from "../../../../../../core-utils/helper";

export const fetchProblems = async (id): Promise<ProblemProps[]> => {
  const response = await ProblemService.getProblems(id);
  const transformedData = response?.map((problem) => {
    const dateObject = Helper.extractFieldsFromDate(
      problem?.resource?.onsetDateTime
    );
    return {
      id: problem?.resource?.id,
      problem:
        problem?.resource?.text?.div ||
        problem?.resource?.code?.text ||
        problem?.resource?.code?.coding?.[0]?.display ||
        "",
      status:
        localStorage.getItem("XCALIBER_SOURCE") === "ELATION" ||
        localStorage.getItem("XCALIBER_SOURCE") === "ECW"
          ? problem?.resource?.clinicalStatus?.coding?.[0]?.display &&
            problem?.resource?.clinicalStatus?.coding?.[0]?.display !== null
            ? problem?.resource?.clinicalStatus?.coding?.[0]?.display
            : "-"
          : localStorage.getItem(`XCALIBER_SOURCE`) === "ATHENA"
            ? problem?.resource?.extension?.[2]?.valueString &&
              problem?.resource?.extension?.[2]?.valueString !== null
              ? problem?.resource?.extension?.[2]?.valueString
              : "-"
            : "-",
      description:
        localStorage.getItem("XCALIBER_SOURCE") === "ELATION" ||
        localStorage.getItem("XCALIBER_SOURCE") === "ECW"
          ? problem?.resource?.note?.[0]?.text &&
            problem?.resource?.note?.[0]?.text !== null
            ? problem?.resource?.note?.[0]?.text
            : "-"
          : localStorage.getItem(`XCALIBER_SOURCE`) === "ATHENA"
            ? problem?.resource?.contained?.[0]?.notes?.text &&
              problem?.resource?.contained?.[0]?.notes?.text !== null
              ? problem?.resource?.contained?.[0]?.notes?.text
              : "-"
            : "-",
      last_updated: `${dateObject?.DAY}, ${dateObject?.MONTH} ${dateObject?.DATE} ${dateObject?.YEAR}`,
      action: "view/edit",
    };
  });

  return transformedData;
};
