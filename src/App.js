import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Dashboard from "./Dashboard";
import { BrowserRouter } from "react-router-dom";
import { SocketService } from "./socket";
function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function App() {
  const socket = SocketService.getSocket();
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket Connected");
    });

    socket.on("disconnect", () => {
      console.log("Socket Disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
}
