import { CareTeamService } from "../../../../../services/careTeamService";
import { PractitionerDetails } from "./CareTeamTab";

export const fetchCareTeam = async (id): Promise<PractitionerDetails[]> => {
  try {
    const response = await CareTeamService.getCareTeamList(id);

    console.log("Raw response:", response);

    const data = response?.[0];

    if (!data) {
      console.warn("No data found in the response.");
      return [];
    }

    const practitioners = data?.contained || [];
    const participants = data?.participant || [];

    if (!participants.length) {
      console.warn("No participants found in the response.");
      return [];
    }

    const transformedData = participants.map((participant: any) => {
      const practitionerId = participant.member?.identifier?.value;

      const practitioner = practitioners.find(
        (pract: any) => pract.id === practitionerId
      );

      return {
        id: practitionerId || "No ID Provided",
        name: practitioner?.name?.[0]?.text || "Unknown",
        role:
          participant.role?.[0]?.coding?.[0]?.display || "No Role Specified",
        address:
          practitioner?.address
            ?.map(
              (addr: any) =>
                `${addr.line?.join(", ")}, ${addr.city}, ${addr.state} ${addr.postalCode}`
            )
            .join("; ") || "No Address",
        phone:
          practitioner?.telecom?.find((tel: any) => tel.system === "phone")
            ?.value || "No Phone",
        fax:
          practitioner?.telecom?.find((tel: any) => tel.system === "fax")
            ?.value || "No Fax",
      };
    });

    return transformedData;
  } catch (error) {
    console.error("Error fetching care team:", error);
    return [];
  }
};
