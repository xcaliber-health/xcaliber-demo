import { EPIC_XCHANGE_ENDPOINT, XCHANGE_SERVICE_ENDPOINT } from './constants';

export const Helper = {
  getDayFromIndex: (dayNumber) => {
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

  getMonthFromIndex: (dayNumber) => {
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

  extractFieldsFromDate: (date) => {
    let dateObject = new Date(
      new Date(date).toLocaleString(`en-US`, {
        timeZone: localStorage.getItem(`DEPARTMENT_TIMEZONE`),
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
      if (rtf) {
        let str = rtf.toString();
        str = str.replace(/\\par[d]?/g, '');
        str = str.replace(/\\X0A\\/g, '\n');
        str = str.replace(
          /\{\*?\\[^{}]+}|[{}]|\\\n?[A-Za-z]+\n?(?:-?\d+)?([a-zA-Z]+)?[ ]?/g,
          '',
        );
        str = str.replace(/\\'[0-9a-zA-Z]{2}/g, '').trim();
        str = str.replace(/\\/g, '');
        console.log(str);
        //convert to base 64
        return str;
      } else {
        return '';
      }
    } catch (err) {
      throw `failed to convert rtf to plain text with error - ${err?.message}`;
    }
  },

  getSourceUrl: () => {
    let sourceType = localStorage.getItem("XCALIBER_SOURCE");
    return sourceType === "EPIC" || sourceType === 'ECW'
      ? EPIC_XCHANGE_ENDPOINT
      : XCHANGE_SERVICE_ENDPOINT;
  },

  getSourceToken: () => {
    return localStorage.getItem("XCALIBER_SOURCE") === 'EPIC' || localStorage.getItem("XCALIBER_SOURCE") === 'ECW'
    ? `${process.env.REACT_APP_EPIC_AUTHORIZATION}`
    : `${process.env.REACT_APP_AUTHORIZATION}`
  }
};
