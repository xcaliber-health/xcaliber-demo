'use client'

// Next Imports

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Stack, Typography } from '@mui/material'
import CardStatVertical from '../card-statistics/Vertical'
// Types Imports

// Styled Component Imports
import AppReactApexCharts from '../../../../styles/AppReactApexCharts'


const KAnonimityBarChart = () => {

  return (
      <Grid container>
        <Grid item xs={12} sm={12} className=''>
          <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
          
          <Stack spacing={6}>
            <Stack spacing={6} direction={'row'}>
              <CardStatVertical
                title='Average k-anonymity'
                stats='5.8'
                avatarIcon='ri-money-dollar-circle-line'
                avatarColor='success'
                trend='positive'
              />
              <CardStatVertical
                title='%  of Records that satisfy k-anonymity threshold '
                stats='87%'
                avatarIcon='ri-bank-card-line'
                avatarColor='info'
                trend='positive'
              />
              <CardStatVertical
                title='Average l-diversity'
                stats='6'
                avatarIcon='ri-money-dollar-circle-line'
                avatarColor='success'
                trendNumber='38%'
                trend='positive'
              />
          </Stack>
          <Card className='p-4'>
            <Typography variant='h4'>Definitions</Typography>
            <ul>
              <li>K-anonymity ensures that each record is indistinguishable from at least k-1 other records with respect to certain identifying attributes. A higher "k" is better.</li>
              <li>L-diversity ensures that sensitive values in each equivalence class (group of records with the same quasi-identifier values) are sufficiently diverse. Higher l-values indicate lower risk.</li>
              <li>T-closeness ensures that the distribution of a sensitive attribute in any equivalence class is close to its distribution in the whole dataset. A lower t-closeness score indicates better privacy protection.</li>
            </ul></Card>
          <Card className='p-4'>
            <AppReactApexCharts 
              type='bar' 
              width='100%' 
              height={300} 
              series={[
                {
                  name: 'K-Anonymity Distribution',
                  data: [50, 100, 200, 275, 300, 225, 100]
                }
              ]}
              options={{
                chart: {
                  type: 'bar',
                  height: 350
                },
                plotOptions: {
                  bar: {
                    columnWidth: '50%'
                  }
                },
                colors: ['#775DD0'],
                dataLabels: {
                  enabled: false
                },
                title: {
                  text: 'K-Anonymity Distribution',
                  align: 'left'
                },
                xaxis: {
                  categories: [2, 3, 4, 5, 6, 7]
                },
                yaxis: {
                  title: {
                    text: 'Frequency'
                  }
                }
              }} 
            />
          </Card>
          <Card className='p-4'>
            <AppReactApexCharts 
              type='bar' 
              width='100%' 
              height={300} 
              series={[
                {
                  name: 'L-Diversity by Attribute',
                  data: [3, 4, 5, 2]
                }
              ]}
              options={{
                chart: {
                  type: 'bar',
                  height: 350
                },
                plotOptions: {
                  bar: {
                    columnWidth: '50%'
                  }
                },
                colors: ['#00E396'],
                dataLabels: {
                  enabled: false
                },
                title: {
                  text: 'L-Diversity by Attribute',
                  align: 'left'
                },
                xaxis: {
                  categories: ['Diagnosis', 'Gender', 'Ethnicity', 'Zip Code']
                },
                yaxis: {
                  title: {
                    text: 'Diversity Level'
                  }
                }
              }} 
            />
          </Card>
          <Card className='p-4'>
            <AppReactApexCharts 
              type='line' 
              width='100%' 
              height={300} 
              series={[
                {
                  name: 'T-Closeness',
                  data: [0.15, 0.2, 0.1] // Replace with the actual values from your chart
                }
              ]}
              options={{
                chart: {
                  type: 'line',
                  height: 350
                },
                stroke: {
                  curve: 'smooth', // For the smooth curve effect
                  width: 2
                },
                markers: {
                  size: 4,
                  colors: ['#FFA500'], // Orange markers, like in the image
                  strokeWidth: 2
                },
                colors: ['#FFA500'], // Matching the orange line color from the image
                dataLabels: {
                  enabled: false
                },
                title: {
                  text: 'T-Closeness by Attribute',
                  align: 'left'
                },
                xaxis: {
                  categories: ['Age', 'Gender', 'Disease'] // X-axis labels
                },
                yaxis: {
                  title: {
                    text: 'T-Closeness'
                  }
                }
              }} 
            />
          </Card>
          </Stack>
          </CardContent>
        </Grid>
      </Grid>
  )
}

export default KAnonimityBarChart
