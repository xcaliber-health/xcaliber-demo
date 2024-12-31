'use client'

import React, { useEffect, useState } from 'react'

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import { Grid } from '@mui/material'

import { getServiceDeskToken } from './getToken'

// import { AppBar } from "./components/molecules/AppBar";

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_SERVICE_DESK_BFF_SERVER
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: process.env.REACT_APP_AUTHORIZATION
    }
  }
})

export const serviceDeskClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

function ServiceDesk() {
  const [managerView, setManagerView] = useState(false)

  useEffect(() => {
    // @ts-ignore
    const xcaliberClient = XcaliberServiceDesk.init({
      theme: {},
      getBearerToken: async () => {
        const token = await getServiceDeskToken(managerView)

        return `Bearer ${token}`
      }
    })

    xcaliberClient.create('GRID_WIDGET_CASES', 'dashboard')
  }, [managerView])

  return (
    <div style={{ backgroundColor: '#F7FDFF' }}>
      {/* <AppBar managerView={managerView} setManagerView={setManagerView} /> */}
      <Grid sx={{ margin: '30px' }} id='dashboard'></Grid>;
    </div>
  )
}

export default ServiceDesk
