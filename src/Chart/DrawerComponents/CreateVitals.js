import {
  Drawer,
  Grid,
  Typography,
} from "@mui/material";
import { Button, TextField, Box } from "@mui/material";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import { VitalService } from "../../services/P360/vitalService";
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
  onVitalsChange
}) {
  const classes = useStyles();
  let heightValue = 0;
  const [height, setHeight] = useState(0);
  const [inch, setInches] = useState(0);
  const [weight, setWeight] = useState(0);
  const [sys, setSys] = useState();
  const [dia, setDia] = useState();
  const [bodyTemp, setBodyTemp] = useState();
  const [pluse, setPluse] = useState();
  const [rr, setRr] = useState();
  const [bmi, setBmi] = useState('');
  const [oxy, setOxy] = useState();
  const [headCir, setHeadCir] = useState();


  const onCreate = async () => {
    const resource = {
      resourceType: "Observation",
      subject: {
        reference: `Patient/${patientDetails?.id}`
      },
      performer: [
        {
          reference: "Organization/140857911017476"
        }
      ],
      category: [
        {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/observation-category",
              "code": "vital-signs",
              "display": "Vital Signs"
            }
          ]
        }
      ]
    }
    const entries = [];
    if (sys && dia) {
      entries.push({
        resource: {
          ...resource,
          code: {
            coding: [
              {
                code: "85354-9",
                display: "Blood Pressure"
              }
            ]
          },
          component: [
            {
              code: {
                coding: [
                  {
                    code: "8480-6"
                  }
                ]
              },
              valueQuantity: {
                value: "120"
              }
            },
            {
              code: {
                coding: [
                  {
                    code: "8462-4"
                  }
                ]
              },
              valueQuantity: {
                value: dia
              }
            }

          ],
        }
      })
    }
    if (height) {
      heightValue = 1;
      heightValue = 12 * height;
    }
    if (inch) {
      const sum = parseInt(inch) + parseInt(heightValue)
      entries.push({
        resource: {
          ...resource,
          code: {
            "coding": [{ "display": "Height" }]
          },
          valueQuantity: {
            "unit": "inches",
            "value": sum
          }
        }
      })
    }
    if (weight) {
      entries.push({
        resource: {
          ...resource,
          code: {
            "coding": [{
              "display": "Weight"
            }]
          },
          valueQuantity: {
            "unit": "lbs",
            "value": weight
          }
        }
      })
    }
    if (bmi) {
      entries.push({
        resource: {
          ...resource,
          code: {
            "coding": [{ "display": "body mass index" }]
          },
          valueString: bmi
        }
      })
    }
    if (oxy) {
      entries.push({
        resource: {
          ...resource,
          code: {
            "coding": [{ "display": "Oxygen Saturation" }]
          },
          valueQuantity: {
            "unit": "%",
            "value": oxy
          }
        }
      })
    }
    if (pluse) {
      entries.push({
        resource: {
          ...resource,
          code: {
            "coding": [{ "display": "Pulse" }]
          },
          valueQuantity: {
            "unit": "bpm",
            "value": pluse
          }
        }
      })
    }
    if (bodyTemp) {
      entries.push({
        resource: {
          ...resource,
          code: {
            "coding": [{ "display": "Body Temparature" }]
          },
          valueQuantity: {
            "unit": "fahrenheit",
            "value": bodyTemp
          }
        }
      })
    }
    if (rr) {
      entries.push({
        resource: {
          ...resource,
          code: {
            "coding": [{ "display": "Respiration Rate" }]
          },
          valueQuantity: {
            "unit": "bpm",
            "value": rr
          }
        }
      })
    }
    if (headCir) {
      entries.push({
        resource: {
          ...resource,
          code: {
            "coding": [{ "display": "Head Circumference" }]
          },
          valueQuantity: {
            "unit": "cm",
            "value": headCir
          }
        }
      })
    }

    const vitalsPayLoad = {
      data: {
        resourceType: "Bundle",
        entry: entries
      }
    }

    await VitalService.createVitals(vitalsPayLoad);
    onVitalsClick();
  }

  return (
    <React.Fragment>
      <Typography variant="h5">Create Vitals</Typography>
      <Grid container display={"flex"} justifyContent="space-between" sx={{ padding: '8px 0px 8px 0px' }}>
        <Grid item>
          <Typography className={classes.typography}>Blood Pressure</Typography>
        </Grid>
        <Grid item display={"flex"} sx={{ padding: '8px 0px 8px 0px', width: '50%' }}>
          <TextField
            placeholder="Sys"
            required
            id="sys"
            onChange={(e) => {
              // onSysChange(e.target.value);
              setSys(e.target.value)

            }}
          ></TextField>
          <Typography className={classes.typography}>/</Typography>
          <TextField
            placeholder="Dia"
            required
            id="dia"
            onChange={(e) => {
              // onDiaChange(e.target.value);
              setDia(e.target.value);
            }}
          ></TextField>
        </Grid>
      </Grid>
      <Grid container display={"flex"} justifyContent="space-between" sx={{ padding: '8px 0px 8px 0px' }}>
        <Grid item>
          <Typography sx={{ paddingTop: "20px", marginRight: "20px" }} className={classes.typography}>Height</Typography>
        </Grid>
        <Grid item display={"flex"} sx={{ padding: '8px 0px 8px 0px', width: '50%' }}>
          <TextField
            required
            id="feet"
            onChange={(e) => {
              // onHeightChange(e.target.value);
              setHeight(e.target.value)
            }}
          ></TextField>
          <Typography sx={{ paddingTop: "20px" }} className={classes.typography}>ft</Typography>
          <TextField
            required
            id="inch"
            onChange={(e) => {
              // onHeightChange(e.target.value);
              setInches(e.target.value);
            }}
          ></TextField>
          <Typography sx={{ paddingTop: "20px" }} className={classes.typography}>in</Typography>
        </Grid>
      </Grid>
      <Grid container display={"flex"} justifyContent="space-between" sx={{ padding: '8px 0px 8px 0px' }}>
        <Grid item>
          <Typography className={classes.typography}>Weight</Typography>
        </Grid>
        <Grid item display={"flex"} sx={{ padding: '8px 0px 8px 0px', width: '50%' }}>
          <TextField
            required
            id="weight"
            sx={{ width: "100%" }}
            // onFocusOut={onWeightChange(weight)}
            // onFocusOut={onWeightChange(weight)}
            onChange={(e) => {
              setWeight(e.target.value)
              // onWeightChange(e.target.value);
            }}
          ></TextField>
          <Typography sx={{ paddingTop: "20px" }} className={classes.typography}>lbs</Typography>
        </Grid>
      </Grid>
      <Grid container display={"flex"} justifyContent="space-between" sx={{ padding: '8px 0px 8px 0px' }}>
        <Grid container display={"flex"} justifyContent="space-between" sx={{ padding: '8px 0px 8px 0px', width: "50%" }}>
          <Grid item sx={{ width: "50%" }}>
            <Typography sx={{ paddingTop: "20px", marginRight: "55px" }} className={classes.typography}>BMI</Typography>
          </Grid>
          <Grid item display={"flex"} sx={{ padding: '8px 0px 8px 0px', width: '50%' }}>
            <TextField
              required
              id="bmi"
              value={bmi}
              onChange={(e) => {
                setBmi(e.target.value)
                // onbmiChange(bmi);
                // console.log(bmi);
              }}
            ></TextField>
          </Grid>
        </Grid>
        <Grid container display={"flex"} justifyContent="space-between" sx={{ padding: '8px 0px 8px 0px', width: '50%' }}>
          <Grid item sx={{ width: "50%" }}>
            <Typography sx={{ paddingTop: "20px", marginLeft: "10px" }} className={classes.typography}>Oxygen Saturation</Typography>
          </Grid>
          <Grid item display={"flex"} sx={{ padding: '8px 0px 8px 0px', width: '50%' }}>
            <TextField
              required
              placeholder="%"
              id="oxygen"
              onChange={(e) => {
                // onOxygenChange(e.target.value);
                setOxy(e.target.value)
              }}
            ></TextField>
            {/* <Typography sx={{ paddingTop: "20px" }} className={classes.typography}>%</Typography> */}
          </Grid>
        </Grid>
      </Grid>

      <Grid container display={"flex"} justifyContent="space-between" sx={{ padding: '8px 0px 8px 0px' }}>
        <Grid container display={"flex"} justifyContent="space-between" sx={{ padding: '8px 0px 8px 0px', width: "50%" }}>
          <Grid item sx={{ width: "50%" }}>
            <Typography sx={{ paddingTop: "20px", marginRight: "25px" }} className={classes.typography}>Pulse Rate</Typography>
          </Grid>
          <Grid item display={"flex"} sx={{ padding: '8px 0px 8px 0px', width: '50%' }}>
            <TextField
              required
              placeholder="bpm"
              id="pulseRate"
              onChange={(e) => {
                // onPulseChange(e.target.value);
                setPluse(e.target.value);
              }}
            ></TextField>
            {/* <Typography sx={{ paddingTop: "20px" }} className={classes.typography}>bpm</Typography> */}
          </Grid>
        </Grid>
        <Grid container display={"flex"} justifyContent="space-between" sx={{ padding: '8px 0px 8px 0px', width: "50%" }}>
          <Grid item sx={{ width: "50%" }}>
            <Typography sx={{ paddingTop: "20px", marginLeft: "10px" }} className={classes.typography}>Body Temparature</Typography>
          </Grid>
          <Grid item display={"flex"} sx={{ padding: '8px 0px 8px 0px', width: '50%' }}>
            <TextField
              required
              placeholder="fahrenheit"
              id="bodyTemperature"
              onChange={(e) => {
                // onbodyTemperatureChange(e.target.value);
                setBodyTemp(e.target.value);
              }}
            ></TextField>
            {/* <Typography sx={{ paddingTop: "20px" }} className={classes.typography}>fahrenheit</Typography> */}
          </Grid>
        </Grid>
      </Grid>

      <Grid container display={"flex"} justifyContent="space-between" sx={{ padding: '8px 0px 8px 0px' }}>
        <Grid container display={"flex"} justifyContent="space-between" sx={{ padding: '8px 0px 8px 0px', width: "50%" }}>
          <Grid item sx={{ width: "50%" }}>
            <Typography sx={{ paddingTop: "20px" }} className={classes.typography}>Respiration Rate</Typography>
          </Grid>
          <Grid item display={"flex"} sx={{ padding: '8px 0px 8px 0px', width: '50%' }}>
            <TextField
              required
              placeholder="bpm"
              id="respiration"
              onChange={(e) => {
                // onRespirationChange(e.target.value);
                setRr(e.target.value);
              }}
            ></TextField>
            {/* <Typography sx={{ paddingTop: "20px" }} className={classes.typography}>bpm</Typography> */}
          </Grid>
        </Grid>
        <Grid container display={"flex"} justifyContent="space-between" sx={{ padding: '8px 0px 8px 0px', width: "50%" }}>
          <Grid item sx={{ width: "50%" }}>
            <Typography sx={{ paddingTop: "20px", marginLeft: "10px" }} className={classes.typography}>Head Circumference</Typography>
          </Grid>
          <Grid item display={"flex"} sx={{ padding: '8px 0px 8px 0px', width: '50%' }}>
            <TextField
              required
              placeholder="cm"
              id="circumference"
              onChange={(e) => {
                // oncircumChange(e.target.value)
                setHeadCir(e.target.value);
              }}
            ></TextField>
            {/* <Typography sx={{ paddingTop: "20px" }} className={classes.typography}>cm</Typography> */}
          </Grid>
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", width: "100%", padding: '8px 0px 8px 0px', justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => { onCreate() }} sx={{ marginRight: "10px" }}>
          Create Vitals
        </Button>
        <Button onClick={handleClose} variant="contained">
          Cancel
        </Button>
      </Box>
    </React.Fragment>
  );
}