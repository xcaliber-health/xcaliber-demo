import {
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/system";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'ag-grid-enterprise';
import { useEffect } from "react";
import React, { useCallback, useMemo, useRef, useState } from 'react';
export default function LensTable({ tableRowData, flag }) {
  const gridRef = useRef();
  const theme = useTheme();
  const [allergyData, setAllergyData] = useState([]);
  const [ImmunizationData, setImmunizationData] = useState([]);
  const [familyHistoryData, setFamilyHistoryData] = useState([]);
  const [problemData, setProblemData] = useState([]);
  const [vitalsData, setVitalsData] = useState([]);
  const [procedureData, setProcedureData] = useState([]);
  const [patientData, setPatientData] = useState([]);
  const [k, setK] = useState(0);
  const [columnDefs, setColumnDefs] = useState([
    { field: 'Patient_ID', cellRenderer: 'agGroupCellRenderer' },
    { field: 'Patient.Race' },
    { field: 'Patient.LastName' },
    { field: 'Patient.DOB' },
    { field: 'Patient.City' },
    { field: 'Patient.State' },
    { field: 'Patient.Phone' }
  ]);
  let allergyArray = [];
  let immunizationArray = [];
  let familyHistoryArray = [];
  let problemArray = [];
  let procedureArray = [];
  let vitalsArray = [];
  let patientArray = [];
  useEffect(() => {
    tableRowData.forEach((row) => {
      if (row.Allergies && row.Allergies !== null) {
        allergyArray.push(row);
        setK(1);
      }
      if (row.Immunizations && row.Immunizations !== null) {
        immunizationArray.push(row);
        setK(1);
      }
      if (row.FamilyHistory && row.FamilyHistory !== null) {
        familyHistoryArray.push(row);
        setK(1);

      }
      if (row.Problems && row.Problems !== null) {
        problemArray.push(row);
        setK(1);

      }
      if (row.Procedures && row.Procedures !== null) {
        procedureArray.push(row);
        setK(1);

      }
      if (row.Vitals && row.Vitals !== null) {
        vitalsArray.push(row)
        setK(1);

      }
    })
    setAllergyData(allergyArray);
    setImmunizationData(immunizationArray);
    setVitalsData(vitalsArray);
    setProblemData(problemArray);
    setProcedureData(procedureArray);
    setFamilyHistoryData(familyHistoryArray);
  }, []);
  useEffect(() => {
    tableRowData.forEach((row) => {
      if (k !== 1 && row.Patient) {
        patientArray.push(row);
      }
    })
    setPatientData(patientArray);
  }, []);
  const defaultColDef = (() => {
    return {
      flex: 1,
      alwaysShowHorizontalScroll: true
    };
  }, []);
  const onFirstDataRendered = useCallback((params) => {
    setTimeout(function () {
      gridRef.current.api.getDisplayedRowAtIndex(1).setExpanded(true);
    }, 0);
  }, []);
  const dataCall = (data) => {
    const columnDefs = [];
    var Columns = Object.keys(data);
    Columns.forEach((column) => {
      if (column.value !== null)
        columnDefs.push({ field: column })

    })
    return {
      suppressRowClickSelection: true,
      enableRangeSelection: true,
      pagination: true,
      paginationAutoPageSize: true,
      columnDefs: columnDefs,
      defaultColDef: {
        flex: 1,
      },
    }

  }
  const allergyCall = (data) => {
    return {
      detailGridOptions: dataCall(data),
      getDetailRowData: (params) => {
        params.successCallback(params.data.Allergies);
      },
    };
  }
  const ColumCall = (data) => {
    const columnDefs = [];
    var basicCol = Object.keys(data[0]);
    basicCol.forEach((column) => {
      if (column === 'Patient_ID') {
        columnDefs.push({ field: column, cellRenderer: 'agGroupCellRenderer' })
      }
    })
    if (data.Patient && data.Patient !== {}) {
      var Columns = Object.keys(data[0].Patient);
      Columns.forEach((column) => {
        if (column !== 'Patient_ID') {
          columnDefs.push({ field: `Patient.${column}`, headerName: column })
        }
      })
    }
    return columnDefs;
  }
  const patientColumnCall = (data) => {
    const columnDefs = [];
    var basicCol = Object.keys(data[0]);
    basicCol.forEach((column) => {
      if (column === 'Patient_ID') {
        columnDefs.push({ field: column })
      }
    })
    if (data.Patient !== {}) {
      var Columns = Object.keys(data[0].Patient);
      Columns.forEach((column) => {
        if (column !== 'Patient_ID') {
          columnDefs.push({ field: `Patient.${column}`, headerName: column })
        }
      })
    }
    return columnDefs;

  }
  const historyCall = (data) => {
    return {
      detailGridOptions: dataCall(data),
      getDetailRowData: (params) => {
        params.successCallback(params.data.FamilyHistory);
      },
    };
  }
  const immunizationCall = (data) => {
    return {
      detailGridOptions: dataCall(data),
      getDetailRowData: (params) => {
        params.successCallback(params.data.Immunizations);
      },
    };
  }
  const procedureCall = (data) => {
    return {
      detailGridOptions: dataCall(data),
      getDetailRowData: (params) => {
        params.successCallback(params.data.Procedures);
      },
    };
  }

  const vitalsCall = (data) => {
    return {
      detailGridOptions: dataCall(data),
      getDetailRowData: (params) => {
        params.successCallback(params.data.Vitals);
      },
    };
  }
  const problemCall = (data) => {
    return {
      detailGridOptions: dataCall(data),
      getDetailRowData: (params) => {
        params.successCallback(params.data.Problems);
      },
    };
  }
  if (flag === 1)
    return (
      <div >
        <div>
          {((allergyData.length !== 0) && Object.keys(allergyData[0]?.Allergies[0]).length !== 0) &&
            <div className="ag-theme-alpine" style={{ height: 300, paddingBottom: theme.spacing(9) }}>
              <Typography>Allergies</Typography>
              <AgGridReact
                columnDefs={ColumCall(allergyData)}
                ref={gridRef}
                alwaysShowHorizontalScroll={true}
                rowData={allergyData}
                detailCellRendererParams={allergyCall(allergyData[0]?.Allergies[0])}
                onFirstDataRendered={onFirstDataRendered}
                masterDetail={true}
                // flex={1}
                defaultColDef={defaultColDef}
              />
            </div>}
          {((familyHistoryData.length !== 0) && Object.keys(familyHistoryData[0]?.FamilyHistory[0]).length !== 0) &&
            <div className="ag-theme-alpine" style={{ height: 300, paddingBottom: theme.spacing(9) }}>
              <Typography>Family_History</Typography>
              <AgGridReact
                columnDefs={ColumCall(familyHistoryData)}
                ref={gridRef}
                rowData={familyHistoryData}
                alwaysShowHorizontalScroll={true}
                detailCellRendererParams={historyCall(familyHistoryData[0]?.FamilyHistory[0])}
                onFirstDataRendered={onFirstDataRendered}
                masterDetail={true}
                defaultColDef={defaultColDef} />
            </div>}
          {((ImmunizationData.length !== 0) && Object.keys(ImmunizationData[0]?.Immunizations[0]).length !== 0) &&
            <div className="ag-theme-alpine" style={{ height: 300, paddingBottom: theme.spacing(9) }}>
              <Typography>Immunizations</Typography>
              <AgGridReact
                columnDefs={ColumCall(ImmunizationData)}
                ref={gridRef}
                alwaysShowHorizontalScroll={true}
                rowData={ImmunizationData}
                detailCellRendererParams={immunizationCall(ImmunizationData[0]?.Immunizations[0])}
                onFirstDataRendered={onFirstDataRendered}
                masterDetail={true}
                defaultColDef={defaultColDef} />
            </div>}
          {((procedureData.length !== 0) && Object.keys(procedureData[0]?.Procedures[0]).length !== 0) &&
            <div className="ag-theme-alpine" style={{ height: 300, paddingBottom: theme.spacing(9) }}>
              <Typography>Procedures</Typography>
              <AgGridReact
                columnDefs={ColumCall(procedureData)}
                ref={gridRef}
                alwaysShowHorizontalScroll={true}
                rowData={procedureData}
                detailCellRendererParams={procedureCall(procedureData[0]?.Procedures[0])}
                onFirstDataRendered={onFirstDataRendered}
                masterDetail={true}
                defaultColDef={defaultColDef} />
            </div>}
          {((vitalsData.length !== 0) && Object.keys(vitalsData[0]?.Vitals[0]).length !== 0) &&
            <div className="ag-theme-alpine" style={{ height: 300, paddingBottom: theme.spacing(9) }}>
              <Typography>Vitals</Typography>
              <AgGridReact
                columnDefs={ColumCall(vitalsData)}
                ref={gridRef}
                alwaysShowHorizontalScroll={true}
                rowData={vitalsData}
                detailCellRendererParams={vitalsCall(vitalsData[0]?.Vitals[0])}
                onFirstDataRendered={onFirstDataRendered}
                masterDetail={true}
                defaultColDef={defaultColDef} />
            </div>}
          {((problemData.length !== 0) && Object.keys(problemData[0]?.Problems[0]).length !== 0) &&
            <div className="ag-theme-alpine" style={{ height: 300, paddingBottom: theme.spacing(9) }}>
              <Typography>Problems</Typography>
              <AgGridReact
                columnDefs={ColumCall(problemData)}
                ref={gridRef}
                alwaysShowHorizontalScroll={true}
                rowData={problemData}
                detailCellRendererParams={problemCall(problemData[0]?.Problems[0])}
                onFirstDataRendered={onFirstDataRendered}
                masterDetail={true}
                defaultColDef={defaultColDef} />
            </div>}
          {(patientData.length !== 0) &&
            <div className="ag-theme-alpine" style={{ height: 300, paddingBottom: theme.spacing(9) }}>
              <Typography>Patient_Data</Typography>
              <AgGridReact
                columnDefs={patientColumnCall(patientData)}
                ref={gridRef}
                alwaysShowHorizontalScroll={true}
                rowData={patientData}
              />
            </div>}
        </div>
      </div>
    );
}
