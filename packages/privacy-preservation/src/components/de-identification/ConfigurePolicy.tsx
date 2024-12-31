import { Box, Card, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Stack } from '@mui/material'
import React from 'react'
import { policyData } from './data/policyData'

export default function ConfigurePolicy() {

  return (
    <Card className='p-4'>
        <h3>Tuning Policy</h3>
        <Box sx={{
            padding: '2rem',
        }}>
            <Grid container spacing={25} direction={'row'}>
                <Grid item xs={3}>
                    <h3>Data Elements</h3>
                </Grid>
                <Grid item xs={9}>
                    <h3>De-identification configuration</h3>
                </Grid>
            </Grid>
            <Grid container spacing={6}>
                {policyData.map((policy: { policyName: string; defaultDescription: any; policyDescription: any[] }, index: React.Key | null | undefined) => (
                    <>
                    <Grid item xs={12} key={index} spacing={16}>
                        <Grid container spacing={25} direction={'row'} alignItems={'center'}>
                            <Grid item xs={3}>
                                <h4>{policy.policyName}</h4>
                            </Grid>
                                <Grid item xs={9} direction={'column'}>
                                    <FormControl>
                                        <RadioGroup
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            defaultValue={policy.defaultDescription}
                                            name="radio-buttons-group"
                                        >
                                        {policy.policyDescription.map((description: string, index: any) => (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>
                                            <FormControlLabel value={description} control={<Radio />} label={description} />
                                            </div>
                                        ))}
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                        </Grid>
                    </Grid>
                    </>
                ))}
            </Grid>
        </Box>
    </Card>
  )
}

