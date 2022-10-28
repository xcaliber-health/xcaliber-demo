import React, { useState, useEffect } from 'react'
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { Dangerous, ReportProblem, DeviceThermostat, Medication, Vaccines } from "@mui/icons-material/";
import { Grid, Box, Tabs, Tab, Typography, IconButton } from "@mui/material";
import { BUTTON_LABELS } from "../core-utils/constants";
import { useTheme } from "@mui/system";
import SimpleDialog from './CreateVitals';
import Vitals from './CreateVitals';
import { PatientService } from "../services/P360/patientService";
import { VitalsService } from "../services/P360/vitalsService";
import { useParams, useNavigate } from "react-router-dom";
import { vitalsData } from '../core-utils/constants'
export default function PamiV() {
  const theme = useTheme();
  const { id } = useParams();
  const [patientDetails, setPatientDetails] = useState();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const onIconClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [vitalsPayload, setVitalsPayload] = useState({
    data: {
      resourceType: "Bundle",
      type: "searchset",
      total: 9,
      entry: [
        // {
        // resource: {
        //   resourceType: "Observation",
        //   subject: {
        //     reference: `Patient/${id}`
        //   },
        //   category: [
        //     {
        //       coding: [
        //         {
        //           system: "http://terminology.hl7.org/CodeSystem/observation-category",
        //           code: "vital-signs",
        //           display: "Vital Signs"
        //         }
        //       ]
        //     }
        //   ],
        //   performer: [
        //     {
        //       reference: "Organization/140857911017476"
        //     }
        //   ],
        //   code: {
        //     coding: [
        //       {
        //         display: "body mass index"
        //       }
        //     ]
        //   },
        //   valueString: 2.66
        // }
        // },
      ]
      //   {
      //     resource: {
      //       resourceType: "Observation",
      //       subject: {
      //         reference: `Patient/${id}`
      //       },
      //       category: [
      //         {
      //           coding: [
      //             {
      //               system: "http://terminology.hl7.org/CodeSystem/observation-category",
      //               code: "vital-signs",
      //               display: "Vital Signs"
      //             }
      //           ]
      //         }
      //       ],
      //       performer: [
      //         {
      //           reference: "Organization/140857911017476"
      //         }
      //       ],
      //       code: {
      //         coding: [
      //           {
      //             code: "8302-2",
      //             display: "Height"
      //           }
      //         ]
      //       },
      //       valueQuantity: {
      //         value: 1,
      //         unit: "inches"
      //       },
      //       note: [
      //         {
      //           text: "Ht vitals note"
      //         }
      //       ]
      //     }
      //   },
      //   {
      //     resource: {
      //       "resourceType": "Observation",
      //       subject: {
      //         reference: `Patient/${id}`
      //       },
      //       category: [
      //         {
      //           coding: [
      //             {
      //               system: "http://terminology.hl7.org/CodeSystem/observation-category",
      //               code: "vital-signs",
      //               display: "Vital Signs"
      //             }
      //           ]
      //         }
      //       ],
      //       performer: [
      //         {
      //           reference: "Organization/140857911017476"
      //         }
      //       ],
      //       code: {
      //         coding: [
      //           {
      //             code: "29463-7",
      //             display: "Weight"
      //           }
      //         ]
      //       },
      //       valueQuantity: {
      //         value: 95,
      //         unit: "lbs"
      //       },
      //       note: [
      //         {
      //           text: "Wt vitals note"
      //         }
      //       ]
      //     }
      //   },
      //   {
      //     resource: {
      //       resourceType: "Observation",
      //       subject: {
      //         reference: `Patient/${id}`
      //       },
      //       category: [
      //         {
      //           coding: [
      //             {
      //               "system": "http://terminology.hl7.org/CodeSystem/observation-category",
      //               "code": "vital-signs",
      //               "display": "Vital Signs"
      //             }
      //           ]
      //         }
      //       ],
      //       "performer": [
      //         {
      //           "reference": "Organization/140857911017476"
      //         }
      //       ],
      //       "code": {
      //         "coding": [
      //           {
      //             "code": "59408-5",
      //             "display": "Oxygen Saturation"
      //           }
      //         ]
      //       },
      //       valueQuantity: {
      //         value: 98,
      //         unit: "%"
      //       },
      //       "note": [
      //         {
      //           "text": "O2 vitals note"
      //         }
      //       ]
      //     }
      //   },
      //   {
      //     "resource": {
      //       "resourceType": "Observation",
      //       subject: {
      //         reference: `Patient/${id}`
      //       },
      //       "category": [
      //         {
      //           "coding": [
      //             {
      //               "system": "http://terminology.hl7.org/CodeSystem/observation-category",
      //               "code": "vital-signs",
      //               "display": "Vital Signs"
      //             }
      //           ]
      //         }
      //       ],
      //       "performer": [
      //         {
      //           "reference": "Organization/140857911017476"
      //         }
      //       ],
      //       "code": {
      //         "coding": [
      //           {
      //             "code": "9279-1",
      //             "display": "Respiration Rate"
      //           }
      //         ]
      //       },
      //       valueQuantity: {
      //         value: 96,
      //         unit: "bpm"
      //       },
      //       "note": [
      //         {
      //           "text": "RR vitals note"
      //         }
      //       ]
      //     }
      //   },
      //   {
      //     resource: {
      //       "resourceType": "Observation",
      //       subject: {
      //         reference: `Patient/${id}`
      //       },
      //       "category": [
      //         {
      //           "coding": [
      //             {
      //               "system": "http://terminology.hl7.org/CodeSystem/observation-category",
      //               "code": "vital-signs",
      //               "display": "Vital Signs"
      //             }
      //           ]
      //         }
      //       ],
      //       performer: [
      //         {
      //           reference: "Organization/140857911017476"
      //         }
      //       ],
      //       "code": {
      //         "coding": [
      //           {
      //             "code": "8867-4",
      //             "display": "Pulse"
      //           }
      //         ]
      //       },
      //       valueQuantity: {
      //         value: 95,
      //         unit: "bpm"
      //       },
      //       "note": [
      //         {
      //           "text": "HR vitals note"
      //         }
      //       ]
      //     }
      //   },
      //   {
      //     "resource": {
      //       "resourceType": "Observation",
      //       subject: {
      //         reference: `Patient/${id}`
      //       },
      //       "category": [
      //         {
      //           "coding": [
      //             {
      //               "system": "http://terminology.hl7.org/CodeSystem/observation-category",
      //               "code": "vital-signs",
      //               "display": "Vital Signs"
      //             }
      //           ]
      //         }
      //       ],
      //       "performer": [
      //         {
      //           "reference": "Organization/140857911017476"
      //         }
      //       ],
      //       "code": {
      //         "coding": [
      //           {
      //             "display": "Head Circumference"
      //           }
      //         ]
      //       },
      //       valueQuantity: {
      //         value: 100,
      //         unit: "cm"
      //       },
      //       "note": [
      //         {
      //           "text": "HC vitals note"
      //         }
      //       ]
      //     }
      //   },
      //   {
      //     resource: {
      //       "resourceType": "Observation",
      //       "subject": {
      //         reference: `Patient/${id}`
      //       },
      //       "category": [
      //         {
      //           "coding": [
      //             {
      //               "system": "http://terminology.hl7.org/CodeSystem/observation-category",
      //               "code": "vital-signs",
      //               "display": "Vital Signs"
      //             }
      //           ]
      //         }
      //       ],
      //       "performer": [
      //         {
      //           "reference": "Organization/140857911017476"
      //         }
      //       ],
      //       "code": {
      //         "coding": [
      //           {
      //             "code": "8310-5",
      //             "display": "Body Temperature"
      //           }
      //         ]
      //       },
      //       valueQuantity: {
      //         value: 99,
      //         unit: "fahrenheit"
      //       },
      //       "note": [
      //         {
      //           "text": "Temp vitals note"
      //         }
      //       ]
      //     }
      //   },
      //   {
      //     resource: {
      //       "resourceType": "Observation",
      //       subject: {
      //         reference: `Patient/${id}`
      //       },
      //       "category": [
      //         {
      //           "coding": [
      //             {
      //               "system": "http://terminology.hl7.org/CodeSystem/observation-category",
      //               "code": "vital-signs",
      //               "display": "Vital Signs"
      //             }
      //           ]
      //         }
      //       ],
      //       "performer": [
      //         {
      //           "reference": "Organization/140857911017476"
      //         }
      //       ],
      //       "code": {
      //         "coding": [
      //           {
      //             "code": "85354-9",
      //             "display": "Blood Pressure"
      //           }
      //         ]
      //       },
      //       component: [
      //         {
      //           code: {
      //             coding: [
      //               {
      //                 code: "8480-6"
      //               }
      //             ]
      //           },
      //           valueQuantity: {
      //             value: 120
      //           }
      //         },
      //         {
      //           code: {
      //             coding: [
      //               {
      //                 code: "8462-4"
      //               }
      //             ]
      //           },
      //           valueQuantity: {
      //             value: 80
      //           }
      //         }
      //       ],
      //       note: [
      //         {
      //           text: "BP vitals note"
      //         }
      //       ]
      //     }
      //   }
      // ]
    }
  });
  const getPatientDetails = async () => {
    const response = await PatientService.getPatientById(id);
    setPatientDetails(response?.id);
  };
  useEffect(() => {
    setLoading(true);
    Promise.all([getPatientDetails()])
      .then()
      .catch()
      .finally(() => {
        setLoading(false);
      });
  }, []);
  const onHeightAdded = (height) => {
    const filteredEntries = vitalsPayload?.data.entry.filter((entry) => { return entry.resource.code.coding[0].code !== '8302-2' })
    setVitalsPayload({
      data: {
        ...vitalsPayload?.data,
        entry: [...filteredEntries, { resource: { ...vitalsPayload?.data.entry[1].resource, valueQuantity: { value: height, unit: "inches" } } }]
      }
    });
  };
  const onWeightAdded = (weight) => {
    console.log(weight);
    setVitalsPayload({
      data: {
        ...vitalsPayload?.data,
        entry: [...vitalsPayload?.data.entry, {
          resource: {
            resourceType: "Observation",
            subject: {
              reference: `Patient/${id}`
            },
            category: [
              {
                coding: [
                  {
                    system: "http://terminology.hl7.org/CodeSystem/observation-category",
                    code: "vital-signs",
                    display: "Vital Signs"
                  }
                ]
              }
            ],
            performer: [
              {
                reference: "Organization/140857911017476"
              }
            ],
            code: {
              coding: [
                {
                  code: "29463-7",
                  display: "Weight"
                }
              ]
            },
            valueQuantity: { value: weight, unit: "kgs", }
          }
        }
        ]
      }
    })
  };
  const onBMIAdded = (bmi) => {
    console.log(bmi);
    setVitalsPayload({
      data: {
        ...vitalsPayload?.data,
        entry: [...vitalsPayload?.data.entry, {
          resource: {
            resourceType: "Observation",
            subject: {
              reference: `Patient/${id}`
            },
            category: [
              {
                coding: [
                  {
                    system: "http://terminology.hl7.org/CodeSystem/observation-category",
                    code: "vital-signs",
                    display: "Vital Signs"
                  }
                ]
              }
            ],
            performer: [
              {
                reference: "Organization/140857911017476"
              }
            ],
            code: {
              coding: [
                {
                  display: "body mass index"
                }
              ]
            },
            valueString: bmi
          }
        }]
      }
    });
  };
  // const onOxygenAdd = (oxygen) => {
  //   setVitalsPayload({
  //     data: {
  //       ...vitalsPayload?.data,
  //       entry: [{
  //         resource: {
  //           ...vitalsPayload?.data.entry[3].resource, valueQuantity: { value: oxygen, unit: "%" },
  //         }
  //       }]
  //     }
  //   });
  // };
  // const onPulseRateAdd = (pulse) => {
  //   setVitalsPayload({
  //     data: {
  //       ...vitalsPayload?.data.entry,
  //       entry: [{
  //         resource: {
  //           ...vitalsPayload?.data.entry[5].resource, valueQuantity: { value: pulse, unit: "bpm" },
  //         }
  //       }]
  //     }
  //   });
  // };
  // const onBodyTemperatureAdd = (temperature) => {
  //   setVitalsPayload({
  //     data: {
  //       ...vitalsPayload?.data,
  //       entry: [{ resource: { ...vitalsPayload?.data.entry[7].resource, valueQuantity: { value: temperature, unit: "fahrenheit" }, } }]
  //     }
  //   });
  // };
  const onRespirationRateAdd = (rate) => {
    setVitalsPayload({
      data: {
        ...vitalsPayload?.data,
        entry: [{
          resource: {
            ...vitalsPayload?.data.entry[4].resource, valueQuantity: {
              valueQuantity: {
                value: rate,
                unit: "bpm"
              },
            },
          }
        }]
      }
    });
  };
  // const onHeadCircumChange = (circumference) => {
  //   setVitalsPayload({
  //     data: {
  //       ...vitalsPayload?.data,
  //       entry: [{ resource: { ...vitalsPayload?.data.entry[6].resource, valueQuantity: { value: circumference, unit: "cm" }, } }]
  //     }
  //   });
  // };
  // const onSysAdd = (bp1) => {
  //   setVitalsPayload({
  //     data: {
  //       ...vitalsPayload?.data,
  //       entry: [{ resource: { ...vitalsPayload?.data.entry[8].resource.component[0], valueQuantity: { value: bp1 }, } }]
  //     }
  //   });
  // };
  // const onDiaAdd = (bp2) => {
  //   setVitalsPayload({
  //     data: {
  //       ...vitalsPayload?.data,
  //       entry: [{ resource: { ...vitalsPayload?.data.entry[8].resource.component[1], valueQuantity: { value: bp2 }, } }]
  //     }
  //   });
  // };
  const onVitalsAdded = (bmi, height, weight, oxygen, pulse, rate, temperature, circumference, bp1, bp2) => {
    setVitalsPayload({
      data: {
        ...vitalsPayload?.data,
        entry: [{ resource: { ...vitalsPayload?.data.entry[0].resource, valueString: bmi } },
        { resource: { ...vitalsPayload?.data.entry[1].resource, valueQuantity: { unit: "inches", value: height } } },
        { resource: { ...vitalsPayload?.data.entry[2].resource, valueQuantity: { unit: "kgs", value: weight } } },
        { resource: { ...vitalsPayload?.data.entry[6].resource, valueQuantity: { value: circumference, unit: "cm" }, } },
        { resource: { ...vitalsPayload?.data.entry[4].resource, valueQuantity: { value: rate, unit: "bpm" }, } },
        { resource: { ...vitalsPayload?.data.entry[7].resource, valueQuantity: { value: temperature, unit: "fahrenheit" }, } },
        { resource: { ...vitalsPayload?.data.entry[3].resource, valueQuantity: { value: oxygen, unit: "%" }, } },
        { resource: { ...vitalsPayload?.data.entry[5].resource, valueQuantity: { value: pulse, unit: "bpm" }, } },
          // { resource: { ...vitalsPayload?.data.entry[8].resource, component:[{valueQuantity: { value: bp1 }},{valueQuantity: { value: bp2 }}  },
          // { resource: { ...vitalsPayload?.data.entry[8].resource.component[0], valueQuantity: { value: bp1 }, } },
        ]
      }
    });
  };
  const onVitalsClick = async (vitalsPayload, patientDetails) => {
    const keyArray = Object.keys(vitalsPayload?.data);
    //   if (
    //     !keyArray?.includes(entry[0].resource.) ||
    //     appointmentPayload?.data?.start === null ||
    //     appointmentPayload?.data?.start?.trim() === ""
    //   ) 
    // {
    //   alert("Please provide any of the field");
    // }
    //   else {
    await VitalsService.createVitals(vitalsPayload);
    setOpen(false);
    navigate(`/p360/${patientDetails}`);
    // }
  };

  return (
    <React.Fragment>
      <Box
        alignSelf="flex-start"
        display="flex"
        justifyContent="space-between"
        margin={theme.spacing(3)}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <DeviceThermostat />
          {BUTTON_LABELS.VITALS}
        </div>
        <IconButton sx={{ p: 0 }} display="flex" onClick={onIconClick}>
          <AddCircleOutlineRoundedIcon />
        </IconButton>
        <Vitals open={open} handleClose={handleClose}
          patientDetails={patientDetails}
          onVitalsClick={onVitalsClick}
          onWeightChange={onWeightAdded}
          // onPulseChange={onPulseRateAdd}
          vitalsDetails={vitalsPayload}
          // onOxygenChange={onOxygenAdd}
          // onbodyTemperatureChange={onBodyTemperatureAdd}
          // onHeightChange={onHeightAdded}
          // onRespirationChange={onRespirationRateAdd}
          onbmiChange={onBMIAdded}
        // oncircumChange={onHeadCircumChange}
        // onSysChange={onSysAdd}
        // onDiaChange={onDiaAdd}
        // onVitalsChange={onVitalsAdded}
        />
        {/*Vitals */}
        {/* onWeightChange={onWeightAdded} */}
      </Box>
      <Box
        alignSelf="flex-start"
        display="flex"
        justifyContent="space-between"
        margin={theme.spacing(3)}
      >
        <div style={{ display: "flex", alignItems: "center" }}>

          <ReportProblem />
          {BUTTON_LABELS.PROBLEMS}
        </div>
        <IconButton sx={{ p: 0 }} display="flex">
          <AddCircleOutlineRoundedIcon />
        </IconButton>
        {/*Vitals */}
      </Box>

      <Box
        alignSelf="flex-start"
        display="flex"
        justifyContent="space-between"
        margin={theme.spacing(3)}
      >
        <div style={{ display: "flex", alignItems: "center" }}>

          <Dangerous />
          {BUTTON_LABELS.ALLERGIES}
        </div>

        <IconButton sx={{ p: 0 }} display="flex">
          <AddCircleOutlineRoundedIcon />
        </IconButton>
        {/*Vitals */}
      </Box>
      <Box
        alignSelf="flex-start"
        display="flex"
        justifyContent="space-between"
        margin={theme.spacing(3)}
      >
        <div style={{ display: "flex", alignItems: "center" }}>

          <Vaccines />
          {BUTTON_LABELS.IMMUNIZATIONS}
        </div>

        <IconButton sx={{ p: 0 }} display="flex">
          <AddCircleOutlineRoundedIcon />
        </IconButton>
        {/*Vitals */}
      </Box>
      <Box
        alignSelf="flex-start"
        display="flex"
        justifyContent="space-between"
        margin={theme.spacing(3)}
      >
        <div style={{ display: "flex", alignItems: "center" }}>

          <Medication />
          {BUTTON_LABELS.MEDICATIONS}
        </div>

        <IconButton sx={{ p: 0 }} display="flex">
          <AddCircleOutlineRoundedIcon />
        </IconButton>
        {/*Vitals */}
      </Box>
    </React.Fragment>

  )
}
