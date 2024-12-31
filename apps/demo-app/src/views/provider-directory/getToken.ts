'use client'

import { GenerateToken } from '@/queries/Token'
import { GenerateServiceDeskToken } from '@/queries/ServiceDeskToken'
import { serviceDeskClient } from './ServiceDesk'
import { client } from '.'

export const getToken = async (managerView: boolean, userId: string) => {
  try {
    const res = client
      .query({
        query: GenerateToken,
        variables: {
          token:
          process.env.NEXT_PUBLIC_APP_AUTHORIZATION,
          managerView,
          userId: userId
        },
        fetchPolicy: 'no-cache'
      })
      .then((response: any) => {
        return response?.data?.GenerateToken?.token
      })
      .catch((error: any) => {
        console.log(error?.message)
      })

    return res
  } catch (e: any) {
    console.error(e.message)
  }
}

export const getServiceDeskToken = async (managerView?: boolean) => {
  try {
    const res = serviceDeskClient
      .query({
        query: GenerateServiceDeskToken,
        variables: {
          token: process.env.SERVICE_DESK_AUTH_TOKEN,
          managerView,
          userId: managerView ? process.env.MANAGER_ID : process.env.CODER_ID
        },
        fetchPolicy: 'no-cache'
      })
      .then((response: any) => {
        return response?.data?.GenerateToken?.token
      })
      .catch((error: any) => {
        console.log(error?.message)
      })

    return res
  } catch (e: any) {
    console.error(e.message)
  }
}
