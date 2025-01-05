import React from 'react';
import { Select, MenuItem, FormControl } from '@mui/material';

interface SourceSelectorProps {
  sourceState: string;
  handleSelectChange: (event: any) => void;
}

const SourceSelector: React.FC<SourceSelectorProps> = ({ sourceState, handleSelectChange }) => {
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <Select
        onChange={handleSelectChange}
        value={sourceState}
        placeholder="Select Source"
        sx={{ height: 40 }}
      >
        <MenuItem value="ELATION">Elation</MenuItem>
        <MenuItem value="ATHENA">Athena</MenuItem>
        <MenuItem value="EPIC">Epic</MenuItem>
        <MenuItem value="ECW">eCW</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SourceSelector;
