
import { fhirFetch } from "./fhir";

// Fetch all questionnaire responses
export async function fetchQuestionnaireResponses(patientId, departmentId, sourceId, setLatestCurl, category = "medical-history") {
  if (!patientId || !departmentId || !sourceId) throw new Error("Missing required parameters");

  const url = `/QuestionnaireResponse?patient=${patientId}&departmentId=${departmentId}&category=${category}`;
  const bundle = await fhirFetch(url, { sourceId, headers: { "x-interaction-mode": "false" }, setLatestCurl });
  return bundle.entry?.map((e) => e.resource) || [];
}

// Map response to table row
export function mapQuestionnaireRow(res) {
  const row = [];

  // History Type / Category
  const historyType = res.extension?.find(ext => ext.url === "http://xcaliber-fhir/structureDefinition/category")?.valueString;
  row.push(historyType || "-");

  // Status
  row.push(res.status || "-");

  // Authored / Last Updated
  const authored = res.meta?.lastUpdated ? new Date(res.meta.lastUpdated).toLocaleDateString() : "-";
  row.push(authored);

  // First Question Text & Answer
  if (res.item?.length > 0) {
    const question = res.item[0];
    const answer = question.answer?.[0]?.valueString || "-";
    row.push(`${question.text}: ${answer}`);
  } else {
    row.push("-");
  }

  // Last Modified By
  const modifiedBy = res.item?.[0]?.extension?.find(ext => ext.url === "http://xcaliber-fhir/structureDefinition/last-modified-by")?.valueString || "-";
  row.push(modifiedBy);

  return row;
}

// Create a new QuestionnaireResponse
export async function createQuestionnaireResponse({ patientId, departmentId, sourceId, authored, answerValue, userId, category = "social-history", questionnaireId = "Questionnaire/190" }, setLatestCurl) {
  if (!patientId || !departmentId || !sourceId) throw new Error("Missing required parameters");

  const body = {
    resourceType: "QuestionnaireResponse",
    subject: { reference: `Patient/${patientId}` },
    questionnaire: questionnaireId,
    authored,
    item: [
      {
        linkId: "ADVANCEDIRECTIVE",
        text: "Do you have an advance directive?",
        answer: [{ valueString: answerValue }],
        extension: [
          { url: "http://xcaliber-fhir/structureDefinition/last-updated-by", valueString: userId }
        ]
      }
    ],
    extension: [
      { url: "http://xcaliber-fhir/structureDefinition/category", valueString: category },
      { url: "http://xcaliber-fhir/structureDefinition/department-id", valueString: `${departmentId}` }
    ]
  };

  return fhirFetch(`/QuestionnaireResponse`, {
    method: "POST",
    sourceId,
    body,
    headers: { "Content-Type": "application/fhir+json" },
    setLatestCurl
  });
}
