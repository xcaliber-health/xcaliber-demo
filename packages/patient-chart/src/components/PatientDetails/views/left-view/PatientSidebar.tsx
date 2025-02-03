"use client";

import CheckIcon from "@mui/icons-material/Check";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { iso6392 } from "iso-639-2";
import { useEffect, useState } from "react";
import { PatientService } from "../../../../services/patientService";
import { editPatient } from "../../../PatientTable/services/service";
import SideDrawer from "../../../ui/SideDrawer";
import PatientRecentEvents from "./PatientRecentEvents";

function PatientSidebar({ id }: { id: string }) {
  const [patientDetails, setPatientDetails] = useState({ id });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editableFields, setEditableFields] = useState({});

  function getLanguageName(languageCode: string): string {
    const languageInfo = iso6392.find(
      (lang) =>
        lang.iso6392B === languageCode ||
        lang.iso6392T === languageCode ||
        lang.iso6391 === languageCode
    );

    return languageInfo ? languageInfo.name : "-";
  }

  useEffect(() => {
    const getPatientDetails = async () => {
      const response = await PatientService.getPatientById(id);
      setPatientDetails(response);

      setEditableFields({
        givenName: response?.name?.[0]?.given?.[0] || "",
        middleName: response?.name?.[0]?.given?.[1] || "",
        familyName: response?.name?.[0]?.family || "",
        dateOfBirth: response?.birthDate || "",
        sex: response?.gender || "",
        address: response?.address?.[0]?.line?.join(", ") || "",
        city: response?.address?.[0]?.city || "",
        state: response?.address?.[0]?.state || "",
        postalCode: response?.address?.[0]?.postalCode || "",
        country: response?.address?.[0]?.country || "USA",
        phone:
          response?.telecom?.find((tele) => tele.system === "phone")?.value ||
          "",
        email:
          response?.telecom?.find((tele) => tele.system === "email")?.value ||
          "",
        primaryLanguage:
          localStorage.getItem("XCALIBER_SOURCE") === "ATHENA"
            ? getLanguageName(
                response?.communication?.[0]?.language?.coding?.[0]?.code
              )
            : response?.communication?.[0]?.language?.text || "",
        emergencyContactName: response?.contact?.[0]?.name?.text || "",
        emergencyContactPhone:
          response?.contact?.[0]?.telecom?.[0]?.value || "",
        emergencyContactRelationship:
          response?.contact?.[0]?.relationship?.[0]?.coding?.[0]?.display || "",
        emergencyContactAddress:
          response?.contact?.[0]?.address?.line?.join(", ") || "",
        notes:
          response?.extension?.find(
            (ext) =>
              ext.url === "http://xcaliber-fhir/structureDefinition/notes"
          )?.valueString || "",
      });
    };

    getPatientDetails();
  }, [id]);

  const handleEditClick = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleSave = async (formData) => {
    try {
      await editPatient(formData, id);
      setPatientDetails({ ...patientDetails, ...formData });
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error saving patient details:", error);
    }
  };

  const formFields = [
    { name: "givenName", label: "Given Name", type: "text" },
    { name: "middleName", label: "Middle Name", type: "text" },
    { name: "familyName", label: "Family Name", type: "text" },
    { name: "dateOfBirth", label: "Date of Birth", type: "date" },
    {
      name: "sex",
      label: "Gender",
      type: "select",
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
      ],
    },
    { name: "address", label: "Address", type: "textarea" },
    { name: "city", label: "City", type: "text" },
    { name: "state", label: "State", type: "text" },
    { name: "postalCode", label: "Postal Code", type: "text" },
    { name: "country", label: "Country", type: "text" },
    { name: "phone", label: "Phone", type: "text" },
    { name: "email", label: "Email", type: "text" },
    { name: "primaryLanguage", label: "Primary Language", type: "text" },
    {
      name: "emergencyContactName",
      label: "Emergency Contact Name",
      type: "text",
    },
    {
      name: "emergencyContactPhone",
      label: "Emergency Contact Phone",
      type: "text",
    },
    {
      name: "emergencyContactRelationship",
      label: "Emergency Contact Relationship",
      type: "text",
    },
    {
      name: "emergencyContactAddress",
      label: "Emergency Contact Address",
      type: "textarea",
    },
    { name: "notes", label: "Notes", type: "textarea" },
  ];
  return (
    <div className="p-6 shadow-md rounded-lg bg-white overflow-hidden w-full max-w-[100%] md:max-w-[24rem] lg:max-w-[24rem]">
      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-4">
        <img
          alt={patientDetails?.name ? patientDetails?.name[0]?.text : "Patient"}
          src="https://s3-alpha-sig.figma.com/img/e0f4/5fcb/04a5be3e74157ed546f35c0cb9e966aa?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YlUDgiQxn~vwBqaIU03Pdzy3dcCAQH0lgHgTBCRdYFfDpz5fgP0iJSU5kM~XyxCow1vZy4E3lNXTGmIpUh0S-LjYVRC~GJVePlJF7tx-neBsG1xvcLzscxMgA2NGxFT0qlYu6gq2AT867CSnpK7YYv5n6mPwm24pDFv-FpVyL2EoPYCzSRjwr2nd2L5IzjSg4G7ovLVhqKpczstVbewjMx-itSJ5sjn0usKw8NdSFr~ALqJUW-5eGJHqjO3zM30S8H2AsrCYE2Ic7pxVYhLWLCXLFJ5OTFNTg0SZR5-fFL10vrMii7mTBqP7xuJ1ggwAYQTFbJoU18vq9YZ74g47pQ__"
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg"
        />
        <h2 className="text-base sm:text-lg font-medium mt-2 text-center">
          {`${patientDetails?.name?.[0]?.given?.[0] || ""} ${
            patientDetails?.name?.[0]?.family || ""
          }`}
        </h2>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <Chip
            label="Type 1 Diabetic"
            size="small"
            sx={{
              backgroundColor: "#FFCDD2",
              color: "#D32F2F",
              fontSize: "0.75rem",
              padding: "2px 8px",
              borderRadius: "12px",
            }}
          />
          <Chip
            label="VIP"
            size="small"
            sx={{
              backgroundColor: "#FFCDD2",
              color: "#D32F2F",
              fontSize: "0.75rem",
              padding: "2px 8px",
              borderRadius: "12px",
            }}
          />
        </div>

        {/* Badges */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 items-center">
          <div
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-blue-500"
            style={{ backgroundColor: "#8C57FF29" }}
          >
            <CheckIcon fontSize="medium" />
          </div>
          <div className="flex flex-col text-center">
            <span className="font-medium">2024</span>
            <span className="text-sm text-gray-500">Annual Visit</span>
          </div>

          <div
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-blue-500"
            style={{ backgroundColor: "#8C57FF29" }}
          >
            <CheckIcon fontSize="medium" />
          </div>
          <span className="font-medium text-sm">Flu Vaccine</span>
        </div>

        {/* Details Section */}
        <div className="mt-6 space-y-4 w-full">
          <h3 className="font-semibold text-lg">Details</h3>
          <Divider className="my-2" />
          <div className="space-y-2">
            <p className="text-md mb-2">
              <strong>Username:</strong> @
              {`${patientDetails?.name?.[0]?.given?.[0] ? `${patientDetails?.name?.[0]?.given?.[0]} ` : ``}  ${patientDetails?.name?.[0]?.family ? patientDetails?.name?.[0]?.family : ``} `}
            </p>
            <p className="text-md mb-2">
              <strong>Email:</strong>{" "}
              {patientDetails?.telecom?.find((tele) => {
                return tele?.system === "email";
              })?.value ?? "-"}
            </p>
            <p className="text-md mb-2">
              <strong>Status:</strong> Active
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-md mb-2">MRN IDs:</p>
            <p className="text-md pl-4">• (logo) athenahealth: awe821</p>
            <p className="text-md pl-4">• (logo) Elation: 132535</p>
            <p className="text-md pl-4">• (logo) Epic: 91038948</p>
          </div>

          <div className="space-y-2">
            <p className="text-md mb-2">
              <strong>Phone #:</strong>{" "}
              {patientDetails?.telecom?.find((tele) => {
                return tele?.system === "phone";
              })?.value ?? "-"}
            </p>
            <p className="text-md mb-2">
              <strong>Primary Language:</strong>{" "}
              {localStorage.getItem(`XCALIBER_SOURCE`) === `ELATION`
                ? patientDetails?.communication?.[0]?.language?.text
                : localStorage.getItem(`XCALIBER_SOURCE`) === `ATHENA`
                  ? getLanguageName(
                      patientDetails?.communication?.[0]?.language?.coding?.[0]
                        ?.code
                    )
                  : `-`}
            </p>
            <p className="text-md mb-2">
              <strong>Primary State of Residence:</strong>{" "}
              {patientDetails?.address ? patientDetails?.address[0]?.state : ""}
            </p>
          </div>
        </div>
        {/* Edit Button */}
        <div className="mt-10 mb-4">
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditClick}
            className="mt-4"
          >
            Edit
          </Button>
        </div>
      </div>
      {/* Events Section */}
      <div className="mt-8">
        <PatientRecentEvents />
      </div>

      {/* SideDrawer Component */}
      <SideDrawer
        title="Edit Patient"
        formFields={formFields}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        onSubmit={handleSave}
        initialData={editableFields}
      />
    </div>
  );
}

export default PatientSidebar;
