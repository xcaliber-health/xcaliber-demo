import { EPIC_XCHANGE_ENDPOINT, XCHANGE_SERVICE_ENDPOINT } from "./constants";

export const Helper = {
  getDayFromIndex: (dayNumber: number) => {
    switch (dayNumber) {
      case 0:
        return "Sun";
      case 1:
        return "Mon";
      case 2:
        return "Tue";
      case 3:
        return "Wed";
      case 4:
        return "Thu";
      case 5:
        return "Fri";
      case 6:
        return "Sat";
      default:
        return "Invalid Choice";
    }
  },

  getMonthFromIndex: (dayNumber: number) => {
    switch (dayNumber) {
      case 0:
        return "Jan";
      case 1:
        return "Feb";
      case 2:
        return "Mar";
      case 3:
        return "Apr";
      case 4:
        return "May";
      case 5:
        return "Jun";
      case 6:
        return "Jul";
      case 7:
        return "Aug";
      case 8:
        return "Sep";
      case 9:
        return "Oct";
      case 10:
        return "Nov";
      case 11:
        return "Dec";
      default:
        return "Invalid Choice";
    }
  },

  extractFieldsFromDate: (date: any) => {
    let dateObject = new Date(
      new Date(date).toLocaleString(`en-US`, {
        timeZone: localStorage.getItem(`DEPARTMENT_TIMEZONE`) || "UTC",
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

  convertRTFToPlainText: (rtf: any) => {
    try {
      if (rtf) {
        let str = rtf.toString();
        str = str.replace(/\\par[d]?/g, "");
        str = str.replace(/\\X0A\\/g, "\n");
        str = str.replace(
          /\{\*?\\[^{}]+}|[{}]|\\\n?[A-Za-z]+\n?(?:-?\d+)?([a-zA-Z]+)?[ ]?/g,
          ""
        );
        str = str.replace(/\\'[0-9a-zA-Z]{2}/g, "").trim();
        str = str.replace(/\\/g, "");
        //convert to base 64
        return str;
      } else {
        return "";
      }
    } catch (err) {
      if (err instanceof Error) {
        throw `failed to convert rtf to plain text with error - ${err.message}`;
      } else {
        throw "failed to convert rtf to plain text with an unknown error";
      }
    }
  },

  getSourceUrl: () => {
    let sourceType = localStorage.getItem("XCALIBER_SOURCE");
    if (sourceType === "ECW") {
      return "https://sandbox.xcaliberapis.com/hp/fhir-gateway/fhir/R4";
    }
    return sourceType === "EPIC"
      ? EPIC_XCHANGE_ENDPOINT
      : XCHANGE_SERVICE_ENDPOINT;
  },

  getSourceToken: () => {
    if (localStorage.getItem("XCALIBER_SOURCE") === "ECW") {
      return `U2FsdGVkX18fBnPrIlIV6TYkZYAILjiY8JkxkWdiYk6hxjUTALqYczvifBwf13iNVTm90kW1OyEPk8VaFiXjquObO5QFdDZ7F85s017oQsQtmhdG7mm+9O7pR9fdmGvBk2OVlWMsnXyGPb9iuXDEEdeWfH28+DvhxzzoiGMwk3+qrbrOP4Me+av3MSbUJdXr/0KQ2u6A7SFY2L/dMnGgjn2hDZvDb2Mr7WuVjktxc8bKqzUC3Wd2ZPncY07oq8Z1ssohOMFqFw0feTcMy3QbHLd0AqjSaIkhAyDr6I0HJebQBYVnkhUr0uD4DC3WG7CvHsMvPw5HmdPaBwuxD0OgfRQTNJGX5A1lYXui12t5gtqOQyNImng/t2DrABn0PtPFTq2ShtPTSvFlX9EgZU9LEw==`;
    }
    return localStorage.getItem("XCALIBER_SOURCE") === "EPIC"
      ? `${process.env.NEXT_PUBLIC_EPIC_AUTHORIZATION}`
      : `${process.env.NEXT_PUBLIC_AUTHORIZATION}`;
  },
};
