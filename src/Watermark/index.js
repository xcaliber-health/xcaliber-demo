import { Typography, Box } from "@mui/material";
import logo from "../static/xcaliber_logo.png";

const Watermark = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        zIndex: 1000000,
        color: "black",
        opacity: 0.35,
      }}
    >
      <Typography variant="body2">Powered by</Typography>
      <Box component="img" sx={{ height: 40 }} src={logo} />
    </Box>
  );
};

export default Watermark;
