import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const ViewPatientsTable = (props) => {
  const { searchRequest } = props;
  const navigate = useNavigate();
  //   const { data, status } = usePatients(searchRequest)
  const [awaitd, setAwait] = useState(true);
  const [newData, setNewData] = useState({
    patients: [],
    totalCount: 0,
  });

  const func = async () => {
    setAwait(true);
    const d = await getPatientsAtPage(props.page, searchRequest.queryString);
    console.log("data", d);
    // const newData =await parserFunc(d.data.entry)
    // console.log('parsedFuncdata', newData)
    // console.log('parsedFunc', newData)
    let mock = { patients: d, totalCount: d.length };
    console.log("mock: ", mock);
    setNewData(mock);
    setAwait(false);
    console.log("data2: ", newData);
  };

  useEffect(() => {
    func();
  }, [props.page, searchRequest]);

  if (awaitd) {
    return <Loading />;
  }

  if (newData.totalCount === 0) {
    return <div />;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">id</TableCell>
            <TableCell align="center">given name</TableCell>
            <TableCell align="center">family name</TableCell>
            <TableCell align="center">sex&nbsp;(g)</TableCell>
            <TableCell align="center">date of birth</TableCell>
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
              <TableCell align="center">{patient.code}</TableCell>
              <TableCell align="center">{patient.givenName}</TableCell>
              <TableCell align="center">{patient.familyName}</TableCell>
              <TableCell align="center">{patient.sex}</TableCell>
              <TableCell align="center" component="th" scope="row">
                {formatDate(patient.dateOfBirth)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ViewPatientsTable;
