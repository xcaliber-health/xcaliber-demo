import React from 'react'
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import {Dangerous,ReportProblem,DeviceThermostat,Medication,Vaccines} from "@mui/icons-material/";
import { Grid,Box,Tabs,Tab,Typography,IconButton } from "@mui/material";
import { BUTTON_LABELS } from "../core-utils/constants";
import { useTheme } from "@mui/system";

export default function PamiV() {
  const theme = useTheme();

    return (
        <React.Fragment>
        <Box  
        alignSelf="flex-start"
        display="flex"
        justifyContent="space-between"
        // marginLeft={theme.spacing(3)}
        // marginRight={theme.spacing(3)}
        marginBottom={theme.spacing(3)}
        marginLeft={theme.spacing(3)}
        marginRight={theme.spacing(3)}
        paddingTop = {theme.spacing(3)}

      >
        <div style = {{display : "flex", alignItems: "center"}}>
        <DeviceThermostat />
        {BUTTON_LABELS.VITALS}
        </div>
       
        <IconButton sx={{ p: 0 }} display="flex">
          <AddCircleOutlineRoundedIcon />
        </IconButton>
        {/*Vitals */}
      </Box>
      <Box  
        alignSelf="flex-start"
        display="flex"
        justifyContent="space-between"
        margin={theme.spacing(3)}
      >
                  <div style = {{display : "flex", alignItems: "center"}}>

        <ReportProblem />
        {BUTTON_LABELS.PROBLEMS}
        </div>
        <IconButton sx={{ p: 0 }} display="flex">
          <AddCircleOutlineRoundedIcon />
        </IconButton>
        {/*Vitals */}
      </Box>

      <Box  
        alignSelf="flex-start"
        display="flex"
        justifyContent="space-between"
        margin={theme.spacing(3)}
      >
                            <div style = {{display : "flex", alignItems: "center"}}>

        <Dangerous />
        {BUTTON_LABELS.ALLERGIES}
        </div>

        <IconButton sx={{ p: 0 }} display="flex">
          <AddCircleOutlineRoundedIcon />
        </IconButton>
        {/*Vitals */}
      </Box>
      <Box  
        alignSelf="flex-start"
        display="flex"
        justifyContent="space-between"
        margin={theme.spacing(3)}
      >
                            <div style = {{display : "flex", alignItems: "center"}}>

        <Vaccines />
        {BUTTON_LABELS.IMMUNIZATIONS}
        </div>

        <IconButton sx={{ p: 0 }} display="flex">
          <AddCircleOutlineRoundedIcon />
        </IconButton>
        {/*Vitals */}
      </Box>
      <Box  
        alignSelf="flex-start"
        display="flex"
        justifyContent="space-between"
        margin={theme.spacing(3)}
      >
                            <div style = {{display : "flex", alignItems: "center"}}>

        <Medication />
        {BUTTON_LABELS.MEDICATIONS}
        </div>

        <IconButton sx={{ p: 0 }} display="flex">
          <AddCircleOutlineRoundedIcon />
        </IconButton>
        {/*Vitals */}
      </Box>
      </React.Fragment>

    )}
