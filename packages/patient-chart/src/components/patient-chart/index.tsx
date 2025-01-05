"use client";

import PatientTable from "../PatientTable/PatientTable";
import SourceSelector from "../SourceSelector";
import DepartmentSelector from "../DepartmentSelector";
import { Box } from "@mui/material";
import { useState, useEffect, ChangeEvent } from "react";
import { SOURCE_CONFIG, SourceType } from "../../core-utils/constants";

function PatientChartComponent() {
  const [sourceState, setSourceState] = useState<SourceType>(
    (localStorage.getItem("XCALIBER_SOURCE") as SourceType) || "ELATION"
  );
  const [departmentId, setDepartmentId] = useState<string>(
    SOURCE_CONFIG.ATHENA.departmentId
  );

  const updateLocalStorage = (source: SourceType, deptId?: string) => {
    const config = SOURCE_CONFIG[source];
    localStorage.setItem("XCALIBER_SOURCE", source);
    localStorage.setItem("XCALIBER_TOKEN", config.token || "");
    localStorage.setItem("DEPARTMENT_TIMEZONE", config.timezone);
    localStorage.setItem("DEPARTMENT_ID", deptId || config.departmentId);
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newSource = event.target.value as SourceType;
    updateLocalStorage(newSource, newSource === "ATHENA" ? departmentId : "");
    window.location.reload();
  };

  useEffect(() => {
    const savedSource = localStorage.getItem("XCALIBER_SOURCE") as SourceType;
    const source = savedSource || "ELATION";
    updateLocalStorage(source);
    setSourceState(source);
  }, []);

  return (
    <div>
      <Box display='flex' justifyContent='center' alignItems='center'>
        {localStorage.getItem("XCALIBER_SOURCE") === "ATHENA" && (
          <DepartmentSelector
            departmentId={departmentId}
            setDepartmentId={setDepartmentId}
          />
        )}
        <Box sx={{ margin: 0, padding: 0 }} display='flex'>
          <SourceSelector
            sourceState={sourceState}
            handleSelectChange={handleSelectChange}
          />
        </Box>
      </Box>
      <PatientTable />
    </div>
  );
}

export default PatientChartComponent;
