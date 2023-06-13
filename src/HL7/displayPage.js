import React, { useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { EPIC_XCHANGE_ENDPOINT } from '../core-utils/constants';
import { getSourceUrl } from '../Patient/service/service';
import { Helper } from '../core-utils/helper';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { ADTMessage, DFTMessage, MDMMessage, ORMMessage, SIUMessage } from './defaultMessages';

const options = [
  {
    value: 'ADT',
    label: 'ADT'
  },
  {
    value: 'MDM',
    label: 'MDM'
  },  {
    value: 'ORM',
    label: 'ORM'
  },  {
    value: 'SIU',
    label: 'SIU'
  },  {
    value: 'DFT',
    label: 'DFT'
  },
]


const HL7DisplayPage = () => {
  const [textBoxValue, setTextBoxValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const handleButtonClick = () => {
    setIsLoading(true); // Set loading state to true

    // Perform API call using Axios
    axios
      .post(
        `${EPIC_XCHANGE_ENDPOINT}/api/v1/convert/hl7`,
        { data: textBoxValue },
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            'x-source-id': localStorage.getItem("XCALIBER_TOKEN"),
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false); // Set loading state to false after API call is done
      });
  };

  const handleTextBoxChange = (event) => {
    setTextBoxValue(event.target.value);
  };

  const getMessage = (type) => {
    switch(type) {
      case 'ADT' : 
        return ADTMessage
      case 'MDM' : 
        return MDMMessage
      case 'ORM' : 
        return ORMMessage
      case 'DFT' : 
        return DFTMessage
      case 'SIU' : 
        return SIUMessage
      default:
        return ''
    }
  }

  const onChangeMessageType = (event) => {
    setTextBoxValue(getMessage(event.target.value));
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
      <InputLabel id="select-label" variant='body'>Choose a message type</InputLabel>
      <Select
        labelId="select-label"
        value={selectedOption}
        onChange={onChangeMessageType}
        style={{width : "500px"}}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        width="70%"
        overflow="auto"
        marginBottom="16px"
      >
        <TextField
          value={textBoxValue}
          onChange={handleTextBoxChange}
          multiline
          rows={12}
          variant="outlined"
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleButtonClick}
          style={{ alignSelf: 'flex-end', marginTop: "8px" }}
          disabled={isLoading} // Disable the button while loading
        >
          {isLoading ? <CircularProgress size={24} /> : 'Submit'} {/* Show loading spinner or "Submit" text */}
        </Button>
      </Box>
    </Box>
  );
};

export default HL7DisplayPage;
