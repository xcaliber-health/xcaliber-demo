import { gql } from "@apollo/client";

export const patientsQuery = gql`
  query {
    Patient {
      id
      messageType
      MRN
      HAR
      visitId
      patientClass
      name
      hospitalService
      facility
      unit
      admitDate
      dischargeDate
      dischargeDisposition
      admittingDoctorName
      attendingDoctorName
      consultingDoctorName
    }
  }
`;

export const exportQuery = gql`
  query Export($startDate: String, $endDate: String) {
    Export(startDate: $startDate, endDate: $endDate) {
      requestId
    }
  }
`;

export const requestQuery = gql`
  query Request($requestId: String) {
    Request(requestId: $requestId) {
      status
      s3Url
    }
  }
`;
