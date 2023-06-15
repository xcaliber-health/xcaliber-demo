import { gql } from "@apollo/client";

export const GenerateToken = gql`
  query GenerateToken(
    $token: String
    $versionZero: Boolean
    $managerView: Boolean
    $userId: String
  ) {
    GenerateToken(
      token: $token
      versionZero: $versionZero
      managerView: $managerView
      userId: $userId
    )
  }
`;
