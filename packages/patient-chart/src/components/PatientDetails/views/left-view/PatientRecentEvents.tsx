"use client";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import Typography from "@mui/material/Typography";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import MuiTimeline from "@mui/lab/Timeline";
import Button from "@mui/material/Button";
import type { TimelineProps } from "@mui/lab/Timeline";

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  "& .MuiTimelineItem-root": {
    width: "100%",
    "&:before": {
      display: "none",
    },
  },
});

const PatientRecentEvents = () => {
  return (
    <div className="flex flex-col items-center w-full">
  
      <Card className="w-full max-w-md shadow-lg rounded-lg">
        <CardHeader title="Recent Events" />
        <CardContent>
          <Timeline>
            {/* Event 1 */}
            <TimelineItem className="py-6">
              <TimelineSeparator>
                <TimelineDot color="primary" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <div className="flex flex-wrap items-center justify-between gap-x-2 mb-2.5">
                  <Typography
                    className="font-medium break-words max-w-[10rem]"
                    color="text.primary"
                  >
                    15 Orders Processed
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    15 min ago
                  </Typography>
                </div>
                <Typography className="mb-2 break-words max-w-[10rem]">
                  Prescribed 200mg Ibuprofen
                </Typography>
                <div className="flex items-center gap-2.5 rounded bg-gray-100 px-2 py-1">
                  <img
                    height={20}
                    alt="order.pdf"
                    src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                  />
                  <Typography className="font-medium break-words max-w-[10rem]">
                    invoice.pdf
                  </Typography>
                </div>
              </TimelineContent>
            </TimelineItem>

            {/* Event 2 */}
            <TimelineItem className="py-6">
              <TimelineSeparator>
                <TimelineDot color="success" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <div className="flex flex-wrap items-center justify-between gap-x-2 mb-2.5">
                  <Typography
                    className="font-medium break-words max-w-[10rem]"
                    color="text.primary"
                  >
                    Team Meeting Scheduled
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    1 hour ago
                  </Typography>
                </div>
                <Typography className="mb-2 break-words max-w-[10rem]">
                  Meeting with marketing team @11:00 AM
                </Typography>
                <div className="flex items-center gap-2.5">
                  <Avatar src="/images/avatars/1.png" className="w-8 h-8" />
                  <div className="flex flex-col">
                    <Typography
                      variant="body2"
                      className="font-medium break-words max-w-[10rem]"
                    >
                      Alex Johnson (Manager)
                    </Typography>
                    <Typography variant="body2">Head of Marketing</Typography>
                  </div>
                </div>
              </TimelineContent>
            </TimelineItem>

            {/* Event 3 */}
            <TimelineItem className="py-6">
              <TimelineSeparator>
                <TimelineDot color="info" />
              </TimelineSeparator>
              <TimelineContent>
                <div className="flex flex-wrap items-center justify-between gap-x-2 mb-2.5">
                  <Typography
                    className="font-medium break-words max-w-[10rem]"
                    color="text.primary"
                  >
                    Project Launched Successfully
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    2 days ago
                  </Typography>
                </div>
                <Typography className="mb-2 break-words max-w-[10rem]">
                  The client project was deployed successfully
                </Typography>
                <div className="flex items-center gap-2.5">
                  <Avatar src="/images/avatars/2.png" className="w-8 h-8" />
                  <div className="flex flex-col">
                    <Typography
                      variant="body2"
                      className="font-medium break-words max-w-[10rem]"
                    >
                      Sarah Parker (Developer)
                    </Typography>
                    <Typography variant="body2">Software Engineer</Typography>
                  </div>
                </div>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientRecentEvents;
