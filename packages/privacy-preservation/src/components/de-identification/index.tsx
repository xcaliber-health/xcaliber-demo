'use client'

import React, { useEffect, useState } from 'react'

import {Box, Card, Grid, Tab, Tabs } from '@mui/material'

import DeIDGrid from './DeIDGrid';
import type { FilesType } from '@/types/userTypes';
import SQLDataProduct from './SQLDataProduct';
import type { SQLDataProductType } from '@/types/tableTypes';
import ConfigurePolicy from './ConfigurePolicy';
import DeIDDashboard from './dashboard/DeIDDashboard';

function CustomTabPanel(props:any) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        style={{
          height: "95%",
          backgroundImage: 'url(/images/tab-bg.png)',
        }}
        {...other}
      >
        {value === index && <Box sx={{height: "100%" }}>{children}</Box>}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

export default function DeIdentification() {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

    const [token, setToken] = useState('');

    const filesList: FilesType[] = [
      {
        id: 4723,
        type: 'HL7',
        name: 'P91XQW4R_ADT',
        description: 'Patient Information record',
        lastUpdated: '2024-10-15',
      },
      {
        id: 4723,
        type: 'HL7',
        name: 'QPZ9AUJW_ADT',
        description: 'Patient Information record',
        lastUpdated: '2024-10-14',
      },
      {
        id: 5312,
        type: 'HL7',
        name: 'QM22MQIR_ADT',
        description: 'Patient Information record',
        lastUpdated: '2024-10-11',
      },
      {
        id: 8728,
        type: 'FHIR',
        name: '9836e139-1b1e-48d8-b6ff-7fa78cbe599c',
        description: 'General Patient Example',
        lastUpdated: '2024-10-17',
      },
      {
        id: 9835,
        type: 'HL7',
        name: 'Z7D0RPDJ_DFT',
        description: 'Financial Transaction record for an outpatient visit with Influenza',
        lastUpdated: '2024-10-10',
      },
      {
        id: 6352,
        type: 'HL7',
        name: 'YH47L023_DFT',
        description: 'Financial Transaction record for an outpatient visit with Influenza',
        lastUpdated: '2024-10-09',
      },
      {
        id: 8434,
        type: 'HL7',
        name: 'Y1FXUGKN_DFT',
        description: 'Financial Transaction record for an outpatient visit',
        lastUpdated: '2024-10-08',
      },
      {
        id: 9721,
        type: 'FHIR',
        name: '433e46ee-7c2b-4ea7-8c1a-57a0a0646461',
        description: 'General Patient Example',
        lastUpdated: '2024-10-17',
      },
      {
        id: 1437,
        type: 'HL7',
        name: 'W9QJTMZC_MDM',
        description: 'Progress Note',
        lastUpdated: '2024-10-05',
      },
      {
        id: 5535,
        type: 'FHIR',
        name: '090db00d-85e8-4a47-a498-5b9da6dbd142',
        description: 'Deceased patient',
        lastUpdated: '2024-10-17',
      },
      {
        id: 3633,
        type: 'HL7',
        name: '5YNHXCC5_MDM',
        description: 'Progress Note',
        lastUpdated: '2024-10-04',
      },
      {
        id: 6545,
        type: 'HL7',
        name: 'I3YI44PQ_MDM',
        description: 'Progress Note',
        lastUpdated: '2024-10-03',
      },
      {
        id: 2322,
        type: 'FHIR',
        name: 'a82586ef-8665-461f-a077-452a8b111f9b',
        description: 'Deceased patient',
        lastUpdated: '2024-10-17',
      }
    ];

    const db: SQLDataProductType[] = [
      {
        id: 'documents',
        title: 'Documents',
        icon: 'ri-bank-card-line',
        subtitle: 'Patient documents table',
      },
    
      // delivery
      {
        id: 'interactions',
        title: 'Interactions',
        icon: 'ri-settings-4-line',
        subtitle: 'Interactions table',
      },
    
      // cancellation and return
      {
        icon: 'ri-refresh-line',
        id: 'encounters',
        title: 'Encounters',
        subtitle: 'Encounters table',
      },
    
      // my orders
      {
        id: 'document_providers',
        title: 'Document Providers',
        icon: 'ri-inbox-archive-line',
        subtitle: 'Document Providers table',
      },
    ]
    
    //Fetch token and set it in the state variable on component mount
    useEffect(() => {
      fetch("https://sandbox.xcaliberapis.com/public-sandbox/management/api/v1/auth/tokenV2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `ApiKey U2FsdGVkX1+cypGVnv+qapmvf3vJ0n10v0gcmBQDeMSbcqlZZOQAzNEnFuXw0PK3XTG8nM7HXtPJV0CE52zdQ255+sdfaBav1ceeicuKNsUQJZg7XxeZZKJ02uc2J5t8cgoE5Qxi3sTHmtSDROEhwdTOwV3P7QckhVLsqNPDrq+h18NSC4kV7CVljYFsWYhdqgGPKOb6IJCGCvLnmhzqUKE5SMrImU1ok3JeYwYjjfDLK5RMlszbnJuTnzKCmkrLlK42wTh8hudi72zxR4O665nxO3RXfU30mTzErHCIu0OHAVWK8u/5568AB0XfwE/f90YvSqubPBnVRrPwVDX1eZfXsGAJUmDR6gFE/5dHPBjLFcJsQBoeFyoIGAM63T7IXa2wNT684X7dXVMvDbZGwQ==`,
        },
        body: JSON.stringify({
          "user": {
              "userId": "1",
              "userName": "Xcaliber User"
          },
          "grantType": "client_credentials",
          "claims": [
              "models:*",
              "activities:*",
              "Activities:*",
              "tags:*",
              "attributes:*",
              "entities:*",
              "provider.entries:*",
              "patient.entries:*",
              "provider-total.entries:*",
              "Cases.entries:*",
              "Profile.entries:*",
              "User.entries:*",
              "Role.entries:*",
              "view.entries:*",
              "Coder.entries",
              "orch_events.entries:*",
              "userviews.entries:*",
              "View.entries:*",
              "worker.entries:*",
              "role.entries:*",
              "workitem.entries:*",
              "permission_policy.entries:*",
              "collection.entries:*",
              "filter.entries:*",
              "orchestration_workflow_statistics.entries:*",
              "orchestration_event.entries:*",
              "workflow.entries:*",
                "orchestration_workflow.entries:*"
          ]
      }),
      })
        .then((response) => response.json())
        .then((data) => {
          setToken(data.token);
        });
    }, []);

  return (
    <Grid container direction="row" height="100%">
        <Grid item xs={12}>
          <Box sx={{ width: '100%', height: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 64, zIndex: 11, backgroundColor: 'white' }}>
                  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Dashboards" {...a11yProps(0)} />
                  <Tab label="Synthetic Data" {...a11yProps(1)} />
                  <Tab label="Patient Documentation" {...a11yProps(2)} />
                  <Tab label="Data Products" {...a11yProps(3)} />
                  <Tab label="Tuning" {...a11yProps(4)} />
                  </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <div style={{
                  padding: "1rem",
                }}>
                  <DeIDDashboard />
                </div>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <div style={{
                  padding: "1rem",
                }}>
                  <DeIDGrid filesData={filesList} token={token} />
                </div>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <Card sx={{
                  margin: "1rem",
                  display: "flex",
                  height: "50rem"
                }}>
                  <iframe src="https://merlin-blitz.xcaliberapis.com/" style={{ flex: 1, border: "none" }} />
                </Card>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={3}>
              <div style={{
                  padding: "1rem"
                }}>
                  <SQLDataProduct TablesData={db} token={token} />
                </div>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={4}>
                <div className='h-full p-4'>
                  <ConfigurePolicy />
                </div>
              </CustomTabPanel>
          </Box>
        </Grid>
    </Grid>
  )
}
