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

  useEffect(() => {
    tableRowData.forEach((row) => {
      if (row.Allergies && row.Allergies !== null) {
        allergyArray.push(row);
      }
      if (row.Immunizations && row.Immunizations !== null) {
        immunizationArray.push(row);
      }
      if (row.FamilyHistory) {
        familyHistoryArray.push(row);
      }
      if (row.Problems) {
        problemArray.push(row);
      }
      if (row.Procedures) {
        procedureArray.push(row);
      }
      if (row.Vitals) {
        vitalsArray.push(row)
      }
    })
    setAllergyData(allergyArray);
    setImmunizationData(immunizationArray);
    setVitalsData(vitalsArray);
    setProblemData(problemArray);
    setProcedureData(procedureArray);
    setFamilyHistoryData(familyHistoryArray);
  }, []);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
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
      columnDefs.push({ field: column })

    })
    return {
      suppressRowClickSelection: true,
      enableRangeSelection: true,
      pagination: true,
      paginationAutoPageSize: true,
      columnDefs: columnDefs,
      defaultColDef: {
        sortable: true,
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
          {(allergyData.length !== 0) &&
            <div className="ag-theme-alpine" style={{ height: 300, paddingBottom: theme.spacing(9) }}>
              <Typography>Allergies</Typography>
              <AgGridReact
                columnDefs={columnDefs}
                ref={gridRef}
                rowData={allergyData}
                detailCellRendererParams={allergyCall(allergyData[0]?.Allergies[0])}
                onFirstDataRendered={onFirstDataRendered}
                masterDetail={true}
                defaultColDef={defaultColDef} />
            </div>}
          {(familyHistoryData.length !== 0) &&
            <div className="ag-theme-alpine" style={{ height: 300, paddingBottom: theme.spacing(9) }}>
              <Typography>Family_History</Typography>
              <AgGridReact
                columnDefs={columnDefs}
                ref={gridRef}
                rowData={familyHistoryData}
                detailCellRendererParams={historyCall(familyHistoryData[0]?.FamilyHistory[0])}
                onFirstDataRendered={onFirstDataRendered}
                masterDetail={true}
                defaultColDef={defaultColDef} />
            </div>}
          {(ImmunizationData.length !== 0) &&
            <div className="ag-theme-alpine" style={{ height: 300, paddingBottom: theme.spacing(9) }}>
              <Typography>Immunizations</Typography>
              <AgGridReact
                columnDefs={columnDefs}
                ref={gridRef}
                rowData={ImmunizationData}
                detailCellRendererParams={immunizationCall(ImmunizationData[0]?.Immunizations[0])}
                onFirstDataRendered={onFirstDataRendered}
                masterDetail={true}
                defaultColDef={defaultColDef} />
            </div>}
          {(procedureData.length !== 0) &&
            <div className="ag-theme-alpine" style={{ height: 300, paddingBottom: theme.spacing(9) }}>
              <Typography>Procedures</Typography>
              <AgGridReact
                columnDefs={columnDefs}
                ref={gridRef}
                rowData={procedureData}
                detailCellRendererParams={procedureCall(procedureData[0]?.Procedures[0])}
                onFirstDataRendered={onFirstDataRendered}
                masterDetail={true}
                defaultColDef={defaultColDef} />
            </div>}
          {(vitalsData.length !== 0) &&
            <div className="ag-theme-alpine" style={{ height: 300, paddingBottom: theme.spacing(9) }}>
              <Typography>Vitals</Typography>
              <AgGridReact
                columnDefs={columnDefs}
                ref={gridRef}
                rowData={vitalsData}
                detailCellRendererParams={vitalsCall(vitalsData[0]?.Vitals[0])}
                onFirstDataRendered={onFirstDataRendered}
                masterDetail={true}
                defaultColDef={defaultColDef} />
            </div>}
          {(problemData.length !== 0) &&
            <div className="ag-theme-alpine" style={{ height: 300, paddingBottom: theme.spacing(9) }}>
              <Typography>Problems</Typography>
              <AgGridReact
                columnDefs={columnDefs}
                ref={gridRef}
                rowData={problemData}
                detailCellRendererParams={problemCall(problemData[0]?.Problems[0])}
                onFirstDataRendered={onFirstDataRendered}
                masterDetail={true}
                defaultColDef={defaultColDef} />
            </div>}
        </div>
      </div>
    );
}
