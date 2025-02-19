import { useState, useEffect } from "react";
import LabOrderDetails from "../components/LabOrderDetails";

const FhirApp = (props) => {
  const [code, setCode] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [encounterId, setEncounterId] = useState(null);

  useEffect(() => {
    setCode(new URLSearchParams(window.location.search).get("code"));
  }, []); // ✅ Runs exactly once

  useEffect(() => {
    console.log("Code:", code); // Print code
    if (code) {
      fetchAccessToken(code);
    } else {
      console.error("❌ Authorization code not found in URL");
    }
  }, [code]);

  function extractIds(data) {
    return {
      patientId: data.patient.split(".")[1].split("-")[1],
      encounterId: data.encounter.split(".")[1].split("-")[1],
    };
  }

  const fetchAccessToken = async (code) => {
    try {
      const CLIENT_ID = "0oaw7snv22DdD8hP5297";
      const REDIRECT_URI = "https://dev-demo.xcaliberhealth.ai/fhir-app";
      const TOKEN_URL = "https://api.preview.platform.athenahealth.com/oauth2/v1/token";
      const codeVerifier = "M25iVXpKU3puUjFaYWg3T1NDTDQtcW1ROUY5YXlwalNoc0hhakxifmZHag"; // Retrieve stored verifier
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

      const data = await response.json();
      const extractedIds = extractIds(data);
      setPatientId(extractedIds.patientId);
      setEncounterId(extractedIds.encounterId);
      console.log("Access Token:", data.access_token); // Print token
      console.log("first", extractedIds);
      // navigate("/landing"); // Redirect to landing page
    } catch (error) {
      console.error("Error fetching access token", error);
    }
  };

  return (
    <>
      <LabOrderDetails patientId={patientId} encounterId={encounterId} />
    </>
  );
};

export default FhirApp;
