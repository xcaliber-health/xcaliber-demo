import { Box, CircularProgress as Spinner } from "@mui/material";

const Loading = () => (
  <Box
    height="100%"
    display="flex"
    justifyContent={"center"}
    alignItems="center"
  >
    <Spinner />
  </Box>
);
export default Loading;
