import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/system";
import { getPatientsAtPage } from "./service/service";
import Loading from "./Loading";
import { formatDate } from "../core-utils/formatDate";
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
  const [awaitd, setAwait] = useState(true);
  const [newData, setNewData] = useState({
    patients: [],
    totalCount: 0,
  });

  const func = async () => {
    setAwait(true);
    const d = await getPatientsAtPage(props.page, searchRequest.queryString);
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

  return (
    <TableContainer
      component={Paper}
      style={{ marginTop: theme.spacing(3)}}
    >
      <Table
        sx={{ minWidth: 650 }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell align="left" color="primary">
              <Typography color="primary" fontWeight={'bold'}>Name</Typography>
            </TableCell>
            <TableCell align="left" color="primary">
              <Typography color="primary" fontWeight={'bold'}>Gender</Typography>
            </TableCell>
            <TableCell align="left" color="primary">
              <Typography color="primary" fontWeight={'bold'}>Date Of Birth</Typography>
            </TableCell>
            <TableCell align="left">
              <Typography color="primary" fontWeight={'bold'}>Email</Typography>
            </TableCell>
            <TableCell align="left">
              <Typography color="primary" fontWeight={'bold'}>City</Typography>
            </TableCell>
            <TableCell align="left">
              <Typography color="primary" fontWeight={'bold'}>State</Typography>
            </TableCell>
            <TableCell align="left">
              <Typography color="primary" fontWeight={'bold'}>Phone</Typography>
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
                <Typography>
                  {patient.familyName} {patient.givenName}
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography>
                  {patient?.gender ??
                    patient?.extension?.find((extension) => {
                      return (
                        extension?.url ===
                        "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex"
                      );
                    })?.valueCode ??
                    patient?.extension?.find((extension) => {
                      return extension?.url?.endsWith("legal-sex");
                    })?.valueCode}
                </Typography>
              </TableCell>
              <TableCell align="left" component="th" scope="row">
                <Typography>{formatDate(patient.dateOfBirth)}</Typography>
              </TableCell>
              <TableCell align="left" component="th" scope="row">
                <Typography>{patient.email}</Typography>
              </TableCell>
              <TableCell align="left" component="th" scope="row">
                <Typography>{formatDate(patient.dateOfBirth)}</Typography>
              </TableCell>
              <TableCell align="left" component="th" scope="row">
                <Typography>{}</Typography>
              </TableCell>
              <TableCell align="left" component="th" scope="row">
                <Typography>{patient.phone}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ViewPatientsTable;
