import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/Code';
import PeopleIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';
import BuildIcon from '@mui/icons-material/Build';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';



export const mainListItems = (onClick,id,classColor) => (
  <React.Fragment>
  <ListItemButton onClick={() => {onClick("terminology",1)}} selected={id===1?classColor:""} >
    <ListItemIcon color='red'>
      <DashboardIcon style={{color:'#185DA0'}}/>
    </ListItemIcon>
    <ListItemText primary="Terminology-Hub" />
  </ListItemButton>
  <ListItemButton onClick={() => {onClick("interop",2)}}  selected={id===2?classColor:""}>
    <ListItemIcon>
      <ShoppingCartIcon style={{color:'#185DA0'}}/>
    </ListItemIcon>
    <ListItemText primary="Interop APIs" />
  </ListItemButton>
  <ListItemButton onClick={() => {onClick("p360",3)}}  selected={id===3?classColor:""}>
    <ListItemIcon>
      <PeopleIcon style={{color:'#185DA0'}}/>
    </ListItemIcon>
    <ListItemText primary="Patient Longitudinal View" />
  </ListItemButton>
  <ListItemButton onClick={() => {onClick("analytics",4)}}  selected={id===4?classColor:""}>
    <ListItemIcon>
      <BarChartIcon style={{color:'#185DA0'}}/>
    </ListItemIcon>
    <ListItemText primary="Analytics" />
  </ListItemButton>
  <ListItemButton onClick={() => {onClick("hl7",5)}}  selected={id===5?classColor:""}>
    <ListItemIcon>
      <BuildIcon style={{color:'#185DA0'}}/>
    </ListItemIcon>
    <ListItemText primary="HL7" />
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
