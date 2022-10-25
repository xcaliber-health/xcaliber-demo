export const APP_MESSAGES = {
  TYPING_HEADING: "Type at least 3 characters , example - ten , fra ",
  NO_RESULTS: "No Results",
};
export const TERMINOLOGY_API_ENDPOINT =
  "https://browser.ihtsdotools.org/snowstorm/snomed-ct/browser/MAIN/SNOMEDCT-US/2022-09-01/descriptions?&limit=${LIMIT_VALUE}&term=${SEARCH_TERM_VALUE}&active=true&conceptActive=true&lang=english&groupByConcept=true";

export const TERMINOLOGY_TAG_API_ENDPOINT = "https://browser.ihtsdotools.org/snowstorm/snomed-ct/browser/MAIN/SNOMEDCT-US/2022-09-01/descriptions?&limit=${LIMIT_VALUE}&term=${SEARCH_TERM_VALUE}&semanticTags=${TAGS}&active=true&conceptActive=true&lang=english&groupByConcept=true"
export const LENS_API_ENDPOINT = `https://lens-blitz.xcaliberapis.com`;
export const XCHANGE_SERVICE_ENDPOINT = `https://xchange-blitz.xcaliberapis.com`;
export const BUTTON_LABELS = {
  RUN: "Run",
  EDIT_PROFILE: "Edit Profile",
  UPCOMING_APPOINTMENTS: "Upcoming Appointments",
  VITALS: "Vitals",
  ALLERGIES: "Allergies",
  PROBLEMS: "Problems",
  IMMUNIZATIONS: "Immunizations",
  MEDICATIONS: "Medications",
};
export const tags = [
  'administration method',
  'assessment scale',
  'attribute',
  'body structure',
  'cell',
  'clinical drug',
  'disorder',
  'disposition',
  'event',
  'finding',
  'medicinal product',
  'medicinal product form',
  'morphologic abnormality',
  'navigational concept',
  'observable entity',
  'organism',
  'physical object',
  'procedure',
  'product',
  'qualifier value',
  'regime/therapy',
  'release characteristic',
  'role',
  'situation',
  'specimen',
  'substance'
]


