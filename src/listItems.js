import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/Code";
import PeopleIcon from "@mui/icons-material/Person";
import BarChartIcon from "@mui/icons-material/BarChart";
import BuildIcon from "@mui/icons-material/Build";
import LayersIcon from "@mui/icons-material/Layers";
import GroupsIcon from '@mui/icons-material/Groups';
import NearMeIcon from '@mui/icons-material/NearMe';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AssignmentIcon from "@mui/icons-material/Assignment";

export const mainListItems = (onClick, id, classColor) => (
  <React.Fragment>
    <ListItemButton
      onClick={() => {
        onClick("provider_directory", 1);
      }}
      selected={id === 1 ? classColor : ""}
    >
      <ListItemIcon>
        <BuildIcon style={{ color: "white", fontWeight: "bolder" }} />
      </ListItemIcon>
      <ListItemText primary="Provider Directory" sx={{ color: "white" }} />
    </ListItemButton>

     <ListItemButton
      onClick={() => {
        onClick("p360", 2);
      }}
      selected={id === 2 ? classColor : ""}
    >
      <ListItemIcon>
        <GroupsIcon style={{ color: "white" }} />
      </ListItemIcon>
      <ListItemText primary="Patient Panel" sx={{ color: "white" }} />
    </ListItemButton> 


    <ListItemButton
      onClick={() => {
        onClick("p360", 3);
      }}
      selected={id === 3 ? classColor : ""}
    >
      <ListItemIcon>
        <PeopleIcon style={{ color: "white" }} />
      </ListItemIcon>
      <ListItemText primary="Patient-360" sx={{ color: "white" }} />
    </ListItemButton>

    <ListItemButton
      onClick={() => {
        onClick("terminology", 4);
      }}
      selected={id === 4 ? classColor : ""}
    >
      <ListItemIcon color="red">
        <DashboardIcon style={{ color: "white" }} />
      </ListItemIcon>
      <ListItemText primary="Terminology-Hub" sx={{ color: "white" }}/>
    </ListItemButton>

    <ListItemButton
      onClick={() => {
        onClick("service_desk", 5);
      }}
      selected={id === 5 ? classColor : ""}
    >
      <ListItemIcon>
        <SupportAgentIcon style={{ color: "white" }} />
      </ListItemIcon>
      <ListItemText primary="Service Desk" sx={{ color: "white" }} />
    </ListItemButton>


    <ListItemButton
      onClick={() => {
        onClick("hl7", 6);
      }}
      selected={id === 6 ? classColor : ""}
    >
      <ListItemIcon>
        <BuildIcon style={{ color: "white" }} />
      </ListItemIcon>
      <ListItemText primary="Simulator" sx={{ color: "white" }} />
    </ListItemButton>
  
    <ListItemButton
      onClick={() => {
        onClick("interop", 7);
      }}
      selected={id === 7 ? classColor : ""}
    >
      <ListItemIcon>
        <NearMeIcon style={{ color: "white" }} />
      </ListItemIcon>
      <ListItemText primary="Data Navigator" sx={{ color: "white" }} />
    </ListItemButton>

    <ListItemButton
      onClick={() => {
        onClick("documentation", 8);
      }}
      selected={id === 8 ? classColor : ""}
      display="block"
      flexDirection="column"
    >
      <ListItemIcon>
        <ShoppingCartIcon style={{ color: "white" }} />
      </ListItemIcon>
      <ListItemText primary="API Documentation" sx={{ color: "white" }} />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
  </React.Fragment>
);
