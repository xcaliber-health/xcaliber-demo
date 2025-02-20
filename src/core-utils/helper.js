import { EPIC_XCHANGE_ENDPOINT, XCHANGE_SERVICE_ENDPOINT } from "./constants";

export const Helper = {
  getDayFromIndex: (dayNumber) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[dayNumber] || "Invalid Choice";
  },

  getMonthFromIndex: (monthNumber) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[monthNumber] || "Invalid Choice";
  },

  extractFieldsFromDate: (date) => {
    let dateObject = new Date(
      new Date(date).toLocaleString("en-US", {
        timeZone: localStorage.getItem("DEPARTMENT_TIMEZONE") || "UTC",
      })
    );
    return {
      DAY: Helper.getDayFromIndex(dateObject.getDay()),
      MONTH: Helper.getMonthFromIndex(dateObject.getMonth()),
      DATE: dateObject.getDate(),
      YEAR: dateObject.getFullYear(),
      TIME: dateObject.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  },

  convertRTFToPlainText: (rtf) => {
    try {
      if (!rtf) return "";

      let str = rtf.toString();
      str = str
        .replace(/\\par[d]?/g, "")
        .replace(/\\X0A\\/g, "\n")
        .replace(
          /\{\*?\\[^{}]+}|[{}]|\\\n?[A-Za-z]+\n?(?:-?\d+)?([a-zA-Z]+)?[ ]?/g,
          ""
        )
        .replace(/\\'[0-9a-zA-Z]{2}/g, "")
        .replace(/\\/g, "")
        .trim();

      return str;
    } catch (err) {
      throw `failed to convert rtf to plain text with error - ${
        err.message || "unknown error"
      }`;
    }
  },

  getSourceUrl: () => {
    const sourceType = localStorage.getItem("XCALIBER_SOURCE");
    return sourceType === "ECW"
      ? "https://sandbox.xcaliberapis.com/hp/fhir-gateway/fhir/R4"
      : sourceType === "EPIC"
      ? EPIC_XCHANGE_ENDPOINT
      : XCHANGE_SERVICE_ENDPOINT;
  },

  getSourceToken: () => {
    if (localStorage.getItem("XCALIBER_SOURCE") === "ECW") {
      return `U2FsdGVkX18fBnPrIlIV6TYkZYAILjiY8JkxkWdiYk6hxjUTALqYczvifBwf13iNVTm90kW1OyEPk8VaFiXjquObO5QFdDZ7F85s017oQsQtmhdG7mm+9O7pR9fdmGvBk2OVlWMsnXyGPb9iuXDEEdeWfH28+DvhxzzoiGMwk3+qrbrOP4Me+av3MSbUJdXr/0KQ2u6A7SFY2L/dMnGgjn2hDZvDb2Mr7WuVjktxc8bKqzUC3Wd2ZPncY07oq8Z1ssohOMFqFw0feTcMy3QbHLd0AqjSaIkhAyDr6I0HJebQBYVnkhUr0uD4DC3WG7CvHsMvPw5HmdPaBwuxD0OgfRQTNJGX5A1lYXui12t5gtqOQyNImng/t2DrABn0PtPFTq2ShtPTSvFlX9EgZU9LEw==`;
    }
    return localStorage.getItem("XCALIBER_SOURCE") === "EPIC"
      ? "ApiKey U2FsdGVkX18fBnPrIlIV6TYkZYAILjiY8JkxkWdiYk6hxjUTALqYczvifBwf13iNVTm90kW1OyEPk8VaFiXjquObO5QFdDZ7F85s017oQsQtmhdG7mm+9O7pR9fdmGvBk2OVlWMsnXyGPb9iuXDEEdeWfH28+DvhxzzoiGMwk3+qrbrOP4Me+av3MSbUJdXr/0KQ2u6A7SFY2L/dMnGgjn2hDZvDb2Mr7WuVjktxc8bKqzUC3Wd2ZPncY07oq8Z1ssohOMFqFw0feTcMy3QbHLd0AqjSaIkhAyDr6I0HJebQBYVnkhUr0uD4DC3WG7CvHsMvPw5HmdPaBwuxD0OgfRQTNJGX5A1lYXui12t5gtqOQyNImng/t2DrABn0PtPFTq2ShtPTSvFlX9EgZU9LEw=="
      : "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnN0YW5jZVVybCI6Imh0dHBzOi8vYmxpdHoueGNhbGliZXJhcGlzLmNvbS94Y2FsaWJlci1kZXYiLCJ4Y2FsaWJlci1oZWFsdGguc2VydmljZS1hY2NvdW50LmlkIjoiMGUyMTI4YzEtNzkwNy00ZTMwLTgxOTgtNzUyYzMzMGIxMjRjIiwieGNhbGliZXItaGVhbHRoLmFjY291bnQuaWQiOiJiN2ZmNTc1OS1iZGJkLTQ0YmMtOWNhZC0yYzJjMzI3ZDJmYmQiLCJ4Y2FsaWJlci1oZWFsdGguaW5zdGFuY2UuaWQiOiI4OGJjYTgxYS05NWE0LTRhM2UtYjI1Mi1mZjYyMzVmNWI5YzYiLCJ1c2VyIjp7InVzZXJJZCI6ImI1M2VmNzJmLWVmNDYtNGQ5Yi1iMjhiLTJkZTI2OTJiYThiYSIsInVzZXJOYW1lIjoiSm9obiBTbWl0aCJ9LCJ4Y2FsaWJlci1oZWFsdGguc2NvcGVzIjpbIjg4YmNhODFhLTk1YTQtNGEzZS1iMjUyLWZmNjIzNWY1YjljNi4qIl0sImNsYWltcyI6WyJtb2RlbHM6KiIsImFjdGl2aXRpZXM6KiIsIkFjdGl2aXRpZXM6KiIsInRhZ3M6KiIsImF0dHJpYnV0ZXM6KiIsImVudGl0aWVzOioiLCJwcm92aWRlci5lbnRyaWVzOioiLCJwYXRpZW50LmVudHJpZXM6KiIsInByb3ZpZGVyLXRvdGFsLmVudHJpZXM6KiIsIkNhc2VzLmVudHJpZXM6KiIsIlByb2ZpbGUuZW50cmllczoqIiwiVXNlci5lbnRyaWVzOioiLCJSb2xlLmVudHJpZXM6KiIsInZpZXcuZW50cmllczoqIiwiQ29kZXIuZW50cmllcyIsIm9yY2hfZXZlbnRzLmVudHJpZXM6KiIsInVzZXJ2aWV3cy5lbnRyaWVzOioiLCJWaWV3LmVudHJpZXM6KiIsIndvcmtlci5lbnRyaWVzOioiLCJyb2xlLmVudHJpZXM6KiIsIndvcmtpdGVtLmVudHJpZXM6KiIsInBlcm1pc3Npb25fcG9saWN5LmVudHJpZXM6KiIsImNvbGxlY3Rpb24uZW50cmllczoqIiwiZmlsdGVyLmVudHJpZXM6KiIsIm9yY2hlc3RyYXRpb25fd29ya2Zsb3dfc3RhdGlzdGljcy5lbnRyaWVzOioiLCJvcmNoZXN0cmF0aW9uX2V2ZW50LmVudHJpZXM6KiIsIndvcmtmbG93LmVudHJpZXM6KiIsIm9yY2hlc3RyYXRpb25fd29ya2Zsb3cuZW50cmllczoqIiwiY29kZXNldHM6KiJdLCJncmFudFR5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJpc3N1ZXJVcmwiOiJodHRwOi8vYmxpdHoueGNhbGliZXJhcGlzLmNvbS9hcGkvdjEvYXV0aC90b2tlblYyIiwiZXhwaXJ5QXQiOiIyMDI1LTEwLTE3VDIzOjU5OjU5WiIsImlhdCI6MTc0MDA3MDc3NCwiZXhwIjoxNzYwNzIwMzc0fQ.qUZ_5u7WFOMdFJNyW5xt9J71J8VgKiYd80UIB4_vrGswsH1zlHgOUIubYM5GSt-nYu_5WNREvCkZkcHcAVmKckpz7SKIomynki5cGHxMu8tXuaLIf-XqKo5D_AgbidPWOuSkkmTFejRWgW_ApuafYpB4t0raezTjLunYc20gBNT-B5iW0-6UFYUdO1WcvuP6AU0Srig50VENw5bb3FH92SWMowHaWHTTwsK-frD1TTYm0w6yAnDjEHplrfUbcVl-EVOKXuCVtlH1P0qsIo8bjbqnJYbcaNoz-0qIzI7zEDd5bSrW0GBB2IkdFWFFMy12P1mFvCuJxaB1jLXuFrIxlw";
  },
};
