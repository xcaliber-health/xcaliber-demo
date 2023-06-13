import * as React from "react";
import { styled, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsSharpIcon from "@mui/icons-material/SettingsSharp";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { mainListItems } from "./listItems";
import Chart from "./Chart";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Terminology from "./Terminology";
import ViewPatients from "./Patient/ViewPatients";
import Analytics from "./Analytics";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import { FormControl } from "@mui/material";
import {
  Avatar,
  Button,
  Dialog,
  Radio,
  FormControlLabel,
  RadioGroup,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
} from "@mui/material";
import Watermark from "./Watermark";
import { makeStyles } from "@material-ui/styles";
import { useTheme } from "@mui/system";
import { DEPARTMENTS } from "./core-utils/constants";
import HL7DisplayPage from "./HL7/displayPage";

const useStyles = makeStyles({
  root: {
    "& .Mui-selected": {
      backgroundColor: "grey",
    },
  },
});
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer - 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

function DashboardContent() {
  const theme = useTheme();
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [sourceState, setSourceState] = React.useState("");
  const [departmentId, setDepartmentId] = React.useState(`150`);
  const [isModalOpen, setIsModalOpen] = React.useState();
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = React.useState();
  const dispatch = useDispatch();
  // const [source, setSource] = React.useState(null);
  const [id, setId] = React.useState(0);
  const navigate = useNavigate();
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const onMenuClick = (path, id) => {
    setId(id);
    navigate(`/${path}`);
  };

  const setLocalStorageContext = () => {
    if (localStorage.getItem("XCALIBER_SOURCE") === "ELATION") {
      localStorage.setItem("XCALIBER_SOURCE", `ELATION`);
      localStorage.setItem(
        "XCALIBER_TOKEN",
        `${process.env.REACT_APP_XSOURCEID}`
      );
      setSourceState("ELATION");
    } else if (localStorage.getItem("XCALIBER_SOURCE") === "ATHENA") {
      localStorage.setItem("XCALIBER_SOURCE", `ATHENA`);
      localStorage.setItem(
        "XCALIBER_TOKEN",
        `${process.env.REACT_APP_ATHENA_XSOURCEID}`
      );
     setSourceState("ATHENA");
    } else if(localStorage.getItem("XCALIBER_SOURCE") === "EPIC") {
      localStorage.setItem("XCALIBER_SOURCE", `EPIC`);
      localStorage.setItem(
        "XCALIBER_TOKEN",
        `${process.env.REACT_APP_EPIC_XSOURCEID}`
      );
      setSourceState("EPIC");
    }
    else if(localStorage.getItem("XCALIBER_SOURCE") === "ECW") {
      localStorage.setItem("XCALIBER_SOURCE", `ECW`);
      localStorage.setItem(
        "XCALIBER_TOKEN",
        `${process.env.REACT_APP_ECW_XSOURCEID}`
      );
      setSourceState("ECW");
    } 
    else {
      localStorage.setItem("XCALIBER_SOURCE", `ELATION`);
      localStorage.setItem(
        "XCALIBER_TOKEN",
        `${process.env.REACT_APP_XSOURCEID}`
      );
      setSourceState("ELATION");
    }
    if (localStorage.getItem(`XCALIBER_SOURCE`) === "ELATION")
      localStorage.setItem(`DEPARTMENT_TIMEZONE`, `America/Los_Angeles`);
  };

  React.useEffect(() => {
    setLocalStorageContext();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="absolute"
        open={open}
        style={{
          background: "linear-gradient(to right,#1D5D9E, #2D93AC,#3DC6B8)",
        }}
      >
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Grid justifyContent="space-between" direction="flex" container>
            <Box display="flex" alignItems={"center"}>
              <Typography variant="h5">xcaliber Capabilities Demo</Typography>
              <Typography
                variant="body2"
                sx={{ paddingLeft: "24px", paddingRight: theme.spacing(4) }}
              >
                {" "}
                Do not add any real PII/PHI data here.
              </Typography>
              <Typography variant="body2">Sandbox in use</Typography>
            </Box>
            <Dialog direction="column" open={isModalOpen}>
              <Grid
                container
                sx={{ width: theme.spacing(60), height: theme.spacing(30) }}
                direction={"column"}
                padding={1}
              >
                <Grid item>
                  <Typography>Switch data source</Typography>
                </Grid>
                <Grid item>
                  <RadioGroup
                    onChange={(e) => {
                      setSourceState(e.target.value);
                      localStorage.setItem("DEPARTMENT_ID", `150`);
                    }}
                    pt={2}
                  >
                    <FormControlLabel
                      value="ELATION"
                      control={<Radio />}
                      label="Elation"
                    />
                    <FormControlLabel
                      value="ATHENA"
                      control={<Radio />}
                      label="Athena"
                    />
                    <FormControlLabel
                      value="EPIC"
                      control={<Radio />}
                      label="Epic"
                    />
                    <FormControlLabel
                      value="ECW"
                      control={<Radio />}
                      label="eCW"
                    />
                  </RadioGroup>
                </Grid>
                <Grid
                  paddingLeft={0}
                  marginLeft={0}
                  container
                  item
                  justifyContent={"space-evenly"}
                >
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => {
                      localStorage.setItem("XCALIBER_SOURCE", sourceState);
                      localStorage.setItem(
                        "XCALIBER_TOKEN",
                        sourceState === "ELATION"
                          ? `${process.env.REACT_APP_XSOURCEID}`
                          : `${process.env.REACT_APP_ATHENA_XSOURCEID}`
                      );
                      if (
                        localStorage.getItem(`XCALIBER_SOURCE`) === "ELATION"
                      ) {
                        localStorage.setItem(
                          `DEPARTMENT_TIMEZONE`,
                          `America/Los_Angeles`
                        );
                      } else if (
                        localStorage.getItem(`XCALIBER_SOURCE`) === "ATHENA"
                      ) {
                        localStorage.setItem(`DEPARTMENT_ID`, departmentId);
                        localStorage.setItem(
                          `DEPARTMENT_TIMEZONE`,
                          `America/New_York`
                        );
                      }
                      else if (
                        localStorage.getItem(`XCALIBER_SOURCE`) === "EPIC"
                      ) {
                        localStorage.setItem(`DEPARTMENT_ID`, '');
                        localStorage.setItem(
                          `DEPARTMENT_TIMEZONE`,
                          `America/New_York`
                        );
                      }
                      else if (
                        localStorage.getItem(`XCALIBER_SOURCE`) === "ECW"
                      ) {
                        localStorage.setItem(`DEPARTMENT_ID`, '');
                        localStorage.setItem(
                          `DEPARTMENT_TIMEZONE`,
                          `America/New_York`
                        );
                      }
                      setIsModalOpen(false);
                      navigate("/p360");
                      window.location.reload();
                    }}
                  >
                    Submit
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => {
                      setIsModalOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Dialog>
            {localStorage.getItem("XCALIBER_SOURCE") === "ATHENA" && (
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel>DepartmentId</InputLabel>
                <Select
                  input={<OutlinedInput label="DepartmentId" />}
                  value={localStorage.getItem(`DEPARTMENT_ID`)}
                  sx={{ height: 30 }}
                  onChange={(e) => {
                    setDepartmentId(e.target.value);
                    localStorage.setItem(`DEPARTMENT_ID`, e.target.value);
                    localStorage.setItem(
                      `DEPARTMENT_TIMEZONE`,
                      DEPARTMENTS.find((dep) => {
                        return dep?.departmentid === e.target.value;
                      })?.timezonename
                    );
                    window.location.reload();
                  }}
                >
                  {DEPARTMENTS.map((dept) => (
                    <MenuItem
                      key={dept?.departmentid}
                      value={dept.departmentid}
                      label={`${dept?.patientdepartmentname}  (${dept?.departmentid})`}
                    >
                      {`${dept?.patientdepartmentname}  (${dept?.departmentid})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {localStorage.getItem("XCALIBER_SOURCE") === "ATHENA" ? (
              <Link
                sx={{
                  color: "black",
                  marginTop: theme.spacing(1),
                  marginLeft: theme.spacing(20),
              
                }}
                href="https://xcaliberapis.redoc.ly"
                target="_blank"
              >
                Documentation
              </Link>
            ) : (
              <Link
                sx={{
                  color: "black",
                  marginTop: theme.spacing(3),
                  marginLeft: theme.spacing(70),
                }}
                href="https://xcaliberapis.redoc.ly"
                target="_blank"
              >
                Documentation
              </Link>
            )}
            <Box sx={{ margin: 0, padding: 0 }} display="flex">
              <IconButton
                sx={{ color: "black", marginRight: theme.spacing(1) }}
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                <SettingsSharpIcon color="action" />
              </IconButton>
              <Avatar></Avatar>
            </Box>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        style={{ background: "#D6FFFD" }}
        PaperProps={{ style: { background: "#D6FFFD" } }}
        SlideProps={{ style: { color: "#185DA0" } }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
          style={{ background: "#D6FFFD" }}
        >
          <IconButton onClick={toggleDrawer}>
            {open && (
              <Typography
                variant="h5"
                style={{ display: "inline-block" }}
              ></Typography>
            )}
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          {mainListItems(onMenuClick, id, classes.root)}
          {/* <Divider sx={{ my: 1 }} />
                {secondaryListItems} */}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
        style={{ background: "#F2F2F2" }}
      >
        <Toolbar />
        <Container
          maxWidth="xl"
          sx={{ mt: 4, mb: 4 }}
          style={{ background: "#F2F2F2" }}
          height="100%"
        >
          <Routes>
            <Route path="terminology" element={<Terminology />} />
            <Route
              path="interop"
              element={
                <iframe
                  src="https://docs.xcaliberapis.com/apireference/xchangeapis"
                  style={{ width: "100%", height: "1500px" }}
                >
                  {" "}
                </iframe>
              }
            />
            <Route path="p360" element={<ViewPatients />} />
            <Route path="p360/:id" element={<Chart />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="hl7" element={<HL7DisplayPage />} />
          </Routes>
          <Watermark />
        </Container>
      </Box>
    </Box>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
