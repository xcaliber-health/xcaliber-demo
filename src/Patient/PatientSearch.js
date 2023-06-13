import { TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useState } from "react";

const PatientSearchInput = (props) => {
  const { onChange } = props;

  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);

  useEffect(() => {
    onChange({
      queryString: debouncedSearchText,
    });
  }, [debouncedSearchText, onChange]);

  const onSearchBoxChange = (event) => {
    const queryString = event.currentTarget.value;
    setSearchText(queryString);
  };

  return (
    <TextField
      id="outlined-basic"
      label="search"
      variant="standard"
      InputProps={{endAdornment: <SearchIcon></SearchIcon>}}
      onChange={onSearchBoxChange}
      sx={{ width: "100%" }}
      value={searchText}
      placeholder={"search by name"}
    />
  );
};

export function useDebounce(value, delayInMilliseconds) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const debounceHandler = setTimeout(
      () => setDebouncedValue(value),
      delayInMilliseconds
    );

    return () => clearTimeout(debounceHandler);
  }, [value, delayInMilliseconds]);

  return debouncedValue;
}

export default PatientSearchInput;
