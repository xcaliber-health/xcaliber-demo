import { Helper } from "../../../../../../core-utils/helper";
import { AllergyService } from "../../../../../../services/allergyService";
import { AllergyProps } from "../AllergiesDetails";

export const fetchAllergies = async (id): Promise<AllergyProps[]> => {
  const response = await AllergyService.getAllergies(id);
  const transformedData = response.map((allergy) => {
    const dateObject = Helper.extractFieldsFromDate(
      allergy?.resource?.onsetDateTime
    );

    const isValidDate = Object.values(dateObject).every(
      (dateObj) =>
        dateObj !== "Invalid Choice" &&
        !Number.isNaN(Number(dateObj)) &&
        dateObj !== ""
    );

    return {
      allergy: allergy?.resource?.code?.coding?.[0]?.display || "Unknown",
      status:
        allergy?.resource?.clinicalStatus?.coding?.[0]?.display || "ACTIVE",
      description:
        allergy?.resource?.note?.[0]?.text || "No description available",
      last_updated: isValidDate
        ? `${dateObject?.DAY} ${dateObject?.MONTH} ${dateObject?.DATE}, ${dateObject?.YEAR}`
        : "Unknown Date",
      action: "view/edit",
    };
  });

  return transformedData;
};
