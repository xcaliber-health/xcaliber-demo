import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/system";
import PatientDetailsCard from "./PatientAvatarBox";
import { useParams } from "react-router-dom";
import { PatientService } from "../services/P360/patientService";
import { AppointmentService } from "../services/P360/appointmentService";

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
  return (
    <Grid container alignItems="start">
      {!loading && (
        <Grid
          sx={{
            backgroundColor: "#FAF9F6",
            width: theme.spacing(50),
            height: theme.spacing(60),
          }}
        >
          <PatientDetailsCard
            patientId={id}
            patientDetails={patientDetails}
            upcomingAppointments={upcomingAppointments}
          />
        </Grid>
      )}
      {loading && "Loading"}
    </Grid>
  );
};

export default Chart;
