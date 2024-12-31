import { gql } from "@apollo/client";
export const UpdatePractitioner = gql`
  mutation (
    $request: UpdatePractitionerRequest
  ) {
    UpdatePractitioner(request:$request
    ) {
      id
    }
  }
`;
