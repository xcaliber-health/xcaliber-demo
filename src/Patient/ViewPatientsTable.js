import { Table } from '@hospitalrun/components'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPatientsAtPage } from './service/service'
import Loading from './Loading'
import { formatDate } from '../core-utils/formatDate'
// import usePatients from '../hooks/usePatients'
// import PatientSearchRequest from '../models/PatientSearchRequest'
// import NoPatientsExist from './NoPatientsExist'


const ViewPatientsTable = (props) => {
  const { searchRequest } = props
  const navigate = useNavigate()
//   const { data, status } = usePatients(searchRequest)
  const [awaitd, setAwait] = useState(true)
  const [newData, setNewData] = useState({
    patients: [],
    totalCount: 0,
  })

  const func = async () => {
    const d = await getPatientsAtPage(props.page, searchRequest.queryString);
    console.log('data', d)
    // const newData =await parserFunc(d.data.entry)
    // console.log('parsedFuncdata', newData)
    // console.log('parsedFunc', newData)
    let mock = { patients: d, totalCount: d.length }
    console.log('mock: ', mock)
    setNewData(mock)
    setAwait(false)
    console.log('data2: ', newData)
  }

  useEffect(() => {
    func()
  }, [props.page])

  if (awaitd) {
    console.log(status)
    return <Loading />
  }

  if (newData.totalCount === 0) {
    return <div />
  }

  return (


      <Table
        data={props.filtered ? props.patientData : newData.patients}
        getID={(row) => row.id}
        columns={[
          { label: 'id', key: 'code' },
          { label: 'givenName', key: 'givenName' },
          { label: 'familyName', key: 'familyName' },
          { label: 'sex', key: 'sex' },
          {
            label: 'dateOfBirth',
            key: 'dateOfBirth',
            formatter: (row) => formatDate(row.dateOfBirth),
          },
        ]}
        actionsHeaderText={''}
        actions={[
          { label: 'View', action: (row) => navigate(`/patients/${row.id}`) },
        ]}
      />
  )
}

export default ViewPatientsTable

