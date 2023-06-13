import { Typography, Box } from "@mui/material";
import logo from "../static/Watermark.png";

const Watermark = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: "15%",
        "z-index": 1000,
        color: "#5c6f84",
        opacity: 0.35,
      }}
    >
      <Typography variant="body2">Powered by</Typography>
      <Box component="img" sx={{ height: 40 }} src={logo} />
    </Box>
  );
};

export default Watermark;
