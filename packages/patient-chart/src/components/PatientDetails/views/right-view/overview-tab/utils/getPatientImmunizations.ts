import { Helper } from "../../../../../../core-utils/helper";
import { ImmunizationService } from "../../../../../../services/immunizationService";
import { ImmunizationProps } from "../ImmunizationDetails";

export const fetchImmunizations = async (id): Promise<ImmunizationProps[]> => {
  const response = await ImmunizationService.getImmunization(id);
  
  const transformedData = response.map((immunization) => {
    let dateObject = Helper.extractFieldsFromDate(
      immunization?.resource?.occurrenceDateTime
    );

    return {
      immunization: immunization?.resource?.vaccineCode?.coding?.[0]?.display,
      status: immunization?.resource?.status || "No status available",
      description: immunization?.resource?.vaccineCode?.text || "-",
      last_updated: Object.values(dateObject).every((dateobj) => {
        return dateobj !== "Invalid Choice" && !Number.isNaN(dateobj);
      })
        ? `${dateObject?.DAY} ${dateObject?.MONTH} ${dateObject?.DATE}`
        : "",
      action: "view/edit",
    };
  });
  return transformedData;
};
