import {
    Divider,
    Drawer,
    Grid,
    Typography,
} from "@mui/material";
import { Button, TextField, Box } from "@mui/material";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { SevereColdOutlined } from "@mui/icons-material";
import { Autocomplete } from "@mui/material";
import { ReferenceDataService } from "../../services/P360/referenceDataService";
const useStyles = makeStyles(() => (
    {
        // typography:
        // {
        //     paddingTop: "20px",
        //     paddingRight: "5px",
        //     paddingLeft: "5px"
        // }
    }))

export default function Allergy({
    onCancelClick,
    handleAllergyClick,
    onAllergyChange,
    onSeverityChange,
    onStatusChange,
    onReactionChange,
    onDateChange,
    severity,
    allergyPayload,
    status,
    allergyOptions,
    updateOptions,
    initializeAllergyOptions

}) {
    const classes = useStyles();
    const [value, setValue] = React.useState(null);
    useEffect(() => {
        if (value) {
            const dateObject = new Date(value);
            onDateChange(
                `${dateObject.getFullYear()}-${dateObject.getMonth() + 1
                }-${dateObject.getDate()}`
            );
        }
    }, [value]);
    // useEffect(() => {
    //     Promise.all([initializeAllergyOptions()]);
    //   }, []);
    return (
        <React.Fragment>
            <Grid>
                <Typography variant="h5" sx={{ marginBottom: "20px" }}>Add Patient Allergy</Typography>
            </Grid>
            <Divider></Divider>
            <Grid display="flex">
                <Typography sx={{ marginTop: "13px", marginRight: "31px", marginBottom: "30px" }}>Allergy:</Typography>
                <Autocomplete
                    sx={{ width: "100%" }}
                    id="combo-box-demo"
                    options={allergyOptions}
                    getOptionLabel={(option) => {
                        return `${option?.Concept_Code_2} (${option?.Concept_Name_2})`;
                    }}
                    onChange={(e, v) => {
                        if (v && v !== "" && v !== null) {
                            onAllergyChange(v?.Concept_Name_2);
                        }
                    }}
                    renderInput={(params) => (
                        <TextField sx={{ width: "100%" }}
                            {...params}
                            label="Allergy"
                            onChange={(ev) => {
                                if (ev.target.value !== "" || ev.target.value !== null) {
                                    updateOptions(ev.target.value);
                                }
                                // onAllergyChange(ev.target.value);

                            }}
                        />
                    )}
                />
                {/* <TextField sx={{ width: "100%" }}
                    label={"Allergy"}
                    required
                    onChange={(e) => {
                        onAllergyChange(e.target.value);
                    }} /> */}
            </Grid>
            <Grid display="flex">
                <Typography sx={{ marginTop: "13px", marginRight: "17px" }}>Reaction:</Typography>
                <TextField sx={{ width: "100%" }}
                    label={"Reaction..."}
                    onChange={(e) => {
                        onReactionChange(e.target.value);
                    }} />
            </Grid>
            {/* <Grid display="flex">
                <Typography sx={{ marginTop: "10px", marginBottom: "10px", marginRight: "50px" }}>Reaction_Code:</Typography>
                <TextField sx={{ width: "100%" }}
                    label={"Reaction Snomed Code"}
                    onChange={(e) => {
                        onReactionCodeChange(e.target.value);
                    }} />
            </Grid> */}
            <Grid sx={{ paddingTop: "20px" }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Severity:</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={severity}
                        label="Severity"
                        onChange={(e) => {
                            onSeverityChange(e.target.value);
                        }}
                    >
                        <MenuItem value={"unknown"}>unknown</MenuItem>
                        <MenuItem value={"mild"}>mild</MenuItem>
                        <MenuItem value={"moderate"}>moderate</MenuItem>
                        <MenuItem value={"severe"}>severe</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid sx={{ paddingTop: "20px", paddingBottom: "20px" }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Status:</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={status}
                        label="Status"
                        onChange={(e) => { onStatusChange(e.target.value) }}
                    >
                        <MenuItem value={'Active'}>Active</MenuItem>
                        <MenuItem value={'Inactive'}>Inactive</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            <Grid display="flex">
                <Typography sx={{ paddingTop: "20px" }}>Onset Date:</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                        label="Date"
                        inputFormat="YYYY-MM-DD"
                        value={value}
                        onChange={(newValue) => {
                            setValue(newValue);
                        }}
                        // onChange={(e)=>{onDateChange(e.target.value)}}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </Grid>
            <Box sx={{ display: "flex", width: "100%", padding: '8px 0px 8px 0px', justifyContent: "flex-end" }}>
                <Button variant="contained" onClick={() => { handleAllergyClick(allergyPayload) }} sx={{ marginRight: "10px" }}>
                    Create Allergy
                </Button>
                <Button onClick={onCancelClick} variant="contained">
                    Cancel
                </Button>
            </Box>
        </React.Fragment>
    );
}