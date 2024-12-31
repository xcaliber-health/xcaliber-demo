import { gql } from "@apollo/client";
export const GetAttributeReferenceData = gql`
  query Query($entityType: String, $attributeId: String) {
    GetAttributeReferenceData(
      entityType: $entityType
      attributeId: $attributeId
    )
  }
`;
