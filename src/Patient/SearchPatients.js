import { Container, Grid, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
// import { Button } from '@hospitalrun/components'
// import PatientSearchRequest from '../models/PatientSearchRequest'
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Button, TextField, Box } from "@mui/material";
import PatientSearchInput from "./PatientSearch";
import ViewPatientsTable from "./ViewPatientsTable";
// import FilterMenu from './filter/PatientFilter'
// import { data } from './../util/constants'
import Pagination from "./Pagination";
import MenuItem from "@mui/material/MenuItem";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Drawer } from "@mui/material";
// import PatientRepository from '../../shared/db/PatientRepository'
// import Patient from '../../shared/model/Patient'
import { addPatient, getAllPatients, getPatientCount } from "./service/service";

export const LabelsContext = React.createContext({
  filterLabels: [],
  setFilterLabels: () => {},
});

const genders = [
  {
    value: "man",
    label: "Man",
  },
  {
    value: "woman",
    label: "Woman",
  },
  {
    value: "unknown",
    label: "Other",
  },
];

const SearchPatients = () => {
  const [searchRequest, setSearchRequest] = useState({ queryString: "" });
  const [filterMenuState, setFilterMenuState] = useState(false);
  const [filterLabels, setFilterLabels] = useState([]);
  const filterLabelsValue = { filterLabels, setFilterLabels };
  //   const [filteredPatientData, setFilteredPatientData] = useState<Patient[]>([])
  //   const [filterValues, setFilterValues] = useState<Array<String>>([])
  const [clearFilterS, setClearFilterS] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [gender, setGender] = useState("");

  const handleSelectChange = (event) => {
    setGender(event.target.value);
  };

  const onSearchRequestChange = useCallback((newSearchRequest) => {
    setPage(1);
    setSearchRequest(newSearchRequest);
  }, []);

  const openFilterMenu = () => {
    setFilterMenuState(true);
  };

  const handleClose = () => {
    setFilterMenuState(!filterMenuState);
  };
  const clearFilter = () => {
    setFilteredPatientData([]);
    setClearFilterS(false);
    setTrigger(true);
  };

  const onPageChange = (currentPage) => {
    setPage(currentPage);
  };
  const changeTrigger = (param) => {
    setTrigger(param);
  };

  const handleDrawerOpen = () => {
    setToggleDrawer(true);
  };

  const handleDrawerClose = () => {
    setToggleDrawer(false);
  };

  const handleSubmit = async () => {
    let firstname = document.getElementById("firstname").value;
    let middlename = document.getElementById("middlename").value;
    let lastname = document.getElementById("lastname").value;
    let birthDate = document.getElementById("birthday").value;

    console.log(
      firstname +
        " " +
        middlename +
        " " +
        lastname +
        " " +
        birthDate +
        " " +
        gender
    );

    let patient = {
      addresses: [],
      dateOfBirth: birthDate,
      emails: [],
      familyName: lastname,
      givenName: firstname,
      isApproximateDateOfBirth: false,
      phoneNumbers: [],
      sex: gender,
      suffix: "",
    };

    let id = await addPatient(patient);

    window.alert("Successfully created patient with Id " + id.id);
    handleDrawerClose();

    const processor = async () => {
      const pages = await getPatientCount(searchRequest.queryString);
      setTotalPages(pages);
    };
    processor();
  };
  let allFilterData = [];
  useEffect(() => {
    const processor = async () => {
      const pages = await getPatientCount(searchRequest.queryString);
      setTotalPages(pages);
    };
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
    console.log("paramValues: ", param, param.length);
    if (param?.length > 0) {
      // let tempData = await PatientRepository.findAll()
      let tempData = await getAllPatients();
      param.map((data) => {
        tempData?.map((data2) => {
          if (data === "other") {
            data = "nonbinary";
          }
          if (data === data2.sex) {
            allFilterData.push(data2);
            console.log("newdata: ", allFilterData);
          } else {
            let age = getAge(data2.dateOfBirth);
            if (
              data === "0 - 20 yrs" &&
              age <= 20 &&
              !allFilterData.includes(data2)
            ) {
              allFilterData.push(data2);
            }
            if (
              data === "21 - 40 yrs" &&
              age > 20 &&
              age <= 40 &&
              !allFilterData.includes(data2)
            ) {
              allFilterData.push(data2);
            }
            if (
              data === "41 - 60 yrs" &&
              age > 40 &&
              age <= 60 &&
              !allFilterData.includes(data2)
            ) {
              allFilterData.push(data2);
            }
            if (
              data === "61 + yrs" &&
              age > 60 &&
              !allFilterData.includes(data2)
            ) {
              allFilterData.push(data2);
            }
          }
        });
      });
      console.log("allFilterData: ", allFilterData);
      setFilteredPatientData(allFilterData);
      console.log("filteredPatientData", filteredPatientData);
    }
  };

  return (
    <LabelsContext.Provider value={filterLabelsValue}>
      <div>
        <Drawer
          anchor={"right"}
          open={toggleDrawer}
          variant="temporary"
          PaperProps={{
            sx: {
              width: "40%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-around",
              padding: "10px"
            },
          }}
        >
          <Typography variant="h3">New Patient</Typography>
          <Accordion sx={{ padding: "20px" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Basic Information</Typography>
            </AccordionSummary>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "space-evenly",
                flexWrap: "wrap"
              }}
            >
              <TextField
                placeholder="Given Name"
                required
                id="firstname"
                sx={{marginTop: "10px"}}
              ></TextField>
              <TextField placeholder="Middle Name" id="middlename" sx={{marginTop: "10px"}}></TextField>
              <TextField
                placeholder="Family Name"
                required
                id="lastname"
                sx={{marginTop: "10px"}}
              ></TextField>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "15px",
                  marginTop: "10px"
                }}
              >
                <label for="birthday">D.O.B</label>
                <input type="date" id="birthday" name="birthday"></input>
              </Box>

              <Box sx={{marginTop: "10px"}}>
                <TextField
                  helperText="Gender"
                  select
                  value={gender}
                  onChange={handleSelectChange}
                  id="gender"
                >
                  {genders.map((option) => {
                    return (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Box>
            </Box>
          </Accordion>
          <Accordion sx={{ width: "100%", padding: "20px" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Contact Information</Typography>
            </AccordionSummary>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                Phone Number
              </AccordionSummary>
              <TextField
                placeholder="Phone Number"
                sx={{ width: "100%" }}
              ></TextField>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                Email
              </AccordionSummary>
              <TextField placeholder="Email" sx={{ width: "100%" }}></TextField>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                Address
              </AccordionSummary>
              <TextField
                placeholder="Address"
                sx={{ Width: "100%" }}
              ></TextField>
            </Accordion>
          </Accordion>
          <Box sx={{display: "flex", width: "100%", justifyContent: "flex-end"}}>
            <Button variant="contained" onClick={handleSubmit} sx={{marginRight: "10px"}}>
              Create Patient
            </Button>
            <Button onClick={handleDrawerClose} variant="contained">
              Cancel
            </Button>
          </Box>
        </Drawer>
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
                <Grid md={8} style={{ paddingLeft: "0px" }}>
                  <PatientSearchInput
                    data-testid={"searcinput"}
                    onChange={onSearchRequestChange}
                  />
                </Grid>
                <Grid
                  md={4}
                  style={{
                    display: "flex",
                    padding: "0px",
                  }}
                >
                  <Button
                    startIcon={<PersonAddIcon></PersonAddIcon>}
                    onClick={handleDrawerOpen}
                  >
                    Create Patient
                  </Button>
                </Grid>
                {
                  // <Grid
                  //   md={2}
                  //   style={{
                  //     display: "flex",
                  //     padding: "0px",
                  //   }}
                  // >
                  //   <Button startIcon={<PersonAddIcon></PersonAddIcon>}>
                  //     Create Patient
                  //   </Button>
                  // </Grid>
                  /*
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
                </Column> */
                }
              </Grid>
            </Grid>
          </Grid>
          <Grid>
            <ViewPatientsTable
              searchRequest={searchRequest}
              filtered={clearFilterS}
              patientData={clearFilterS ? filteredPatientData : []}
              page={page}
            />
          </Grid>
          <Grid>
            <Pagination
              currentPage={page}
              onPageChange={onPageChange}
              pageSize={10}
              totalCount={totalPages}
              siblingCount={1}
            ></Pagination>
          </Grid>
        </Container>
      </div>
    </LabelsContext.Provider>
  );
};

export default SearchPatients;
