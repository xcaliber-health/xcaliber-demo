import { gql } from "@apollo/client";

export const GetNotes = gql`
  query Notes($entryId: String!) {
    Notes(entryId: $entryId) {
      id
      entryId
      status
      data
      type
      createdBy
      createdAt
    }
  }
`;
