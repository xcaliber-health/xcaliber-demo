import { Typography, Box } from "@mui/material";

const Watermark = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        right: 0,
        color: "#5c6f84",
        opacity: 0.35,
      }}
    >
      <Typography sx={{ fontSize: "40px" }}>XCALIBER-DEMO</Typography>
      <Typography sx={{ fontSize: "20px" }}>
        Do not add any real data here
      </Typography>
    </Box>
  );
};

export default Watermark;
