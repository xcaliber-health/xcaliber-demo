'use client'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { LinearProgress, Stack, Typography } from '@mui/material'
// Types Imports

// Styled Component Imports
import AppReactApexCharts from '../../../../styles/AppReactApexCharts'


const ProfitStackedBar = () => {

  return (
      <Grid container>
        <Grid item xs={12} sm={12} className=''>
          <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
          <Stack spacing={6}>
          <Card className='relative overflow-visible sm:mt-6 md:mt-0'>
            <CardContent className='!pbe-0 sm:!pbe-5'>
              <Grid container spacing={8}>
                <Grid item xs={12} sm={12}>
                  <Stack spacing={2}>
                  <Typography variant='h5' className=''>
                    Overall De-identification Success Rate
                  </Typography>
                  <LinearProgress variant='determinate' value={99.78} className='!rounded-0' />
                  <div style={{
                    margin: 'auto',
                    textAlign: 'center',
                  }}>
                  <h4>99.78%</h4>
                  </div>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card className='p-4'>
            <AppReactApexCharts 
                type='bar'
                width='100%' 
                height={292} 
                series={[
                  {
                    name: 'Orignal Records',
                    data: [1000, 1000, 1000, 1000, 1000]
                  },
                  {
                    name: 'De-identified Records',
                    data: [992, 989, 996, 994, 998]
                  }
                ]} 
                options={{
                  chart: {
                    height: 350,
                    type: 'bar'
                  },
                  title: {
                    text: 'Overall De-identification Success Rate',
                    align: 'left'
                  },
                  plotOptions: {
                    bar: {
                      columnWidth: '60%',
                      dataLabels: {
                        position: 'top'
                      }
                    }
                  },
                  colors: ['#775DD0', '#00E396'],
                  dataLabels: {
                    enabled: false
                  },
                  legend: {
                    show: true,
                    customLegendItems: ['Orignal Records', 'De-identified Records'],
                    markers: {
                      fillColors: ['#775DD0', '#00E396'],
                    }
                  },
                  xaxis: {
                    categories: ['Names', 'Addresses', 'Phone Numbers', 'SSNs', 'Email Addresses']
                  },
                }}
              />
          </Card>
          <Card className='p-4'>
            <AppReactApexCharts
              type='pie'
              width='100%'
              height={350}
              series={[75, 20, 5]} // Data for Low, Medium, High
              options={{
                chart: {
                  type: 'pie',
                },
                labels: ['Low', 'Medium', 'High'], // Labels for the slices
                colors: ['#008FFB', '#FEB019', '#FF4560'], // Colors for Low, Medium, High
                legend: {
                  position: 'bottom',
                  markers: {
                    fillColors: ['#008FFB', '#FEB019', '#FF4560'],
                  },
                  formatter: function(val: any, opts: { w: { globals: { series: { [x: string]: any } } }; seriesIndex: string | number }) {
                    return `${val} ${opts.w.globals.series[opts.seriesIndex]}%`; // Show percentages in the legend
                  },
                },
                dataLabels: {
                  enabled: true,
                  formatter: function(val: any) {
                    return Number(val).toFixed(0) + '%'; // Format values as percentages
                  },
                },
                title: {
                  text: 'Re-identification Risk Assessment',
                  align: 'left',
                },
                plotOptions: {
                  pie: {
                    expandOnClick: true, // Allow for slice expansion on click
                  },
                },
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
                name: 'Data Utility Loss',
                data: [14, 28, 5, 10] // Replace these values with the appropriate data from the image
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
              colors: ['#00E396'], // Match the green color as in the image
              dataLabels: {
                enabled: false
              },
              title: {
                text: 'Data Utility Loss by Attribute',
                align: 'left'
              },
              xaxis: {
                categories: ['Age', 'Zipcode', 'Gender', 'Ethnicity'] // X-axis labels
              },
              yaxis: {
                title: {
                  text: 'Utility Loss'
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

export default ProfitStackedBar
