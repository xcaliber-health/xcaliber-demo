"use client";

import CheckIcon from "@mui/icons-material/Check";
import PatientRecentEvents from "./PatientRecentEvents";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { useState, useEffect } from "react";
import { PatientService } from "../../services/patientService";

function PatientSidebar({ id }: { id: string }) {
  const [patientDetails, setPatientDetails] = useState({ id: id });

  useEffect(() => {
    const getPatientDetails = async () => {
      const response = await PatientService.getPatientById(id);
      setPatientDetails(response);
      // console.log("Patient details", response);
    };

    getPatientDetails();
  }, [id]);

  return (
    <div
      style={{ maxWidth: "24rem", width: "100%" }}
      className="p-6 shadow-md rounded-lg h-full w-[10rem] max-w-[10rem] bg-white overflow-hidden"
    >
      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-4">
        <img
          alt={patientDetails?.name ? patientDetails?.name[0]?.text : "Patient"}
          src="https://s3-alpha-sig.figma.com/img/e0f4/5fcb/04a5be3e74157ed546f35c0cb9e966aa?Expires=1736726400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MUiROkKJs2d2NhcpPiwsU-hmPDvxloLdOvc~VD73vtkTHbbIu0P8dtAAOifPcDmOotyCYC4owt36171p3gDh5lbq~6wTP4NPQ1oOZ2hN-f18fntlI3yXXGxRuDri037nsA2CBP4vPAKUK36P-krkXGwXF0q3IkKoW~aPUSS8jkKJfJ2ByVWBCAj2WfUeZdTxj~~vw21Gub1hB76OnZdAHX4wt3pu-hm1mHPlSRBt-Jzbyj1eS0HWsW5uX3BBclgOs8xlFZ3QXbhAcFpmMWCzX8QJZDE3KeXX0i7tl06JBNC4AjWNZt3c~qfdf0GyZTIpcoRIsDRO173jksI9mKNVQQ__"
          className="w-[100px] h-[100px] rounded-lg mt-4"
        />
        <h2 className="text-lg font-medium mt-2">
          {" "}
          {patientDetails?.name
            ? patientDetails?.name[0]?.text
            : "Patient"}{" "}
        </h2>

        {/* Tags */}
        <div className="flex gap-2 mt-2">
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
        <div className="mt-4 flex gap-4 items-center mb-4">
          <div
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-blue-500"
            style={{ backgroundColor: "#8C57FF29" }}
          >
            <CheckIcon fontSize="medium" />
          </div>
          <div className="flex flex-col">
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
      </div>

      {/* Details Section */}
      <div className="mt-6 space-y-4">
        <h3 className="font-semibold text-lg">Details</h3>
        <Divider className="my-2" />
        <div className="space-y-2">
          <p className="text-md mb-2">
            <strong>Username:</strong> @shallamb
          </p>
          <p className="text-md mb-2">
            <strong>Email:</strong>{" "}
            {patientDetails?.telecom
              ? patientDetails?.telecom[0]?.value
              : "Email not available"}
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
            <strong>Phone #:</strong> +1 (234) 464-0600
          </p>
          <p className="text-md mb-2">
            <strong>Primary Language:</strong> English
          </p>
          <p className="text-md mb-2">
            <strong>Primary State of Residence:</strong>{" "}
            {patientDetails?.address ? patientDetails?.address[0]?.state : ""}
          </p>
        </div>
      </div>

      {/* Events Section */}
      <div style={{ marginTop: "2rem", maxWidth: "24rem", width: "100%" }}>
        <PatientRecentEvents />
      </div>
    </div>
  );
}

export default PatientSidebar;
