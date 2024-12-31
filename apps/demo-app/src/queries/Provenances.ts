import { gql } from "@apollo/client";
export const GetProvenances = gql`
  query ($entryId: String, $status:String) {
    Provenances(entryId: $entryId, status:$status) {
      id
      dataField
      currentValue
      previousValue
      status
      createdAt
      createdBy
      context {
        facility
        roleId
      }
      updatedBy
    }
  }
`;

