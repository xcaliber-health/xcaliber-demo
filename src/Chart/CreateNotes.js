import { Grid, Typography, TextField, Button, Chip } from "@mui/material";
import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { NoteService } from "../services/P360/noteService";

const CreateNotes = ({
  patientDetails,
  onCancelClick,
  disabled,
  reloadNotes,
  bookedNote,
}) => {
  const [problemPayLoad, setProblemPayLoad] = useState("");
  const [allergyList, setAllergy] = useState("");
  const [pastHistory, setpastHistory] = useState("");
  const [surgicalHistory, setsurgicalHistory] = useState("");
  const [familyHistory, setfamilyHistory] = useState("");
  const [socialHistory, setsocialHistory] = useState("");
  const [habbits, sethabbits] = useState("");
  const [medications, setmedications] = useState("");
  const [assesmentPlan, setassesmentPlan] = useState("");
  const [followup, setfollowup] = useState("");

  const peSequence = {
    General: 0,
    Eyes: 1,
    HENT: 2,
    Neck: 3,
    Resp: 4,
    CVS: 5,
    Breast: 6,
    Abdom: 7,
    GU: 8,
    MSS: 9,
    NS: 10,
    Skin: 11,
    Lymph: 12,
    Psych: 13,
    Rectal: 14,
  };
  const [general, setGeneral] = useState("");
  const [eyes, setEyes] = useState("");
  const [hent, setHENT] = useState("");
  const [neck, setNeck] = useState("");
  const [resp, setResp] = useState("");
  const [cvs, setCVS] = useState("");
  const [breast, setBreast] = useState("");
  const [abdom, setAbdom] = useState("");
  const [gu, setGU] = useState("");
  const [mss, setMSS] = useState("");
  const [ns, setNS] = useState("");
  const [skin, setSkin] = useState("");
  const [lymph, setLymph] = useState("");
  const [psych, setPsych] = useState("");
  const [rectal, setRectal] = useState("");

  const [rosgeneral, setRosGeneral] = useState("");
  const [roseyes, setRosEyes] = useState("");
  const [roshent, setRosHENT] = useState("");
  const [rosneck, setRosNeck] = useState("");
  const [rosresp, setRosResp] = useState("");
  const [roscvs, setRosCVS] = useState("");
  const [rosbreast, setRosBreast] = useState("");
  const [rosabdom, setRosAbdom] = useState("");
  const [rosgu, setRosGU] = useState("");
  const [rosmss, setRosMSS] = useState("");
  const [rosns, setRosNS] = useState("");
  const [rosskin, setRosSkin] = useState("");
  const [roslymph, setRosLymph] = useState("");
  const [rospsych, setRosPsych] = useState("");
  const [rosrectal, setRosRectal] = useState("");

  const getPhysicalExamAttachment = (title, data) => {
    return {
      attachment: {
        contentType: "text/plain",
        hash: "md5 hash of base64 section content",
        data,
        title,
        extension: [
          {
            url: "http://xcaliber-fhir/structureDefinition/pe-sequence",
            valueInteger: peSequence[title],
          },
        ],
      },
      format: {
        system: "urn:oid:1.3.6.1.4.1.19376.1.2.3",
        code: "urn:ihe:pcc:handp:2008",
        display: "PE",
      },
    };
  };

  const getRosAttachment = (title, data) => {
    return {
      attachment: {
        contentType: "text/plain",
        hash: "md5 hash of base64 section content",
        data,
        title,
        extension: [
          {
            url: "http://xcaliber-fhir/structureDefinition/ros-sequence",
            valueInteger: peSequence[title],
          },
        ],
      },
      format: {
        system: "urn:oid:1.3.6.1.4.1.19376.1.2.3",
        code: "urn:ihe:pcc:handp:2008",
        display: "ROS",
      },
    };
  };
  const createNotePayLoad = async () => {
    const date = new Date().toISOString();
    var content = [];
    if (problemPayLoad !== "") {
      content.push({
        attachment: {
          contentType: "text/plain",
          data: problemPayLoad,
          title: "Problem",
          hash: "md5 hash of base64 section content",
        },
      });
    }
    if (allergyList !== "") {
      content.push({
        attachment: {
          contentType: "text/plain",
          data: allergyList,
          title: "Allergies",
          hash: "md5 hash of base64 section content",
        },
      });
    }
    if (pastHistory !== "") {
      content.push({
        attachment: {
          contentType: "text/plain",
          data: pastHistory,
          title: "Past",
          hash: "md5 hash of base64 section content",
        },
      });
    }
    if (surgicalHistory !== "") {
      content.push({
        attachment: {
          contentType: "text/plain",
          data: surgicalHistory,
          title: "Surgical",
          hash: "md5 hash of base64 section content",
        },
      });
    }
    if (familyHistory !== "") {
      content.push({
        attachment: {
          contentType: "text/plain",
          data: familyHistory,
          title: "Family",
          hash: "md5 hash of base64 section content",
        },
      });
    }
    if (socialHistory !== "") {
      content.push({
        attachment: {
          contentType: "text/plain",
          data: socialHistory,
          title: "Social",
          hash: "md5 hash of base64 section content",
        },
      });
    }
    if (habbits !== "") {
      content.push({
        attachment: {
          contentType: "text/plain",
          data: habbits,
          title: "Habits",
          hash: "md5 hash of base64 section content",
        },
      });
    }
    if (medications !== "") {
      content.push({
        attachment: {
          contentType: "text/plain",
          data: medications,
          title: "Med",
          hash: "md5 hash of base64 section content",
        },
      });
    }
    if (assesmentPlan !== "") {
      content.push({
        attachment: {
          contentType: "text/plain",
          data: assesmentPlan,
          title: "Assessplan",
          hash: "md5 hash of base64 section content",
        },
      });
    }
    if (followup !== "") {
      content.push({
        attachment: {
          contentType: "text/plain",
          data: followup,
          title: "Followup",
          hash: "md5 hash of base64 section content",
        },
      });
    }
    if (general !== "") {
      content.push(getPhysicalExamAttachment("General", general));
    }
    if (eyes !== "") {
      content.push(getPhysicalExamAttachment("Eyes", eyes));
    }
    if (hent !== "") {
      content.push(getPhysicalExamAttachment("HENT", hent));
    }
    if (neck !== "") {
      content.push(getPhysicalExamAttachment("Neck", neck));
    }
    if (resp !== "") {
      content.push(getPhysicalExamAttachment("Resp", resp));
    }
    if (cvs !== "") {
      content.push(getPhysicalExamAttachment("CVS", cvs));
    }
    if (breast !== "") {
      content.push(getPhysicalExamAttachment("Breast", breast));
    }
    if (abdom !== "") {
      content.push(getPhysicalExamAttachment("Abdom", abdom));
    }
    if (gu !== "") {
      content.push(getPhysicalExamAttachment("GU", gu));
    }
    if (mss !== "") {
      content.push(getPhysicalExamAttachment("MSS", mss));
    }
    if (ns !== "") {
      content.push(getPhysicalExamAttachment("NS", ns));
    }
    if (skin !== "") {
      content.push(getPhysicalExamAttachment("Skin", skin));
    }
    if (lymph !== "") {
      content.push(getPhysicalExamAttachment("Lymph", lymph));
    }
    if (psych !== "") {
      content.push(getPhysicalExamAttachment("Psych", psych));
    }
    if (rectal !== "") {
      content.push(getPhysicalExamAttachment("Rectal", rectal));
    }

    if (rosgeneral !== "") {
      content.push(getRosAttachment("General", rosgeneral));
    }
    if (roseyes !== "") {
      content.push(getRosAttachment("Eyes", roseyes));
    }
    if (roshent !== "") {
      content.push(getRosAttachment("HENT", roshent));
    }
    if (rosneck !== "") {
      content.push(getRosAttachment("Neck", rosneck));
    }
    if (rosresp !== "") {
      content.push(getRosAttachment("Resp", rosresp));
    }
    if (roscvs !== "") {
      content.push(getRosAttachment("CVS", roscvs));
    }
    if (rosbreast !== "") {
      content.push(getRosAttachment("Breast", rosbreast));
    }
    if (rosabdom !== "") {
      content.push(getRosAttachment("Abdom", rosabdom));
    }
    if (rosgu !== "") {
      content.push(getRosAttachment("GU", rosgu));
    }
    if (rosmss !== "") {
      content.push(getRosAttachment("MSS", rosmss));
    }
    if (rosns !== "") {
      content.push(getRosAttachment("NS", rosns));
    }
    if (rosskin !== "") {
      content.push(getRosAttachment("Skin", rosskin));
    }
    if (roslymph !== "") {
      content.push(getRosAttachment("Lymph", roslymph));
    }
    if (rospsych !== "") {
      content.push(getRosAttachment("Psych", rospsych));
    }
    if (rosrectal !== "") {
      content.push(getRosAttachment("Rectal", rosrectal));
    }
    const notePayLoad = {
      resourceType: "DocumentReference",
      status: "current",
      docStatus: "preliminary",
      type: {
        coding: [
          {
            system: "https://sandbox.elationemr.com/api/2.0/visit_note_types",
            code: "Elation",
            display: "Complete H&P (2 col A/P)",
          },
        ],
      },
      category: [
        {
          coding: [
            {
              system: "https://sandbox.elationemr.com/api/2.0/visit_note_types",
              code: "Elation",
              display: "Complete H&P (2 col A/P)",
            },
          ],
        },
      ],
      date,
      description: "Office Visit Note",
      subject: {
        reference: `Patient/${patientDetails?.id}`,
      },
      author: [
        {
          reference: "Practitioner/140857915539458",
          identifier: {
            id: "user_id",
            value: 2758,
          },
        },
      ],
      securityLabel: [
        {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/v3-Confidentiality",
              code: "U",
              display: "unrestricted",
            },
          ],
        },
      ],
      extension: [
        {
          url: "http://xcaliber-fhir/structureDefinition/practice",
          valueString: 140857911017476,
        },
      ],
      content,
      context: {
        encounter: [
          {
            reference: `Encounter/${date}`,
          },
        ],
        period: {
          start: date,
        },
      },
      contained: [],
    };
    return notePayLoad;
  };
  const onSaveNote = async () => {
    const notePayLoad = await createNotePayLoad();
    const note = await NoteService.createNote(
      {
        context: {
          departmentId: localStorage.getItem(`DEPARTMENT_ID`),
        },
        data: { ...notePayLoad },
      },
      bookedNote?.[0]?.resource?.id
    );
    if (localStorage.getItem(`XCALIBER_SOURCE`) === "ATHENA") {
      const createdNote = await NoteService.getNoteByAppointmentId(
        patientDetails?.id,
        bookedNote?.[0]?.resource?.id
      );

      reloadNotes(createdNote?.[0]);
    }
  };
  const onSaveNoteAsDraft = async () => {
    const notePayLoad = await createNotePayLoad();
    let draftedNotes = JSON.parse(
      localStorage.getItem(`notes_${patientDetails?.id}`)
    );
    if (draftedNotes && draftedNotes !== null)
      localStorage.setItem(
        `notes_${patientDetails?.id}`,
        JSON.stringify([
          ...JSON.parse(localStorage.getItem(`notes_${patientDetails?.id}`)),
          { resource: { ...notePayLoad } },
        ])
      );
    else
      localStorage.setItem(
        `notes_${patientDetails?.id}`,
        JSON.stringify([{ resource: { ...notePayLoad } }])
      );
  };
  return (
    <Grid container>
      <Grid item pt={2} sx={{ width: "100%" }}>
        <Grid item pt={2}>
          <Typography variant="h4">{`Create Notes`}</Typography>
          {localStorage.getItem("XCALIBER_SOURCE") === "ATHENA" &&
          bookedNote &&
          bookedNote?.length !== 0 ? (
            <Chip sx={{ pl: "4px" }} label={bookedNote?.[0]?.resource?.id} />
          ) : (
            localStorage.getItem("XCALIBER_SOURCE") === "ATHENA" && (
              <Typography sx={{ pl: "4px", pt: "4px" }} variant="h6">
                Please create an appointment to be checked in
              </Typography>
            )
          )}
        </Grid>
        <Grid sx={{ width: "100%" }} item pt={2}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id="panel1a-header"
            >
              <Typography>Problems</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction="column">
                <Grid item>
                  <Typography pb={1}> Problem</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setProblemPayLoad(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid sx={{ width: "100%" }} item pt={2}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id="panel3a-header"
            >
              <Typography>Physical Exam</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction="column">
                <Grid item>
                  <Typography pb={1}>General</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setGeneral(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>Eyes</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setEyes(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>HENT</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setHENT(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>Resp</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setResp(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>Neck</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setNeck(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>CVS</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setCVS(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>Breast</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setBreast(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>Abdom</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setAbdom(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>GU</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setGU(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>MSS</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setMSS(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>NS</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setNS(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>Skin</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setSkin(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>Lymph</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setLymph(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>Psych</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setPsych(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>Rectal</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setRectal(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid sx={{ width: "100%" }} item pt={2}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id="panel4a-header"
            >
              <Typography>ROS</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction="column">
                <Grid item>
                  <Typography pb={1}>General</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setRosGeneral(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>Eyes</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setRosEyes(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>HENT</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setRosHENT(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>Resp</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setRosResp(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>Neck</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setRosNeck(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>CVS</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setRosCVS(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>Breast</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setRosBreast(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>Abdom</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setRosAbdom(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>GU</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setRosGU(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>MSS</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setRosMSS(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>NS</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setRosNS(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>Skin</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setRosSkin(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>Lymph</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setRosLymph(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>Psych</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setRosPsych(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
                <Grid item pt={2}>
                  <Typography pb={1}>Rectal</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setRosRectal(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid sx={{ width: "100%" }} item pt={2}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id="panel4a-header"
            >
              <Typography>Allergies</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction="column">
                <Grid item>
                  <Typography pb={1}>Allergies</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setAllergy(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid sx={{ width: "100%" }} item pt={2}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id="panel4a-header"
            >
              <Typography>Past History</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction="column">
                <Grid item>
                  <Typography pb={1}>Past History</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setpastHistory(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid sx={{ width: "100%" }} item pt={2}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id="panel4a-header"
            >
              <Typography>Surgical History</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction="column">
                <Grid item>
                  <Typography pb={1}>Surgical History</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setsurgicalHistory(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid sx={{ width: "100%" }} item pt={2}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id="panel4a-header"
            >
              <Typography>Family History</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction="column">
                <Grid item>
                  <Typography pb={1}>Family History</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setfamilyHistory(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid sx={{ width: "100%" }} item pt={2}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id="panel4a-header"
            >
              <Typography>Social History</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction="column">
                <Grid item>
                  <Typography pb={1}>Social History</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setsocialHistory(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid sx={{ width: "100%" }} item pt={2}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id="panel4a-header"
            >
              <Typography>Habbits</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction="column">
                <Grid item>
                  <Typography pb={1}>Habbits</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          sethabbits(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid sx={{ width: "100%" }} item pt={2}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id="panel4a-header"
            >
              <Typography>Medications</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction="column">
                <Grid item>
                  <Typography pb={1}>Medications</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setmedications(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid sx={{ width: "100%" }} item pt={2}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id="panel4a-header"
            >
              <Typography>Assesment Plan</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction="column">
                <Grid item>
                  <Typography pb={1}>Assesment Plan</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setassesmentPlan(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid sx={{ width: "100%" }} item pt={2}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id="panel4a-header"
            >
              <Typography>Follow up</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction="column">
                <Grid item>
                  <Typography pb={1}>Follow up</Typography>
                  {!disabled && (
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        if (e.target?.value && e.target?.value !== null)
                          setfollowup(e.target?.value);
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid
          container
          item
          style={{
            display: "flex",
            flexDirection: "row",
            width: "60%",
            paddingTop: 12,
          }}
          justifyContent={"space-between"}
        >
          <Button
            onClick={() => {
              onSaveNote();
              onCancelClick();
            }}
            variant="contained"
          >
            Sign
          </Button>
          <Button
            onClick={() => {
              onSaveNoteAsDraft();
              onCancelClick();
            }}
            disabled={disabled}
            variant="contained"
          >
            Save As Draft
          </Button>
          <Button
            onClick={onCancelClick}
            disabled={disabled}
            variant="contained"
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default CreateNotes;
