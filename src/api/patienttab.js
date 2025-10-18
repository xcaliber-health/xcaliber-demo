import { useContext, useMemo } from "react";
import { AppContext } from "../layouts/DashboardLayout";
import { cachedFhirFetch } from "../api/cachedFhirFetch";

const ELATION_SOURCE_ID = import.meta.env.VITE_SOURCE_ID_ELATION;

export const usePatientTabs = () => {
  const { departmentId, sourceId } = useContext(AppContext);

  // Helper function for cached fetch
  const fetchWithCache = async (url, options = {}, ttl = 5 * 60 * 1000) => {
    return cachedFhirFetch(url, { method: "GET", ...options }, ttl);
  };

  return useMemo(
    () => ({
      vitals: {
        label: "Vitals",
      },

      allergies: {
        label: "Allergies",
      },

      diagnosticReports: {
        label: "Diagnostic Reports",
        headers: ["Report", "Status", "Date"],
        url: (patientId, category = "lab-result") =>
          `/DiagnosticReport?patient=${patientId}&departmentId=${departmentId}&category=${category}`,
        headersConfig: { "x-interaction-mode": "false" },
        mapRow: (res) => {
          const report = res.code?.text || res.code?.coding?.[0]?.display;
          const status = res.status;
          const date = res.effectiveDateTime
            ? new Date(res.effectiveDateTime).toLocaleDateString()
            : null;
          return [report, status, date].filter(Boolean);
        },
        categoryOptions: ["imaging-result", "lab-result"],
        fetch: fetchWithCache, 
      },

      serviceRequests: {
        label: "Orders",
        headers: ["Type", "Code", "Status", "Priority", "Date"],
        url: (id) =>
          sourceId === ELATION_SOURCE_ID
            ? `/ServiceRequest?category=108252007&patient=${id}`
            : `/ServiceRequest?patient=${id}&category=108252007&encounter=Encounter/44602`,
        headersConfig: { "x-interaction-mode": "false" },
        mapRow: (res) => [
          res.category?.[0]?.coding?.[0]?.display || "N/A",
          res.category?.[1]?.coding?.[0]?.code || "N/A",
          res.status || "N/A",
          res.priority || "N/A",
          res.authoredOn || "N/A",
        ].filter(Boolean),
        fetch: fetchWithCache,
      },

      documents: {
        label: "Documents",
      },

      encounters: {
        label: "Encounters",
      },

      conditions: {
        label: "Conditions",
      },

      tasks: {
        label: "Tasks",
        headers: ["Description", "Status", "Intent"],
        url: (id) => `/Task?practitioner=112&_count=1000`,
        headersConfig: { "x-interaction-mode": "true" },
        mapRow: (res) => [
          res.description || res.code?.coding?.[0]?.display,
          res.status,
          res.intent,
        ].filter(Boolean),
        fetch: fetchWithCache,
      },

      familyHistory: {
        label: "Family History",
      },

      questionnaireResponses: {
        label: "Questionnaire Responses",
        fetch: fetchWithCache,
      },

      procedures: {
        label: "Procedures",
        fetch: fetchWithCache,
      },

      basics: {
        label: "Basic Records",
        headers: ["Code", "Last Updated"],
        url: (patientId, code) =>
          `/Basic?departmentId=${departmentId}${code ? `&code=${code}` : ""}`,
        headersConfig: { "x-interaction-mode": "true" },
        mapRow: (res) => {
          const resource = res.resource || res;
          return [
            resource.code?.text || null,
            resource.meta?.lastUpdated
              ? new Date(resource.meta.lastUpdated).toLocaleDateString()
              : null,
          ].filter(Boolean);
        },
        codeOptions: ["risk-contract"],
        fetch: fetchWithCache,
      },
    }),
    [departmentId, sourceId]
  );
};
