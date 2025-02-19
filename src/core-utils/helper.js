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
      ? process.env.NEXT_PUBLIC_EPIC_AUTHORIZATION
      : process.env.NEXT_PUBLIC_AUTHORIZATION;
  },
};
