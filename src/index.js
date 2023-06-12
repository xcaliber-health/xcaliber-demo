import * as React from "react";
import { createRoot } from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import App from "./App";
import theme from "./theme";
import { Provider } from "react-redux";
import PopupHOC from "./Popup/PopupHOC";
import store from "./Redux/store";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
const EnhancedApp = PopupHOC(App);
root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <EnhancedApp></EnhancedApp>
    </ThemeProvider>
  </Provider>
);
