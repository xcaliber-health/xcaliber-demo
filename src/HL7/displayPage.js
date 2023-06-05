import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import { BLITZ_XCHANGE_ENDPOINT } from "../core-utils/constants";

const HL7DisplayPage = () => {
  const [textBoxValue, setTextBoxValue] = useState("");

  const handleButtonClick = () => {
    // Perform API call using Axios
    axios
      .post(
        `${BLITZ_XCHANGE_ENDPOINT}/api/v1/convert/hl7`,
        { data: textBoxValue },
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            'x-source-id': `${process.env.REACT_APP_EPIC_XSOURCEID}`
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleTextBoxChange = (event) => {
    setTextBoxValue(event.target.value);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-evenly"
      alignItems="center"
      height="50vh"
      width="80vw"
    >
      <Typography variant="h5" gutterBottom fontWeight="bold">
        HL7 Message
      </Typography>
      <TextField
        value={textBoxValue}
        onChange={handleTextBoxChange}
        multiline
        rows={12}
        variant="outlined"
        style={{ width: "70%", overflow: "auto" }}
      />
      <Button
        variant="contained"
        onClick={handleButtonClick}
        style={{ width: "10%" }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default HL7DisplayPage;
