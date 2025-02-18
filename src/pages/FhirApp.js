import { use, useEffect } from "react";
import { useState } from "react";

const FhirApp = () => {
    const [code, setCode] = useState(null);

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

    const fetchAccessToken = async (code) => {
        try {
            const CLIENT_ID = "0oaw7snv22DdD8hP5297";
            const REDIRECT_URI = "https://dev-demo.xcaliberhealth.ai/fhir-app";
            const TOKEN_URL = "https://api.preview.platform.athenahealth.com/oauth2/v1/authorize";
            const codeVerifier = "M25iVXpKU3puUjFaYWg3T1NDTDQtcW1ROUY5YXlwalNoc0hhakxifmZHag"; // Retrieve stored verifier
            const response = await fetch(TOKEN_URL, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    grant_type: "authorization_code",
                    code,
                    redirect_uri: REDIRECT_URI,
                    client_id: CLIENT_ID,
                    code_verifier: codeVerifier
                }),
            });

            const data = await response.json();
            console.log("Access Token:", data.access_token); // Print token
            // navigate("/landing"); // Redirect to landing page
        } catch (error) {
            console.error("Error fetching access token", error);
        }
    };
  return <h1>FHIR App</h1>;
};

export default FhirApp;
