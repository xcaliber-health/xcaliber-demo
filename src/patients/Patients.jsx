import React from 'react'
import { Routes as Switch, Route } from 'react-router-dom'

import ViewPatients from './search/ViewPatients'

const Patients = () => {
  return (
    <Switch>
      <Route
        path="/"
        element={<ViewPatients></ViewPatients>}
      />
    </Switch>
  )
}

export default Patients
