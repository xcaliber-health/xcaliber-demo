import { Paper, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
const DetailsTab = ({ patientDetails }) => {
  useEffect(() => {
    console.log(patientDetails);
  });
  const commonValueStyles = {
    color: " #84818a",
  };
  const calculateAge = (birthYear) => {
    let currentYear = new Date().getFullYear();
    return `${currentYear - birthYear}`;
  };
  return (
    <Paper style={{ padding: 2 }} elevation={0}>
      <Grid container direction="column" alignItems={"center"}>
        <Grid container item justifyContent={"space-between"}>
          <Grid item p={1}>
            <Typography>Name</Typography>
            <Typography
              sx={{ ...commonValueStyles }}
            >{`${patientDetails?.name?.[0]?.given?.[0]}  ${patientDetails?.name?.[0]?.family} `}</Typography>
          </Grid>
        </Grid>
        <Grid container item justifyContent={"space-between"}>
          <Grid item p={1}>
            <Typography>Gender</Typography>
            <Typography sx={{ ...commonValueStyles }}>
              {patientDetails?.extension?.find((ext) => {
                return ext?.url?.endsWith("gender-marker");
              })?.valueString ?? `-`}
            </Typography>
          </Grid>
          <Grid item p={1}>
            <Typography>Birthdate</Typography>
            <Typography sx={{ ...commonValueStyles }}>
              {patientDetails?.birthDate}
            </Typography>
          </Grid>
        </Grid>
        <Grid container item justifyContent={"space-between"}>
          <Grid item p={1}>
            <Typography>Age</Typography>
            <Typography sx={{ ...commonValueStyles }}>
              {calculateAge(parseInt(patientDetails?.birthDate?.slice(0, 4)))}
            </Typography>
          </Grid>
          <Grid item p={1}>
            <Typography>Language</Typography>
            <Typography sx={{ ...commonValueStyles }}>-</Typography>
          </Grid>
        </Grid>
        <Grid container item justifyContent={"space-between"}>
          <Grid item p={1}>
            <Typography>Sex at birth</Typography>
            <Typography sx={{ ...commonValueStyles }}>
              {patientDetails?.extension?.find((ext) => {
                return ext?.url?.endsWith("us-core-birthsex");
              })?.valueCode ?? `-`}
            </Typography>
          </Grid>
          <Grid item p={1}>
            <Typography>Sexual Orientation</Typography>
            <Typography sx={{ ...commonValueStyles }}>
              {patientDetails?.extension?.find((ext) => {
                return ext?.url?.endsWith("sexual-orientation");
              })?.valueString ?? `-`}
            </Typography>
          </Grid>
        </Grid>
        <Grid container item justifyContent={"space-between"}>
          <Grid item p={1}>
            <Typography> Race</Typography>
            <Typography sx={{ ...commonValueStyles }}>
              {patientDetails?.extension?.find((ext) => {
                return ext?.url?.endsWith("us-core-race");
              })?.valueString ?? `-`}
            </Typography>
          </Grid>
          <Grid item p={1}>
            <Typography> Ethnicity</Typography>
            <Typography sx={{ ...commonValueStyles }}>
              {patientDetails?.extension?.find((ext) => {
                return ext?.url?.endsWith("us-core-ethnicity");
              })?.valueString ?? `-`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid container justifyContent={"space-between"}>
        <Grid item p={1}>
          <Typography>Email </Typography>
          <Typography sx={{ ...commonValueStyles }}>
            {patientDetails?.telecom?.find((tele) => {
              return tele?.system === "email";
            })?.value ?? "-"}
          </Typography>
        </Grid>
        <Grid item p={1}>
          <Typography>Phone</Typography>
          <Typography sx={{ ...commonValueStyles }}>
            {patientDetails?.telecom?.find((tele) => {
              return tele?.system === "phone";
            })?.value ?? "-"}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DetailsTab;
