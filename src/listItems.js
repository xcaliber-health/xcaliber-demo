import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/Code';
import PeopleIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { style } from '@mui/system';



export const mainListItems = (onClick,id,classColor) => (
  <React.Fragment>
  <ListItemButton onClick={() => {onClick("terminology",1)}} selected={id===1?classColor:""} >
    <ListItemIcon>
      <DashboardIcon />
    </ListItemIcon>
    <ListItemText primary="Terminology APIs" />
  </ListItemButton>
  <ListItemButton onClick={() => {onClick("interop",2)}}  selected={id===2?classColor:""}>
    <ListItemIcon>
      <ShoppingCartIcon />
    </ListItemIcon>
    <ListItemText primary="Interop APIs" />
  </ListItemButton>
  <ListItemButton onClick={() => {onClick("p360",3)}}  selected={id===3?classColor:""}>
    <ListItemIcon>
      <PeopleIcon />
    </ListItemIcon>
    <ListItemText primary="P360" />
  </ListItemButton>
  <ListItemButton onClick={() => {onClick("analytics",4)}}  selected={id===4?classColor:""}>
    <ListItemIcon>
      <BarChartIcon />
    </ListItemIcon>
    <ListItemText primary="Analytics" />
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
