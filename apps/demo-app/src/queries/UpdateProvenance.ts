import { gql } from "@apollo/client";

export const UpdateProvenance = gql`
  mutation UpdateActivityStatus($activityId: String, $status: String) {
    UpdateActivityStatus(activityId: $activityId, status: $status)
  }
`;
