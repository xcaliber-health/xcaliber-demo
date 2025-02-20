import { useState, useEffect } from "react";
import LabOrderDetails from "../components/LabOrderDetails";
const FhirApp = (props) => {
  const [code, setCode] = useState(null);
  const [patient, setPatientId] = useState(null);
  const [encounter, setEncounterId] = useState(null);
  const [sourceId, setSourceId] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [practitionerId, setPractitionerId] = useState(null);
  const [practiceId, setPracticeId] = useState(null);
  useEffect(() => {
    setCode(new URLSearchParams(window.location.search).get("code"));
  }, []); // :white_check_mark: Runs exactly once
  useEffect(() => {
    // console.log("Code:", code); // Print code
    // if (code) {
    fetchAccessToken(code);
    // } else {
    //   console.error(":x: Authorization code not found in URL");
    // }
  }, [code]);
  function extractIds(data) {
    return {
      patientId: data.patient.split(".")[1].split("-")[1],
      encounterId: data.encounter?.split(".")[1]?.split("-")[1] || null,
      practiceId: data.ah_practice?.split(".")[1]?.split("-")[1] || null,
      departmentId: data.ah_department?.split(".")[1]?.split("-")[1] || null,
      practitionerId:
        data.fhir_user_reference?.split(".")[1]?.split("-")[1] || null,
      sourceId: "083fe714-e36e-4851-b2e7-a7166b439f67",
    };
  }
  const fetchAccessToken = async (code) => {
    try {
      const CLIENT_ID = "0oaw7snv22DdD8hP5297";
      const REDIRECT_URI = "https://dev-demo.xcaliberhealth.ai/fhir-app";
      const TOKEN_URL =
        "https://api.preview.platform.athenahealth.com/oauth2/v1/token";
      const codeVerifier =
        "M25iVXpKU3puUjFaYWg3T1NDTDQtcW1ROUY5YXlwalNoc0hhakxifmZHag"; // Retrieve stored verifier
      const response = await fetch(TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
          code_verifier: codeVerifier,
        }),
      });
      const data = {
        token_type: "Bearer",
        expires_in: "3600",
        scope:
          "user/Appointment.read user/Assessment.read user/DocumentReference.read user/Medication.read user/CarePlan.read user/Location.read user/Binary.read user/MedicationRequest.read user/Device.read user/Provenance.read user/Condition.read user/Immunization.read user/CareTeam.read user/Organization.read user/Goal.read user/PracticeConfiguration.read user/Provider.read user/Procedure.read user/MedicationOrder.read user/DiagnosticReport.read launch user/MedicationStatement.read user/Practitioner.read user/AllergyIntolerance.read user/MedicationDispense.read user/MedicalAdministration.read user/ClinicalImpression.read user/Observation.read user/Patient.read user/Encounter.read",
        patient: "a-195903.E-4406",
        ah_department: "a-195903.Department-150",
        smart_style_url:
          "https://preview.athenahealth.com/static/smart_on_fhir/smart_stylesheet_v1.json",
        ah_brand: "a-195903.Brand-1",
        ah_csg: "a-195903.CSG-42",
        need_patient_banner: true,
        encounter: "a-195903.encounter-46318",
        ah_practice: "a-1.Practice-195903",
        username: "p-bkumar1",
        fhir_user_reference: "Practitioner/a-195903.User-2568985308",
      };
      const {
        patientId,
        encounterId,
        sourceId,
        departmentId,
        practitionerId,
        practiceId,
      } = extractIds(data);
      setPatientId(patientId);
      setEncounterId(encounterId);
      setDepartmentId(departmentId);
      setSourceId(sourceId);
      setPractitionerId(practitionerId);
      setPracticeId(practiceId);
      console.log("Access Token:", data.access_token); // Print token
      // navigate("/landing"); // Redirect to landing page
    } catch (error) {
      console.error("Error fetching access token", error);
    }
  };
  return (
    <>
      <LabOrderDetails
        patientId={patient}
        encounterId={encounter}
        sourceId={sourceId}
        departmentId={departmentId}
        practitionerId={practitionerId}
        practiceId={practiceId}
      />
    </>
  );
};
export default FhirApp;
