// React Imports
import { ReactNode, useState } from "react";

// Mui Imports
import Button from "@mui/material/Button";

// Third-party Imports
import { VitalService } from "../../../../../../services/VitalService";
import SideDrawer from "../../../../../ui/SideDrawer";

interface CreateVitalsProps {
  title: string;
  patientId: string;
}

export default function CreateVitals({ title, patientId }: CreateVitalsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    height: 0,
    weight: 0,
    sys: 0,
    dia: 0,
    bodyTemp: undefined,
    pulse: undefined,
    rr: undefined,
    bmi: "",
    oxy: undefined,
    headCir: undefined,
  });

  const formFields = [
    { name: "height", label: "Height (inches)", type: "number" },
    { name: "weight", label: "Weight (kg)", type: "number" },
    { name: "sys", label: "Systolic BP", type: "number" },
    { name: "dia", label: "Diastolic BP", type: "number" },
    { name: "bodyTemp", label: "Body Temperature (°C)", type: "number" },
    { name: "pulse", label: "Pulse Rate", type: "number" },
    { name: "rr", label: "Respiratory Rate", type: "number" },
    { name: "bmi", label: "BMI", type: "text" },
    { name: "oxy", label: "Oxygen Saturation (%)", type: "number" },
    { name: "headCir", label: "Head Circumference (cm)", type: "number" },
  ];

  const handleSubmit = async () => {
    if (!patientId) {
      alert("Patient details are missing.");
      return;
    }

    const { height, weight, sys, dia, bodyTemp, pulse, rr, bmi, oxy, headCir } =
      formData;

    const resourceBase = {
      resourceType: "Observation",
      subject: {
        reference: `Patient/${patientId}`,
      },
      performer: [
        {
          reference: "Organization/140857911017476",
        },
      ],
      category: [
        {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/observation-category",
              code: "vital-signs",
              display: "Vital Signs",
            },
          ],
        },
      ],
    };

    const entries: any[] = [];

    const addEntry = (
      code: string,
      display: string,
      unit: string,
      value: number | string
    ) => {
      if (value !== undefined && value !== null) {
        entries.push({
          resource: {
            ...resourceBase,
            code: {
              coding: [
                {
                  system: "http://loinc.org",
                  code,
                  display,
                },
              ],
            },
            valueQuantity: { unit, value },
          },
        });
      }
    };

    if (sys && dia) {
      entries.push({
        resource: {
          ...resourceBase,
          code: {
            coding: [
              {
                system: "http://loinc.org",
                code: "85354-9",
                display: "Blood Pressure",
              },
            ],
          },
          component: [
            {
              code: {
                coding: [{ system: "http://loinc.org", code: "8480-6" }],
              },
              valueQuantity: { value: sys },
            },
            {
              code: {
                coding: [{ system: "http://loinc.org", code: "8462-4" }],
              },
              valueQuantity: { value: dia },
            },
          ],
        },
      });
    } else if (sys || dia) {
      alert("Please provide both systolic and diastolic blood pressure.");
      return;
    }

    addEntry("8302-2", "Height", "inches", height);
    addEntry("29463-7", "Weight", "lbs", weight);

    if (bmi) {
      const bmiValue =
        localStorage.getItem(`XCALIBER_SOURCE`) === "ELATION"
          ? { valueString: bmi }
          : { valueQuantity: { unit: "kg/m2", value: parseFloat(bmi) } };

      entries.push({
        resource: {
          ...resourceBase,
          code: {
            coding: [
              {
                system: "http://loinc.org",
                code: "39156-5",
                display: "Body Mass Index",
              },
            ],
          },
          ...bmiValue,
        },
      });
    }

    addEntry("59408-5", "Oxygen Saturation", "%", oxy);
    addEntry("8867-4", "Pulse", "bpm", pulse);
    addEntry("8310-5", "Body Temperature", "fahrenheit", bodyTemp);
    addEntry("9279-1", "Respiration Rate", "bpm", rr);
    addEntry("N/A", "Head Circumference", "cm", headCir);

    if (!entries.length) {
      alert("Please provide at least one vital sign.");
      return;
    }

    const vitalsPayload = {
      context: { departmentId: localStorage.getItem(`DEPARTMENT_ID`) },
      data: { resourceType: "Bundle", entry: entries },
    };

    try {
      await VitalService.createVitals(vitalsPayload);
      console.log("Vitals created successfully.", vitalsPayload);
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating vitals:", error);
      alert("Failed to create vitals. Please try again.");
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        className="mr-12"
        onClick={() => setIsOpen(true)}
      >
        +CREATE
      </Button>

      <SideDrawer
        title="Add Vitals"
        formFields={formFields}
        initialData={formData}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={(data) => {
          setFormData(data);
          handleSubmit();
        }}
      />
    </>
  );
}
