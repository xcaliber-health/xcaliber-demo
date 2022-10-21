import { Typography, Box } from "@mui/material";

const Watermark = () => {
  return (
    <Box sx={{ position: "absolute", bottom: 0, right: 0 }}>
      <Typography sx={{ color: "#5c6f84", opacity: 0.35, fontSize: "40px" }}>
        XCALIBER-DEMO
      </Typography>
    </Box>
  );
};

export default Watermark;
