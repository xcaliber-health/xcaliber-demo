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
import GroupsIcon from "@mui/icons-material/Groups";
import NearMeIcon from "@mui/icons-material/NearMe";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { Box } from "@mui/material";
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import AssignmentIcon from "@mui/icons-material/Assignment";

export const mainListItems = (onClick, id, classColor) => (
  <React.Fragment>
    <Box
      display="flex"
      flexDirection="column"
      // justifyContent="space-evenly"
      // alignItems="space-evenly"
      width="100%"
      marginTop="50%"
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent={"center"}
        alignItems="center"
      >
        <ListItemButton
          onClick={() => {
            onClick("provider_directory", 1);
          }}
          selected={id === 1 ? classColor : ""}
          sx={{ width: "100%" }}
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent={"center"}
            alignItems="center"
            width="100%"
          >
            <ListItemIcon
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <PermContactCalendarIcon style={{color: "white"}}></PermContactCalendarIcon>
            </ListItemIcon>
            <ListItemText
              primary="Provider Directory"
              sx={{ color: "white" }}
            />
          </Box>
        </ListItemButton>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent={"center"}
        alignItems="center"
      >
        <ListItemButton
          onClick={() => {
            onClick("p360", 2);
          }}
          selected={id === 2 ? classColor : ""}
          sx={{ width: "100%" }}
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent={"center"}
            alignItems="center"
            width="100%"
          >
            <ListItemIcon
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <GroupsIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="Patient Panel" sx={{ color: "white" }} />
          </Box>
        </ListItemButton>
      </Box>

      {/* <Box
        display="flex"
        flexDirection="column"
        justifyContent={"center"}
        alignItems="center"
      >
        <ListItemButton
          onClick={() => {
            onClick("p360", 3);
          }}
          selected={id === 3 ? classColor : ""}
          sx={{ width: "100%" }}
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent={"center"}
            alignItems="center"
            width="100%"
          >
            <ListItemIcon
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <PeopleIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="Patient-360" sx={{ color: "white" }} />
          </Box>
        </ListItemButton>
      </Box> */}

      <Box
        display="flex"
        flexDirection="column"
        justifyContent={"center"}
        alignItems="center"
      >
        <ListItemButton
          onClick={() => {
            onClick("terminology", 4);
          }}
          selected={id === 4 ? classColor : ""}
          sx={{ width: "100%" }}
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent={"center"}
            alignItems="center"
            width="100%"
          >
            <ListItemIcon
              color="red"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <DashboardIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="Terminology-Hub" sx={{ color: "white" }} />
          </Box>
        </ListItemButton>
      </Box>

      {/* <Box
        display="flex"
        flexDirection="column"
        justifyContent={"center"}
        alignItems="center"
      >
        <ListItemButton
          onClick={() => {
            onClick("service_desk", 5);
          }}
          selected={id === 5 ? classColor : ""}
          sx={{ width: "100%" }}
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent={"center"}
            alignItems="center"
            width="100%"
          >
            <ListItemIcon
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <SupportAgentIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="Service Desk" sx={{ color: "white" }} />
          </Box>
        </ListItemButton>
      </Box> */}

      <Box
        display="flex"
        flexDirection="column"
        justifyContent={"center"}
        alignItems="center"
        width="100%"
      >
        <ListItemButton
          onClick={() => {
            onClick("hl7", 6);
          }}
          selected={id === 6 ? classColor : ""}
          sx={{ width: "100%" }}
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent={"center"}
            alignItems="center"
            width="100%"
          >
            <ListItemIcon
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <BuildIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="Workflow Simulator" sx={{ color: "white" }} />
          </Box>
        </ListItemButton>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent={"center"}
        alignItems="center"
        width="100%"
      >
        <ListItemButton
          onClick={() => {
            onClick("simulator", 7);
          }}
          selected={id === 7 ? classColor : ""}
          sx={{ width: "100%" }}
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent={"center"}
            alignItems="center"
            width="100%"
          >
            <ListItemIcon
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <NearMeIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="Data Navigator" sx={{ color: "white" }} />
          </Box>
        </ListItemButton>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent={"center"}
        alignItems="center"
      >
        <ListItemButton
          onClick={() => {
            onClick("documentation", 8);
          }}
          selected={id === 8 ? classColor : ""}
          sx={{ width: "100%" }}
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent={"center"}
            alignItems="center"
            width="100%"
          >
            <ListItemIcon
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <ShoppingCartIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="API Documentation" sx={{ color: "white" }} />
          </Box>
        </ListItemButton>
      </Box>
    </Box>
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
