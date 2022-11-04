import {
  Grid,
  Typography,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { NoteService } from "../services/P360/noteService";

const DraftNotes = ({
  patientDetails,
  onCancelClick,
  disabled,
  reloadNotes,
  note,
}) => {
  const [problemPayLoad, setProblemPayLoad] = useState("");
  const [allergyList, setAllergy] = useState("");
  const [pastHistory, setpastHistory] = useState("");
  const [surgicalHistory, setsurgicalHistory] = useState("");
  const [familyHistory, setfamilyHistory] = useState("");
  const [socialHistory, setsocialHistory] = useState("");
  const [habits, sethabits] = useState("");
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
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    for (let i = 0; i < note?.resource?.content?.length; i++) {
      const noteContent = note?.resource?.content?.[i];

      const { attachment } = noteContent;
      if (!noteContent?.format) {
        if (attachment?.title === "Problem" && attachment?.data !== "") {
          setProblemPayLoad(attachment?.data);
        } else if (
          attachment?.title === "Allergies" &&
          attachment?.data !== ""
        ) {
          setAllergy(attachment?.data);
        } else if (attachment?.title === "Past" && attachment?.data !== "") {
          setpastHistory(attachment?.data);
        } else if (
          attachment?.title === "Surgical" &&
          attachment?.data !== ""
        ) {
          setsurgicalHistory(attachment?.data);
        } else if (attachment?.title === "Family" && attachment?.data !== "") {
          setfamilyHistory(attachment?.data);
        } else if (attachment?.title === "Social" && attachment?.data !== "") {
          setsocialHistory(attachment?.data);
        } else if (attachment?.title === "Habits" && attachment?.data !== "") {
          sethabits(attachment?.data);
        } else if (attachment?.title === "Med" && attachment?.data !== "") {
          setmedications(attachment?.data);
        } else if (
          attachment?.title === "Assessplan" &&
          attachment?.data !== ""
        ) {
          setassesmentPlan(attachment?.data);
        } else if (
          attachment?.title === "Followup" &&
          attachment?.data !== ""
        ) {
          setfollowup(attachment?.data);
        }
      } else if (noteContent?.format?.display?.toLowerCase() === "pe") {
        physicalExam.push({
          data: attachment?.data,
          title: attachment?.title,
        });
      } else if (noteContent?.format?.display?.toLowerCase() === "ros") {
        ros.push({
          data: attachment?.data,
          title: attachment?.title,
        });
      }
    }

    setFlag(true);
  }, []);
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
    if (habits !== "") {
      content.push({
        attachment: {
          contentType: "text/plain",
          data: habits,
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
    const note = await NoteService.createNote({ data: { ...notePayLoad } });
  };

  const onSignClick = async () => {
    await onSaveNote();
    onCancelClick();
    reloadNotes(patientDetails?.id);
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
  if (flag) {
    return (
      <Grid container>
        <Grid item pt={2} sx={{ width: "100%" }}>
          <Grid item pt={2}>
            <Typography variant="h4">{`Update Draft Notes`}</Typography>
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
                        value={problemPayLoad}
                        onChange={(e) => {
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
                        value={general}
                        onChange={(e) => {
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
                        value={eyes}
                        onChange={(e) => {
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
                        value={hent}
                        onChange={(e) => {
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
                        value={neck}
                        onChange={(e) => {
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
                        value={cvs}
                        onChange={(e) => {
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
                        value={breast}
                        onChange={(e) => {
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
                        value={abdom}
                        onChange={(e) => {
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
                        value={gu}
                        onChange={(e) => {
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
                        value={mss}
                        onChange={(e) => {
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
                        value={ns}
                        onChange={(e) => {
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
                        value={skin}
                        onChange={(e) => {
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
                        value={lymph}
                        onChange={(e) => {
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
                        value={psych}
                        onChange={(e) => {
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
                        value={rectal}
                        onChange={(e) => {
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
                        value={rosgeneral}
                        onChange={(e) => {
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
                        value={roseyes}
                        onChange={(e) => {
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
                        value={roshent}
                        onChange={(e) => {
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
                        value={rosresp}
                        onChange={(e) => {
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
                        value={rosneck}
                        onChange={(e) => {
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
                        value={roscvs}
                        onChange={(e) => {
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
                        value={rosbreast}
                        onChange={(e) => {
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
                        value={rosabdom}
                        onChange={(e) => {
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
                        value={rosgu}
                        onChange={(e) => {
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
                        value={rosmss}
                        onChange={(e) => {
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
                        value={rosns}
                        onChange={(e) => {
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
                        value={rosskin}
                        onChange={(e) => {
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
                        value={roslymph}
                        onChange={(e) => {
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
                        value={rospsych}
                        onChange={(e) => {
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
                        value={rosrectal}
                        onChange={(e) => {
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
                        value={allergyList}
                        onChange={(e) => {
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
                        value={pastHistory}
                        onChange={(e) => {
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
                        value={surgicalHistory}
                        onChange={(e) => {
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
                        value={familyHistory}
                        onChange={(e) => {
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
                        value={socialHistory}
                        onChange={(e) => {
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
                <Typography>Habits</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container direction="column">
                  <Grid item>
                    <Typography pb={1}>Habits</Typography>
                    {!disabled && (
                      <TextField
                        sx={{ width: "100%" }}
                        value={habits}
                        onChange={(e) => {
                          sethabits(e.target?.value);
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
                        value={medications}
                        onChange={(e) => {
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
                        value={assesmentPlan}
                        onChange={(e) => {
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
                        value={followup}
                        onChange={(e) => {
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
            <Button onClick={onSignClick} variant="contained">
              Sign
            </Button>

            <Button
              onClick={() => {
                onSaveNoteAsDraft();
                onCancelClick();
              }}
              variant="contained"
            >
              Save as Draft
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
  }
};
export default DraftNotes;
