import { Grid, Table, TextField, Typography } from "@mui/material";
import * as React from 'react';
import { useTheme } from "@mui/system";
import { useEffect, useState } from "react";
import { APP_MESSAGES, tags } from "../core-utils/constants";
import { TerminologyService, TerminologyTagService } from "../services/Terminology";
import SearchTable from "../Terminology/SearchTable";
import MultipleSelectChip from "./multiSelect";
export default function Terminology() {
  const { TYPING_HEADING } = APP_MESSAGES;
  const [tableData, setTableData] = useState([]);
  const [tagName, setTagName] = useState([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const theme = useTheme();
  const handleMultiChange = async (e) => {
    setTagName(e.target.value);
    setLoading(true);
    const result = await TerminologyTagService.getSnomedResultsByTermAndTag(
      value, e.target.value
    );
    setTableData([result]);
    setLoading(false);
  }

  return (
    <Grid direction={"column"} container width={"100%"} height={`100%`}>
      <Grid item><Typography>{TYPING_HEADING}</Typography></Grid>
      <Grid item display="flex">
        <TextField
          onChange={async (e) => {
            if (e.target.value?.length === 0) {
              setTableData([]);
              setTagName([]);
            } else if (e.target.value?.length >= 3) {
              setValue(e.target.value);
              setLoading(true);
              const result = await TerminologyService.getSnomedResultsByTerm(
                e.target.value
              );
              setTableData([result]);
              setLoading(false);
            }
          }}
          sx={{
            pt: theme.spacing(1),
            pb: theme.spacing(1),
            width: theme.spacing(100),
            height: theme.spacing(8),
          }}
        />
        <MultipleSelectChip options={tags} tagName={tagName} handleChange={handleMultiChange} />

      </Grid>
      {loading && <Grid sx={{ p: "10px" }}>{`Searching`}</Grid>}
      <Grid item>
        <SearchTable tableRowData={tableData} />
      </Grid>
    </Grid>
  );
}
