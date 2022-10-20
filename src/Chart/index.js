import { Grid,Box,Tabs,Tab,Typography,IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/system";
import PatientDetailsCard from "./PatientAvatarBox";
import { useParams } from "react-router-dom";
import { PatientService } from "../services/P360/patientService";
import { AppointmentService } from "../services/P360/appointmentService";
import PamiV from './PamiV'
const Chart = () => {
  const { id } = useParams();
  const theme = useTheme();
  const [patientDetails, setPatientDetails] = useState({});
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const getPatientDetails = async () => {
    const response = await PatientService.getPatientById(id);
    setPatientDetails(response);
  };
  const [value, setValue] = React.useState(0);


  const getUpcomingAppointments = async () => {
    const response = await AppointmentService.getUpcomingAppointments(
      id,
      new Date().toISOString().slice(0, 10)
    );
    setUpcomingAppointments(response);
  };
  useEffect(() => {
    setLoading(true);
    Promise.all([getPatientDetails(), getUpcomingAppointments()])
      .then()
      .catch()
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Grid container  spacing = {12} justifyContent="space-between" style = {{marginTop : 0}}>
     
        <Grid
          sx={{
            backgroundColor: "#FAF9F6",
            width: theme.spacing(50),
            height: theme.spacing(60),
          }}
          lg={3}
        > 
        {!loading && (
          <PatientDetailsCard
            patientId={id}
            patientDetails={patientDetails}
            upcomingAppointments={upcomingAppointments}
          />
        )
        }
        {loading && "Loading"}
        </Grid>
        
      
      <Grid
        sx={{
          backgroundColor: "#FAF9F6",
          // width: theme.spacing(50),
          height: theme.spacing(60),
        }}
        lg={5}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
    <Tab label="Timeline"  />
    <Tab label="Notes"  />
    <Tab label="Details"  />
  </Tabs>
</Box>
<TabPanel value={value} index={0}>
  Timeline
</TabPanel>
<TabPanel value={value} index={1}>
  Notes
</TabPanel>
<TabPanel value={value} index={2}>
  Details
</TabPanel>
      </Grid>

            
      <Grid
        sx={{
          backgroundColor: "#FAF9F6",
          // width: theme.spacing(50),
          height: theme.spacing(60),
        }}
        lg={3}
      >
       <PamiV/>
      </Grid>
    </Grid>
  );
};



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
export default Chart;
