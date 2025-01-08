import { useState } from "react";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Grid from "@mui/material/Grid";

const PatientRightView = ({ tabContentList }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const handleChange = (event, value) => {
    setActiveTab(value);
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTabs-flexContainer": {
              gap: 1,
            },
            "& .Mui-selected": {
              backgroundColor: "var(--mui-palette-primary-main) !important",
              color: "var(--mui-palette-primary-contrastText) !important",
              boxShadow: "var(--mui-customShadows-xs)",
            },
            "& .MuiTab-root": {
              minHeight: 38,
              padding: (theme) => theme.spacing(2, 5.5),
              borderRadius: "var(--mui-shape-borderRadius)",
              backgroundColor: "transparent", // No background for the tabs
              "&:hover": {
                border: 0,
                backgroundColor: "var(--mui-palette-primary-lightOpacity)",
              },
              "&.Mui-selected": {
                backgroundColor: "var(--mui-palette-primary-main)", // Modify selected tab background
              },
            },
            "& .MuiTabs-indicator": {
              display: "none",
            },
          }}
        >
          {tabContentList.map((tab, index) => (
            <Tab key={index} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </Grid>
      <Grid item xs={12}>
        {tabContentList.find((tab) => tab.value === activeTab)?.content}
      </Grid>
    </Grid>
  );
};

export default PatientRightView;
