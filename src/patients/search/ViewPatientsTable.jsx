import { Table } from '@hospitalrun/components'
import React, { useEffect, useState } from 'react'
import { getPatientsAtPage } from '../../service/service'
import Loading from '../../shared/components/Loading'
import useTranslator from '../../shared/hooks/useTranslator'
import { formatDate } from '../../shared/util/formatDate'
import usePatients from '../hooks/usePatients'
import NoPatientsExist from './NoPatientsExist'



const ViewPatientsTable = (props) => {
  const { searchRequest } = props
  const { t } = useTranslator()
  const history = useHistory()
  const { data, status } = usePatients(searchRequest)
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
    return <NoPatientsExist />
  }

  return (
    <>
      {console.log('newData: ', newData)}
      {console.log('olddata: ', data)}

      <Table
        data={props.filtered ? props.patientData : newData.patients}
        getID={(row) => row.id}
        columns={[
          { label: t('patient.code'), key: 'code' },
          { label: t('patient.givenName'), key: 'givenName' },
          { label: t('patient.familyName'), key: 'familyName' },
          { label: t('patient.sex'), key: 'sex' },
          {
            label: t('patient.dateOfBirth'),
            key: 'dateOfBirth',
            formatter: (row) => formatDate(row.dateOfBirth),
          },
        ]}
        actionsHeaderText={t('actions.label')}
        actions={[
          { label: t('actions.view'), action: (row) => history.push(`/patients/${row.id}`) },
        ]}
      />
    </>
  )
}

export default ViewPatientsTable

