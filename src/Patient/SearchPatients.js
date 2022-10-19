import { Container, Grid } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
// import { Button } from '@hospitalrun/components'
// import PatientSearchRequest from '../models/PatientSearchRequest'
import PatientSearchInput from './PatientSearch'
import ViewPatientsTable from './ViewPatientsTable'
// import FilterMenu from './filter/PatientFilter'
// import { data } from './../util/constants'
import Pagination from './Pagination'
// import PatientRepository from '../../shared/db/PatientRepository'
// import Patient from '../../shared/model/Patient'
import {  getAllPatients, getPatientCount } from './service/service'

export const LabelsContext = React.createContext({
  filterLabels: [],
  setFilterLabels: () => {},
})

const SearchPatients = () => {
  const [searchRequest, setSearchRequest] = useState({ queryString: '' })
  const [filterMenuState, setFilterMenuState] = useState(false)
  const [filterLabels, setFilterLabels] = useState([])
  const filterLabelsValue = { filterLabels, setFilterLabels }
//   const [filteredPatientData, setFilteredPatientData] = useState<Patient[]>([])
//   const [filterValues, setFilterValues] = useState<Array<String>>([])
  const [clearFilterS, setClearFilterS]= useState(false)
  const [trigger, setTrigger]= useState(false)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  

  const onSearchRequestChange = useCallback((newSearchRequest) => {
    setPage(1);
    setSearchRequest(newSearchRequest)
  }, [])

  const openFilterMenu = () => {
    setFilterMenuState(true)
  }

  const handleClose = () => {
    setFilterMenuState(!filterMenuState)
  }
  const clearFilter = () => {
    setFilteredPatientData([])
    setClearFilterS(false)
    setTrigger(true)
  }

  const onPageChange = (currentPage) => {
    setPage(currentPage);
  }
const changeTrigger = (param) =>{
  setTrigger(param)
}


 
  let allFilterData = []
  useEffect(() => {
    const processor = async () => {
      const pages = await getPatientCount(searchRequest.queryString);
      setTotalPages(pages);
    }
    processor();
  }, [allFilterData]);

  function getAge(dateString) {   
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    return age;
}

  const filterAllPatientData = async (param) => {
    console.log(param);
    console.log('paramValues: ',param,param.length)
    if (param?.length > 0) {
     
      // let tempData = await PatientRepository.findAll()
      let tempData = await getAllPatients()
      param.map((data)=>{
        tempData?.map((data2)=>{
          if (data === 'other'){
            data= "nonbinary"
          }
          if(data === data2.sex){
            allFilterData.push(data2)
            console.log('newdata: ', allFilterData)
          }
          else{
            let age=getAge(data2.dateOfBirth)
            if(data === '0 - 20 yrs' && age<=20 && !allFilterData.includes(data2)){
              allFilterData.push(data2)
            }
            if(data === '21 - 40 yrs' && age>20 && age<=40 && !allFilterData.includes(data2)){
              allFilterData.push(data2)
            }
            if(data === '41 - 60 yrs' && age>40 && age<=60 && !allFilterData.includes(data2)){
              allFilterData.push(data2)
            }
            if(data === '61 + yrs' && age>60 && !allFilterData.includes(data2)){
              allFilterData.push(data2)
            }
          }
         
        })
      })
      console.log('allFilterData: ',allFilterData)        
      setFilteredPatientData(allFilterData)
      console.log('filteredPatientData',filteredPatientData)
    }
  }

  return (
    <LabelsContext.Provider value={filterLabelsValue}>
      <div>
        <Container>
          {/* <FilterMenu
            filterMenuState={filterMenuState}
            handleClose={handleClose}
            data={data}
            handleFilters={(param) => {
              console.log('param: ', param)
              setFilterValues(param)
              console.log('insidefilterValues: ', filterValues)
              filterAllPatientData(param)
              setClearFilterS(true)
            }}
            handleApply={() => {
              console.log("entered")
            }}
            clearFilters={changeTrigger}
            trigger={trigger}
            
          /> */}
          <Grid>
            <Grid md={12}>
              <Grid>
                <Grid md={8} style={{ paddingLeft: '0px' }}>
                  <PatientSearchInput data-testid={'searcinput'} onChange={onSearchRequestChange} />
                </Grid>
                {/* <Column md={2} style={{ display: 'flex', justifyContent: 'end', padding: '0px' }}>
                  <Button
                    style={{ width: '7vw', height: '2.97rem' }}
                    key="filterButton"
                    outlined
                    color="success"
                    onClick={openFilterMenu}
                  >
                    Filter
                  </Button>
                </Column>
                <Column md={2} style={{ display: 'flex', justifyContent: 'end', padding: '0px' }}>
                  <Button
                    style={{ width: '7vw', height: '2.97rem' }}
                    key="filterButton"
                    outlined
                    color="success"
                    onClick={clearFilter}
                  >
                    Clear Filter
                  </Button>
                </Column> */}
              </Grid>
            </Grid>
          </Grid>
          <Grid>
            <ViewPatientsTable searchRequest={searchRequest} filtered={clearFilterS} patientData={clearFilterS ? filteredPatientData : [] } page={page}/>
          </Grid>
          <Grid>
            <Pagination currentPage={page} onPageChange={onPageChange} pageSize={10} totalCount={totalPages} siblingCount={1}></Pagination>
          </Grid>
        </Container>
      </div>
    </LabelsContext.Provider>
  )
}

export default SearchPatients
