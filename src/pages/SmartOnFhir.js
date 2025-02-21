import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Logo from "../assets/Group.png";

const SmartOnFhir = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const iss = searchParams.get("iss");
  const launchValue = searchParams.get("launch");

  useEffect(() => {
    const launch = async () => {
      setLoading(true);
      const CLIENT_ID = "0oaw7snv22DdD8hP5297";
      const REDIRECT_URI = "https://dev-demo.xcaliberhealth.ai/fhir-app";
      const AUTH_URL = `https://api.preview.platform.athenahealth.com/oauth2/v1/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&response_type=code&scope=launch user/AllergyIntolerance.read user/Appointment.read user/Assessment.read user/Binary.read user/CarePlan.read user/CareTeam.read user/ClinicalImpression.read user/Condition.read user/Device.read user/DiagnosticReport.read user/DocumentReference.read user/Encounter.read user/Goal.read user/Immunization.read user/Location.read user/MedicalAdministration.read user/Medication.read user/MedicationDispense.read user/MedicationOrder.read user/MedicationRequest.read user/MedicationStatement.read user/Observation.read user/Organization.read user/Patient.read user/PracticeConfiguration.read user/Practitioner.read user/Procedure.read user/Provenance.read user/Provider.read&aud=${iss}&launch=${launchValue}&state=12345&code_challenge=qjrzSW9gMiUgpUvqgEPE4_-8swvyCtfOVvg55o5S_es&code_challenge_method=S256`;
      const loginWithAthena = () => {
        window.location.href = AUTH_URL; // Redirect user to Athena login
      };
			loginWithAthena();
    //   await axios
    //     .get(
    //       "https://api.preview.platform.athenahealth.com/oauth2/v1/authorize",
    //       {
    //         withCredentials: true,
    //         params: {
    //           client_id: "0oaw7snv22DdD8hP5297",
    //           response_type: "code",
    //           redirect_uri: "https://dev-demo.xcaliberhealth.ai/fhir-app",
    //           scope:
    //             "launch user/AllergyIntolerance.read user/Appointment.read user/Assessment.read user/Binary.read user/CarePlan.read user/CareTeam.read user/ClinicalImpression.read user/Condition.read user/Device.read user/DiagnosticReport.read user/DocumentReference.read user/Encounter.read user/Goal.read user/Immunization.read user/Location.read user/MedicalAdministration.read user/Medication.read user/MedicationDispense.read user/MedicationOrder.read user/MedicationRequest.read user/MedicationStatement.read user/Observation.read user/Organization.read user/Patient.read user/PracticeConfiguration.read user/Practitioner.read user/Procedure.read user/Provenance.read user/Provider.read",
    //           aud: iss,
    //           launch: launchValue,
    //           state: "12345",
    //         },
    //       }
    //     ) // Update with actual backend URL
    //     .then((response) => {
    //       console.log("Received data from authorize ep - ", response.data);
    //       setData(response.data);
    //     })
    //     .catch((error) => setError(error.message));
    };
    launch();
  }, [iss, launchValue]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75">
        <div className="relative flex flex-col items-center">
          {/* Logo */}
          <img src={Logo} alt="Logo" className="w-14 h-14 mb-4" />

          {/* Circular Loader */}
          <Loader2 className="animate-spin w-24 h-12 text-blue-600" />
        </div>
      </div>
      ) : (
        <>
          <h1>Smart On FHIR Page</h1>
          {error ? (
            <p style={{ color: "red" }}>Error: {error}</p>
          ) : (
            <pre>{JSON.stringify(data, null, 2)}</pre>
          )}
        </>
      )}
    </div>
  );
};

export default SmartOnFhir;
