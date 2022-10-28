import { Typography, Box } from "@mui/material";
import logo from "../static/xcaliber_logo.png";

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
      <Typography sx={{ fontSize: "20px" }}>
        Powered by
      </Typography>
      <Box component="img" sx={{ height: 40 }} src={logo} />

      <Typography sx={{ fontSize: "20px" }}>
        Do not add any real data here
      </Typography>
    </Box>
  );
};

export default Watermark;
