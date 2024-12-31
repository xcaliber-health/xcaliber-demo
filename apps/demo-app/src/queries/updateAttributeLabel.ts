import { gql } from "@apollo/client";
export const UpdateColumnName = gql`
  mutation UpdateAttributeLabel(
    $AttributeId: String
    $request: UpdateAttributeLabelRequest!
  ) {
    UpdateAttributeLabel(id: $AttributeId, request: $request) {
      id
      label
    }
  }
`;
