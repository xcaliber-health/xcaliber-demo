import {
  Drawer,
  Grid,
  Typography,
} from "@mui/material";
import { Button, TextField, Box } from "@mui/material";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
const useStyles = makeStyles(() => (
  {
    typography:
    {
      paddingTop: "20px",
      paddingRight: "5px",
      paddingLeft: "5px"
    }
  }))

export default function Vitals({
  patientDetails,
  vitalsDetails,
  onVitalsClick,
  onWeightChange,
  onHeightChange,
  onbmiChange,
  onOxygenChange,
  onPulseChange,
  handleClose,
  onRespirationChange,
  onbodyTemperatureChange,
  oncircumChange,
  onSysChange,
  onDiaChange,
  onVitalsChange,
  open
}) {
  const classes = useStyles();
  const [height, setHeight] = useState();
  const [inch, setInches] = useState();
  const [weight, setWeight] = useState(0);
  const [sys, setSys] = useState();
  const [dia, setDia] = useState();
  const [bodyTemp, setBodyTemp] = useState();
  const [pluse, setPluse] = useState();
  const [rr, setRr] = useState();
  const [bmi, setBmi] = useState('');
  const [oxy, setOxy] = useState();
  const [headCir, setHeadCir] = useState();
  // const onWeightChange1 = (e)=> {
  //   // setWeight(e.target.value);
  //   console.log(weight);
  //   onWeightChange(weight);
  // };
  // useEffect(() => {
  // onWeightChange(weight);
  // }, []);
  return (
    <Drawer
      anchor={"right"}
      open={open}
      variant="temporary"
      PaperProps={{
        sx: {
          width: "35%",
          display: "flex",
          justifyContent: "space-around",
          padding: "10px"
        },
      }}
    >
      <Typography variant="h5">Create Vitals</Typography>
      <Grid display={"flex"}>
        <Typography className={classes.typography}>Blood Pressure</Typography>
        <TextField
          placeholder="Sys"
          required
          id="sys"
          sx={{ width: "10%", height: "10%" }}
          onChange={(e) => {
            onSysChange(e.target.value);
            setSys(e.target.value)

          }}
        ></TextField>
        <Typography className={classes.typography}>/</Typography>
        <TextField
          placeholder="Dia"
          required
          id="dia"
          sx={{ width: "10%" }}
          onChange={(e) => {
            onDiaChange(e.target.value);
            setDia(e.target.value);
          }}
        ></TextField>
      </Grid>
      <Box sx={{ display: "flex", width: "100%" }}>
        <Typography sx={{ paddingTop: "20px", marginRight: "20px" }} className={classes.typography}>Height</Typography>
        <TextField
          placeholder="ft"
          required
          id="feet"
          sx={{ width: "10%" }}
          onChange={(e) => setHeight(e.target.value)}
        ></TextField>
        <Typography sx={{ paddingTop: "20px" }} className={classes.typography}>ft</Typography>
        <TextField
          placeholder="in"
          required
          id="inch"
          sx={{ width: "10%" }}
          onChange={(e) => {
            onHeightChange(e.target.value);
            setInches(e.target.value)
          }}
        ></TextField>
        <Typography sx={{ paddingTop: "20px", paddingRight: "20px" }} className={classes.typography}>in</Typography>
        <Typography sx={{ paddingTop: "20px", marginLeft: "100px" }} className={classes.typography}>Weight</Typography>
        <input
          required
          id="weight"
          sx={{ width: "20%" }}
          value={weight}
          // onFocusOut={onWeightChange(weight)}
          // onFocusOut={onWeightChange(weight)}
          onChange={(e) => {
            setWeight(e.target.value)
            onWeightChange(e.target.value);
          }}
        ></input>
        <Typography sx={{ paddingTop: "20px" }} className={classes.typography}>Ibs</Typography>
      </Box>
      <Box sx={{ display: "flex", width: "100%" }}>
        <Typography sx={{ paddingTop: "20px", marginRight: "55px" }} className={classes.typography}>BMI</Typography>
        <TextField
          required
          id="bmi"
          sx={{ width: "20%" }}
          value={bmi}
          onChange={(e) => {
            setBmi(e.target.value)
            // onbmiChange(bmi);
            // console.log(bmi);
          }}
        ></TextField>
        <Typography sx={{ paddingTop: "20px", marginLeft: "65px" }} className={classes.typography}>Oxygen Saturation</Typography>
        <TextField
          required
          id="oxygen"
          sx={{ width: "20%" }}
          onChange={(e) => {
            onOxygenChange(e.target.value);
            setOxy(e.target.value)
          }}
        ></TextField>
        <Typography sx={{ paddingTop: "20px" }} className={classes.typography}>%</Typography>
      </Box>
      <Box sx={{ display: "flex", width: "100%" }}>
        <Typography sx={{ paddingTop: "20px", marginRight: "25px" }} className={classes.typography}>Pulse Rate</Typography>
        <TextField
          required
          id="pulseRate"
          sx={{ width: "20%" }}
          onChange={(e) => {
            onPulseChange(e.target.value);
            setPluse(e.target.value);
          }}
        ></TextField>
        <Typography sx={{ paddingTop: "20px", marginRight: "30px" }} className={classes.typography}>bpm</Typography>
        <Typography sx={{ paddingTop: "20px" }} className={classes.typography}>Body Temparature</Typography>
        <TextField
          required
          id="bodyTemperature"
          sx={{ width: "20%" }}
          onChange={(e) => {
            onbodyTemperatureChange(e.target.value);
            setBodyTemp(e.target.value);
          }}
        ></TextField>
        <Typography sx={{ paddingTop: "20px" }} className={classes.typography}>fahrenheit</Typography>
      </Box>
      <Box sx={{ display: "flex", width: "100%" }}>
        <Typography sx={{ paddingTop: "20px" }} className={classes.typography}>Respiration Rate</Typography>
        <TextField
          required
          id="respiration"
          sx={{ width: "20%" }}
          onChange={(e) => {
            onRespirationChange(e.target.value);
            setRr(e.target.value);
          }}
        ></TextField>
        <Typography sx={{ paddingTop: "20px" }} className={classes.typography}>bpm</Typography>
        <Typography sx={{ paddingTop: "20px" }} className={classes.typography}>Head Circumference</Typography>
        <TextField
          required
          id="circumference"
          sx={{ width: "20%" }}
          onChange={(e) => {
            // oncircumChange(e.target.value)
            setHeadCir(e.target.value);
          }}
        ></TextField>
        <Typography sx={{ paddingTop: "20px" }} className={classes.typography}>cm</Typography>
      </Box>
      <Box sx={{ display: "flex", width: "100%", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => { onVitalsClick(vitalsDetails, patientDetails, weight) }} sx={{ marginRight: "10px" }}>
          Create Vitals
        </Button>
        <Button onClick={handleClose} variant="contained">
          Cancel
        </Button>
      </Box>
    </Drawer>
  );
}