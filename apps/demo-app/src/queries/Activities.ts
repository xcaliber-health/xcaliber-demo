import { gql } from "@apollo/client";
export const UpdateEntry = gql`
  mutation Mutation($entryId: String, $directoryType: String, $body: JSON) {
    CreateActivities(
      entryId: $entryId
      directoryType: $directoryType
      body: $body
    )
  }
`;
export const UpdateActivityStatus = gql`
  mutation UpdateActivityStatus(
    $entryId: String
    $directoryType: String
    $status: String
  ) {
    UpdateActivityStatus(
      entryId: $entryId
      directoryType: $directoryType
      status: $status
    )
  }
`;

export const ActivitiesByEntryId = gql`
  mutation ActivitiesByEntryId($entryId: String, $directoryType: String) {
    ActivitiesByEntryId(entryId: $entryId, directoryType: $directoryType)
  }
`;
