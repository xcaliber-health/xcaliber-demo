import React from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { DEPARTMENTS } from "../../core-utils/constants";

interface DepartmentSelectorProps {
  departmentId: string;
  setDepartmentId: (value: string) => void;
}

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({
  departmentId,
  setDepartmentId,
}) => {
  const handleDepartmentChange = (e: any) => {
    setDepartmentId(e.target.value);
    localStorage.setItem(`DEPARTMENT_ID`, e.target.value);
    localStorage.setItem(
      `DEPARTMENT_TIMEZONE`,
      DEPARTMENTS.find((dep) => dep?.departmentid === e.target.value)
        ?.timezonename || ""
    );
    window.location.reload();
  };

  return (
    <FormControl sx={{ m: 1, width: 300 }}>
      <InputLabel>DepartmentId</InputLabel>
      <Select
        input={<OutlinedInput label='DepartmentId' />}
        value={localStorage.getItem(`DEPARTMENT_ID`) || departmentId}
        sx={{ height: 40 }}
        onChange={handleDepartmentChange}
        variant='outlined'
      >
        {DEPARTMENTS.map((dept) => (
          <MenuItem key={dept?.departmentid} value={dept.departmentid}>
            {`${dept?.patientdepartmentname}  (${dept?.departmentid})`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DepartmentSelector;
