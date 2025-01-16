import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { ReferenceDataService } from "../../../../../../services/referenceDataService";
import { ProblemService } from "../../../../../../services/problemService";
import * as moment from "moment-timezone";
import SideDrawer from "../../../../../ui/SideDrawer";

interface CreateProblemProps {
  patientId: string;
  updateProblems: (data: any) => void;
}

export const CreateProblem = ({
  patientId,
  updateProblems,
}: CreateProblemProps) => {
  let dateObject = new Date(
    new Date().toLocaleString(`en-US`, {
      timeZone: localStorage.getItem(`DEPARTMENT_TIMEZONE`),
    })
  );

  const [problemPayload, setProblemPayload] = useState({
    context: {
      departmentId: localStorage.getItem(`DEPARTMENT_ID`),
    },
    data: {
      resourceType: "Condition",
      text: {
        status: "generated",
        div: "",
      },
      category: [
        {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/condition-category",
              code: "problem-list-item",
              display: "Problem List Item",
            },
          ],
        },
      ],
      clinicalStatus: {
        coding: [
          {
            code: "active",
            display: "Active",
          },
        ],
      },
      subject: {
        reference: `Patient/${patientId}`,
      },
      note: [
        {
          text: "",
        },
      ],
      onsetDateTime: moment
        .tz(
          `${dateObject.getFullYear()}-${
            dateObject.getMonth() <= 8
              ? `0${dateObject.getMonth() + 1}`
              : dateObject.getMonth() + 1
          }-${
            dateObject.getDate() <= 9
              ? `0${dateObject.getDate()}`
              : `${dateObject.getDate()}`
          }T${
            dateObject.getHours() <= 9
              ? `0${dateObject.getHours()}`
              : `${dateObject.getHours()}`
          }:${
            dateObject.getMinutes() <= 9
              ? `0${dateObject.getMinutes()}`
              : `${dateObject.getMinutes()}`
          }:${dateObject.getSeconds()}Z`,
          `YYYY-MM-DDTHH:mm:ss`,
          localStorage.getItem(`DEPARTMENT_TIMEZONE`)
        )
        .utc()
        .format(),
      recordedDate: "2022-09-16T12:27:24Z",
      abatementDateTime: "",
      code: {
        coding: [
          {
            system: "ICD10",
            code: "",
          },
        ],
      },
    },
  });

  const [loading, setLoading] = useState(false);
  const [problemIcd10Options, setProblemIcd10Options] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const updateOptions = async (searchTerm: string) => {
    const result = await ReferenceDataService.getProblemData(searchTerm);
    setProblemIcd10Options(result);
  };

  const initialiseProblemOptions = async () => {
    const result = await ReferenceDataService.getProblemData();
    setProblemIcd10Options(result);
  };

  const createProblem = async (problemPayload) => {
    const createdProblem = await ProblemService.createProblem(problemPayload);
    if (localStorage.getItem("XCALIBER_SOURCE") === "ELATION") {
      const createdProblemData = await ProblemService.getProblemById(
        createdProblem?.data?.id
      );
      updateProblems({ resource: { ...createdProblemData } });
      setIsDrawerOpen(false);
    } else if (localStorage.getItem("XCALIBER_SOURCE") === "ATHENA") {
      setIsDrawerOpen(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([initialiseProblemOptions()]).finally(() => {
      setLoading(false);
    });
  }, []);

  const formFields = [
    {
      name: "SNOMED_CID",
      label: "Snomed-Code",
      type: "text",
    },
    {
      name: "problemSynopsis",
      label: "Problem Synopsis",
      type: "text",
    },
  ];

  const onSubmit = (data: { [key: string]: any }) => {
    const updatedProblemPayload = {
      ...problemPayload,
      data: {
        ...problemPayload.data,
        text: { status: "generated", div: data.problemSynopsis },
        code: {
          coding: [
            {
              system: "http://snomed.info/sct",
              code: data.SNOMED_CID,
            },
          ],
        },
      },
    };
    createProblem(updatedProblemPayload);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        className="mr-12"
        onClick={() => setIsDrawerOpen(true)}
      >
        +CREATE
      </Button>

      <SideDrawer
        title="Create Problem"
        formFields={formFields}
        initialData={{
          SNOMED_CID: problemPayload.data.code?.coding[0]?.code || "",
          problemSynopsis: problemPayload.data.note[0]?.text || "",
        }}
        onSubmit={onSubmit}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};
