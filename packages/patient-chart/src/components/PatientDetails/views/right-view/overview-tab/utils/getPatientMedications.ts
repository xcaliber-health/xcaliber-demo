import { Helper } from "../../../../../../core-utils/helper";
import { MedicationService } from "../../../../../../services/medicationService";
import { MedicationProps } from "../medications/MedicationsDetails";

export const fetchMedications = async (id): Promise<MedicationProps[]> => {
  const response = await MedicationService.getMedications(id);
  const transformedData = response.map((medication) => {
    let dateObject = Helper.extractFieldsFromDate(
      medication?.resource?.effectivePeriod?.start
    );

    return {
      id: medication?.resource?.id,
      medication:
        medication?.resource?.medicationCodeableConcept?.coding?.[0]?.display,
      status: medication?.resource?.status || medication?.resource?.statusReason?.[0].coding?.[0].display || "No status available",
      description: "-",
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
