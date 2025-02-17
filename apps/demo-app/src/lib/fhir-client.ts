import { EHRType } from '@/utils/constants'
import FHIR from 'fhirclient'
import Client from 'fhirclient/lib/Client'
import axios from 'axios'

export const initializeFHIR = async (launchParams: URLSearchParams, ehrType: EHRType) => {
  try {
    if (ehrType === EHRType.ATHENA) {
      const iss = launchParams.get('iss')?.toString()
      const launchId = launchParams.get('launch')?.toString()
      console.log(launchParams.toString())
      console.log(`${process.env.NEXT_PUBLIC_AUTHORIZE_URL}`);

      const response = await axios.get(`${process.env.NEXT_PUBLIC_AUTHORIZE_URL}`, {
        params: {
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
          response_type: 'code',
          scope:
            'openid fhirUser  user/AllergyIntolerance.read user/Appointment.read user/Assessment.read user/Binary.read user/CarePlan.read user/CareTeam.read user/ClinicalImpression.read user/Condition.read user/Device.read user/DiagnosticReport.read user/DocumentReference.read user/Encounter.read user/Goal.read user/Immunization.read user/Location.read user/MedicalAdministration.read user/Medication.read user/MedicationDispense.read user/MedicationOrder.read user/MedicationRequest.read user/MedicationStatement.read user/Observation.read user/Organization.read user/Patient.read user/PracticeConfiguration.read user/Practitioner.read user/Procedure.read user/Provenance.read user/Provider.read',
          launch: launchId,
          aud: iss,
          redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
          state: '1234'
        }
      })

      console.log(response)
      return response.data

      //   clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      //   scope:
      //     "openid fhirUser  user/AllergyIntolerance.read user/Appointment.read user/Assessment.read user/Binary.read user/CarePlan.read user/CareTeam.read user/ClinicalImpression.read user/Condition.read user/Device.read user/DiagnosticReport.read user/DocumentReference.read user/Encounter.read user/Goal.read user/Immunization.read user/Location.read user/MedicalAdministration.read user/Medication.read user/MedicationDispense.read user/MedicationOrder.read user/MedicationRequest.read user/MedicationStatement.read user/Observation.read user/Organization.read user/Patient.read user/PracticeConfiguration.read user/Practitioner.read user/Procedure.read user/Provenance.read user/Provider.read",
      //   redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI,
      //   iss: iss,
      //   launch: launchId,
      //   completeInTarget: true,
      // });
    } else {
      return new Error('Error: Unsupported EHR Type')
    }
  } catch (error) {
    console.error('Failed to authorize FHIR:', error)
    throw error
  }
}

export const getFHIRClient = async (): Promise<Client> => {
  return await FHIR.oauth2.ready()
}

export const getPatient = async (client: Client) => {
  return await client.request(`Patient/${process.env.NEXT_PUBLIC_PATIENT_ID}`)
}
