import { Button } from '@mui/material'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchPatients from './SearchPatients'

const ViewPatients = () => {
  const navigate = useNavigate()
  useEffect(() => {
    // setButtonToolBar([
    //   <Button
    //     key="newPatientButton"
    //     outlined
    //     color="success"
    //     icon="patient-add"
    //     onClick={() => navigate('/patients/new')}
    //   >
    //     New Patient
    //   </Button>,
    // ])
    // return () => {
    //   setButtonToolBar([])
    // }
  }, [])

  return <SearchPatients />
}

export default ViewPatients
