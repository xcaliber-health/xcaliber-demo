'use client'

import React, { useEffect, useState } from 'react'

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import { Box, Grid, Switch, TextField, Typography } from '@mui/material'

import { useSession } from 'next-auth/react'

import { getToken } from './getToken'

// import { AppBar } from './components/molecules/AppBar'

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_APP_BFF_SERVER
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: process.env.NEXT_PUBLIC_APP_AUTHORIZATION
    }
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

function ProviderDirectory() {
  const [managerView, setManagerView] = useState(false)
  const [sdkVersion, setSdkVersion] = useState('1.5.6')
  const [inputSdkVersion, setInputSdkVersion] = useState(sdkVersion)

  const { data: session }:any = useSession()

  useEffect(() => {
    const initializeXcaliberClient = async () => {


      // Wait for the script to load
      await new Promise((resolve) => {
        const script = document.createElement('script');

        script.src = `https://d1sjplihcrz2zo.cloudfront.net/sdk/${sdkVersion}/main.js`;
        script.type = 'text/javascript';
        script.onload = resolve;
        document.head.appendChild(script);
      });

      // @ts-ignore
      const xcaliberClient = XcaliberWidgets.init({
        theme: {},
        getBearerToken: async () => {
          const token = await getToken(managerView, managerView ? `${session?.providerAccountId}0` : `${session?.providerAccountId}`);

          return `Bearer ${token}`;
        },
      });

      xcaliberClient.create('GRID_WIDGET', 'dashboard');
    };

    initializeXcaliberClient();
  }, [managerView, sdkVersion, session]);

  return (
    <>
    <Box className={'flex items-center justify-between'}>
      <Box className={'flex items-center'}>
        <Typography className='font-medium' color={"black"}>
          SDK Version
        </Typography>
        <TextField onChange={(e)=>{
          setInputSdkVersion(e.target.value)
        }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            setSdkVersion(inputSdkVersion)
          }
        }}
        value={inputSdkVersion}
        sx={{
          width: '50px',
          marginLeft: '10px',
          "& .MuiInputBase-input": {
            padding: '5px',
            paddingBlock: '0px !important',
          },
        }}
        />
      </Box>
      <Box className={'flex items-center'}>
        <Typography className='font-medium' color={"black"}>
          {managerView ? 'Mel View' : 'Cathy View'}
        </Typography>
        <Switch
          size='medium'
          checked={managerView}
          color='default'
          onChange={() => {
            setManagerView(!managerView)
          }}
          />
        </Box>
    </Box>
      {/* <Box sx={{ height: '64px' }}><AppBar managerView={managerView} setManagerView={setManagerView} /></Box> */}
      <Grid sx={{ height: 'calc(100vh - 115px)' }} id='dashboard'></Grid>
    </>
  )
}

export default ProviderDirectory
