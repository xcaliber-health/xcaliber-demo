'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Components Imports
import TotalProfitStackedBar from './ecommerce/TotalProfitStackedBar'
import KAnonimityBarChart from './ecommerce/KAnonimityBarChart'

const DeIDDashboard = () => {
  // Vars

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={6}>
        <TotalProfitStackedBar />
      </Grid>
      <Grid item xs={12} md={6}>
        <KAnonimityBarChart />
      </Grid>
    </Grid>
  )
}

export default DeIDDashboard
