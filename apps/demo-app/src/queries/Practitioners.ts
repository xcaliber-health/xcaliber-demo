import { gql } from "@apollo/client";


export const Practitioners = gql`
  query Practitioner(
    $pageSize: Int
    $pageNumber: Int
    $sortBy: String
    $nameSearch: String
    $provenanceStatus: String
    $provenanceUserType: String
    $filters: [Filter]
  ) {
    Practitioner(
      pageSize: $pageSize
      pageNumber: $pageNumber
      sortBy: $sortBy
      nameSearch: $nameSearch
      provenanceStatus: $provenanceStatus
      provenanceUserType: $provenanceUserType
      filters:$filters
    ) {
      name
    npi
    id
    credentials
    entryId
    email
    phone
    status
    billable
    effectiveDate
    total
    resident
    employedBy
    taxonomy
    multiRoleStatus
    records {
      facility
      role
      speciality
      employed
    } 
    }
  }
`;

export const PractitionerById = gql`
  query PractitionerById($practitionerId: String) {
    PractitionerById(id: $practitionerId) {
      name
      npi
      id
      credentials
      email
      phone
      status
      entryId
      providingFacilities {
        facility
        roles {
          facility
          roleId
          role
          entryId
          speciality
          billable
          employed
          effectiveDate
        }
      }
    }
  }
`;
