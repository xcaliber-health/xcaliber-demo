import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select,Box } from '@mui/material';

const options = [
    {
      value: 'https://docs.xcaliberapis.com/apireference/management/',
      label: 'Management API'
    },
    {
      value: 'https://docs.xcaliberapis.com/apireference/xchangeapis/',
      label: 'FHIR++ API'
    },  {
      value: 'https://eventing-xcaliberapis.redoc.ly/',
      label: 'Event API'
    },  {
      value: 'https://directory-service.redoc.ly/',
      label: 'XHO API'
    }
  ]

const HL7DisplayPage = () => {
  const [textBoxValue, setTextBoxValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0].value);
  const onServiceChange = (event) => {
    setSelectedOption(event.target.value)
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-evenly"
      alignItems="left"
      width="80vw"
    >
      <FormControl>
      <InputLabel id="select-label" variant='body'>Choodse a documentation</InputLabel>
      <Select
        labelId="select-label"
        value={selectedOption}
        onChange={onServiceChange}
        style={{width : "500px"}}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <br></br>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        overflow="auto"
        marginBottom="16px"
        height="60vh"

      >
        <iframe
                  src={selectedOption}
                  style={{ width: "100%", height: "1500px" }}
                ></iframe>
      </Box>
    </Box>
  );
};

export default HL7DisplayPage;
