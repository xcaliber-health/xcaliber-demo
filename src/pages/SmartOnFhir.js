import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const SmartOnFhir = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const iss = searchParams.get("iss");
  const launchValue = searchParams.get("launch");

  useEffect(() => {
		const launch = async () => {
    await axios
      .get(
        "https://api.preview.platform.athenahealth.com/oauth2/v1/authorize",
        {
          params: {
            client_id: "0oaw7snv22DdD8hP5297",
            response_type: "code",
            redirect_uri: "https://dev-demo.xcaliberhealth.ai/fhir-app",
            scope:
              "launch user/AllergyIntolerance.read user/Appointment.read user/Assessment.read user/Binary.read user/CarePlan.read user/CareTeam.read user/ClinicalImpression.read user/Condition.read user/Device.read user/DiagnosticReport.read user/DocumentReference.read user/Encounter.read user/Goal.read user/Immunization.read user/Location.read user/MedicalAdministration.read user/Medication.read user/MedicationDispense.read user/MedicationOrder.read user/MedicationRequest.read user/MedicationStatement.read user/Observation.read user/Organization.read user/Patient.read user/PracticeConfiguration.read user/Practitioner.read user/Procedure.read user/Provenance.read user/Provider.read",
            aud: iss,
            launch: launchValue,
            state: "12345",
          },
        }
      ) // Update with actual backend URL
      .then((response) => {
				console.log("Received data from authorize ep - ", response.data);
        setData(response.data);
      })
      .catch((error) => setError(error.message));
		};
		launch();
  }, [iss, launchValue]);

  return (
    <div>
      <h1>Smart On FHIR Page</h1>
      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
};

export default SmartOnFhir;
