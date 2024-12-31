import { gql } from "@apollo/client";
export const GetReferenceDataFields = gql`
 query($fieldName: String!){
  PractitionerReferenceData(fieldName: $fieldName)
}
`;

