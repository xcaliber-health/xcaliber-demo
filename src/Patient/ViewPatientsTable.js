import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/system";
import { getPatientsAtPage } from "./service/service";
import Loading from "./Loading";
import { formatDate } from "../core-utils/formatDate";
// import usePatients from '../hooks/usePatients'
// import PatientSearchRequest from '../models/PatientSearchRequest'
// import NoPatientsExist from './NoPatientsExist'
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
const ViewPatientsTable = (props) => {
  const { searchRequest } = props;
  const navigate = useNavigate();
  const theme = useTheme();
  //   const { data, status } = usePatients(searchRequest)
  const [awaitd, setAwait] = useState(true);
  const [newData, setNewData] = useState({
    patients: [],
    totalCount: 0,
  });

  const func = async () => {
    setAwait(true);
    const d = await getPatientsAtPage(props.page, searchRequest.queryString);
    // const newData =await parserFunc(d.data.entry)
    // console.log('parsedFuncdata', newData)
    // console.log('parsedFunc', newData)
    let mock = { patients: d, totalCount: d.length };

    setNewData(mock);
    setAwait(false);
  };

  useEffect(() => {
    func();
  }, [props.page, searchRequest]);

  if (awaitd) {
    return (
      <div
        style={{
          height: "200px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loading />
      </div>
    );
  }

  if (newData.totalCount === 0) {
    return <div />;
  }
  console.log(newData)
  return (
    <TableContainer component={Paper} style={{ marginTop: theme.spacing(3) }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">
              <Typography>name</Typography>
            </TableCell>
            <TableCell align="left">
              <Typography>gender</Typography>
            </TableCell>
            <TableCell align="left">
              <Typography>date of birth</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {newData.patients.map((patient) => (
            <TableRow
              onClick={() => {
                navigate("/p360/" + patient.code);
              }}
              key={patient.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              style={{ cursor: "pointer" }}
            >
              <TableCell align="left">
                <Typography color = "primary">
                  {patient.familyName} {patient.givenName}
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography>{ patient?.extension?.find((extension) => {
                  return (
                    extension?.url ===
                    "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex"
                  );
                })?.valueCode}</Typography>
              </TableCell>
              <TableCell align="left" component="th" scope="row">
                <Typography>{formatDate(patient.dateOfBirth)}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ViewPatientsTable;
