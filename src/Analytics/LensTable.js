import {
  TableBody,
  TableCell,
  TableRow,
  Table,
  Grid,
  TableHead,
  TableContainer,
  Typography,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/system";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'ag-grid-enterprise';
import { useEffect } from "react";
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { render } from 'react-dom';

export default function LensTable({ tableRowData, flag }) {
  const gridRef = useRef();
  const theme = useTheme();
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [rowData, setRowData] = useState();
  const allergyData = [];
  const [columnDefs, setColumnDefs] = useState([
    { field: 'Patient_ID', cellRenderer: 'agGroupCellRenderer' },
    { field: 'Patient.Race' },
    { field: 'Patient.LastName' },
    { field: 'Patient.DOB' },
    { field: 'Patient.City' },
    { field: 'Patient.State' },
    { field: 'Patient.Phone' }
  ]);
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

  const onGridReady = useCallback((params) => {
    setRowData(tableRowData);
  }, []);
  const detailCellRendererParams = useMemo(() => {
    return {
      detailGridOptions: {
        suppressRowClickSelection: true,
        enableRangeSelection: true,
        pagination: true,
        paginationAutoPageSize: true,
        columnDefs: [
          { field: 'FH_ID' },
          { field: 'FamilyHistory_ICD9' },
          { field: 'FamilyHistory_Relation' },
          { field: 'FamilyHistory_SNOMED' },
        ],
        defaultColDef: {
          sortable: true,
          flex: 1,
        },
      },
      getDetailRowData: (params) => {
        params.successCallback(params.data.FamilyHistory);
      },
    };
  }, []);
  const detailCellRendererParamsProblems = useMemo(() => {
    return {
      detailGridOptions: {
        suppressRowClickSelection: true,
        enableRangeSelection: true,
        pagination: true,
        paginationAutoPageSize: true,
        columnDefs: [
          { field: 'Condition_Description' },
          // { field: 'Condition_ICD9_Code' },
          // { field: 'Condition_ICD10_Code' },
          { field: 'Condition_ID' },
          // { field: 'Condition_SNOMED_Code' },
          { field: 'Condition_Status' }
        ],
        defaultColDef: {
          sortable: true,
          flex: 1,
        },
      },
      getDetailRowData: (params) => {
        params.successCallback(params.data.Problems);
      },
    };
  }, []);
  const detailCellRendererParamsAllergies = useMemo(() => {
    return {
      detailGridOptions: {
        suppressRowClickSelection: true,
        enableRangeSelection: true,
        pagination: true,
        paginationAutoPageSize: true,
        columnDefs: [
          { field: 'Allergy_ID' },
          { field: 'Allergy_Reaction' },
          { field: 'Allergy_Severity' },
          { field: 'Allergy_Start_Date' },
          { field: 'Allergy_Status' },
          { field: 'Allergy_Substance' }
        ],
        defaultColDef: {
          sortable: true,
          flex: 1,
        },
      },
      getDetailRowData: (params) => {
        params.successCallback(params.data.Allergies);
        allergyData.push(params.data.Allergies);
        console.log(allergyData);
      },
    };
  }, []);
  const detailCellRendererParamsImmunization = useMemo(() => {
    return {
      detailGridOptions: {
        suppressRowClickSelection: true,
        enableRangeSelection: true,
        pagination: true,
        paginationAutoPageSize: true,
        columnDefs: [
          { field: 'Immunization_ID' },
          { field: 'Immunization_Date' },
          // { field: 'Immunization_Dose_Quantity' },
          // { field: 'Immunization_Dose_Units' },
          { field: 'Immunization_Name' },
          { field: 'Immunization_CodeSystem' }
        ],
        defaultColDef: {
          sortable: true,
          flex: 1,
        },
      },
      getDetailRowData: (params) => {
        params.successCallback(params.data.Immunizations);
      },
    };
  }, []);
  const detailCellRendererParamsProcedures = useMemo(() => {
    return {
      detailGridOptions: {
        suppressRowClickSelection: true,
        enableRangeSelection: true,
        pagination: true,
        paginationAutoPageSize: true,
        columnDefs: [
          { field: 'Procedure_ID' },
          { field: 'Procedure_Code_Description' },
          { field: 'Procedure_Performed_Date' },
          { field: 'Procedure_Type' }
        ],
        defaultColDef: {
          sortable: true,
          flex: 1,
        },
      },
      getDetailRowData: (params) => {
        params.successCallback(params.data.Procedures);
      },
    };
  }, []);
  const detailCellRendererParamsVitals = useMemo(() => {
    return {
      detailGridOptions: {
        suppressRowClickSelection: true,
        enableRangeSelection: true,
        pagination: true,
        paginationAutoPageSize: true,
        columnDefs: [
          { field: 'Vital_Name' },
          { field: 'Vital_Code' },
          { field: 'Vital_Sign_Date' },
          { field: 'Vital_Value' }
        ],
        defaultColDef: {
          sortable: true,
          flex: 1,
        },
      },
      getDetailRowData: (params) => {
        params.successCallback(params.data.Vitals);
      },
    };
  }, []);
  return (
    <div >

      {flag == 1 &&
        <div className="ag-theme-alpine" style={{ height: 300 }} >
          {/* {tableRowData.FamilyHistory!==null&&<div className="ag-theme-alpine" style={{ height: 300 }}> */}
          <Typography>FamilyHistory</Typography>
          <AgGridReact
            columnDefs={columnDefs}
            ref={gridRef}
            rowData={rowData}
            detailCellRendererParams={detailCellRendererParams}
            onGridReady={onGridReady}
            onFirstDataRendered={onFirstDataRendered}
            masterDetail={true}
            defaultColDef={defaultColDef} />
          {/* </div>} */}
          {/* {tableRowData.Problems!==null&&<div className="ag-theme-alpine" style={{ height: 300 }}> */}
          <Typography>Problems</Typography>
          <AgGridReact
            columnDefs={columnDefs}
            ref={gridRef}
            rowData={rowData}
            detailCellRendererParams={detailCellRendererParamsProblems}
            onGridReady={onGridReady}
            onFirstDataRendered={onFirstDataRendered}
            masterDetail={true}
            defaultColDef={defaultColDef} />
          {/* </div>} */}
          {/* {allergyData !== null &&
            <div className="ag-theme-alpine" style={{ height: 300 }}> */}
          <Typography>Allergies</Typography>
          <AgGridReact
            columnDefs={columnDefs}
            ref={gridRef}
            rowData={rowData}
            detailCellRendererParams={detailCellRendererParamsAllergies}
            onGridReady={onGridReady}
            onFirstDataRendered={onFirstDataRendered}
            masterDetail={true}
            defaultColDef={defaultColDef} />
          {/* </div>} */}
          <Typography>Immunizations</Typography>
          <AgGridReact
            columnDefs={columnDefs}
            ref={gridRef}
            rowData={rowData}
            detailCellRendererParams={detailCellRendererParamsImmunization}
            onGridReady={onGridReady}
            onFirstDataRendered={onFirstDataRendered}
            masterDetail={true}
            defaultColDef={defaultColDef} />
          <Typography>Procedures</Typography>
          <AgGridReact
            columnDefs={columnDefs}
            ref={gridRef}
            rowData={rowData}
            detailCellRendererParams={detailCellRendererParamsProcedures}
            onGridReady={onGridReady}
            onFirstDataRendered={onFirstDataRendered}
            masterDetail={true}
            defaultColDef={defaultColDef} />
          <Typography>Vitals</Typography>
          <AgGridReact
            columnDefs={columnDefs}
            ref={gridRef}
            rowData={rowData}
            detailCellRendererParams={detailCellRendererParamsVitals}
            onGridReady={onGridReady}
            onFirstDataRendered={onFirstDataRendered}
            masterDetail={true}
            defaultColDef={defaultColDef} />
        </div>}
    </div>
  );
}
