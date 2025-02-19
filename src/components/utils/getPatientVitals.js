import { VitalService } from "../../services/vitalService";
import { Helper } from "../../core-utils/helper";

export const fetchVitals = async (id, sourceId, departmentId) => {
  const response = await VitalService.getVitals(id, sourceId, departmentId);
  let data = {};

  response.forEach((vital) => {
    let dateObject =
      localStorage.getItem("XCALIBER_SOURCE") === "ECW"
        ? Helper.extractFieldsFromDate(vital?.resource?.effectiveDateTime)
        : Helper.extractFieldsFromDate(
            vital?.resource?.extension?.find((ext) => {
              return (
                ext?.url?.endsWith("observation-document-date") ||
                ext?.url?.endsWith("created-date")
              );
            })?.valueString
          );

    const name = vital?.resource?.code?.coding?.[0]?.display;
    let value;

    if (name.toLowerCase().includes("body mass index")) {
      value =
        vital?.resource?.valueString || vital?.resource?.valueQuantity?.value;
    } else if (name.toLowerCase() === "blood pressure") {
      let systolic, diastolic;
      vital?.resource?.component?.forEach((code) => {
        if (code?.code?.coding?.[0]?.code === "8462-4") {
          diastolic = code?.valueQuantity?.value;
        } else if (code?.code?.coding?.[0]?.code === "8480-6") {
          systolic = code?.valueQuantity?.value;
        }
      });
      value = `${systolic}/${diastolic}`;
    } else {
      value = vital?.resource?.valueQuantity?.unit
        ? `${vital?.resource?.valueQuantity?.value} ${vital?.resource?.valueQuantity?.unit}`
        : vital?.resource?.valueQuantity?.value;
    }

    let date = `${dateObject?.DAY} ${dateObject?.MONTH} ${dateObject?.DATE}`;
    let year = dateObject?.YEAR;
    let cal_date = new Date(
      `${dateObject?.MONTH} ${dateObject?.DATE} ${dateObject?.YEAR}`
    );

    if (Object.keys(data).includes(name)) {
      const values = data[name];
      let low = 0,
        high = values.length;
      let val = { value, date, year };

      while (low < high) {
        let mid = (low + high) >>> 1;
        let dum_date = new Date(
          `${values[mid].date.slice(4, 10)} ${values[mid].year}`
        );
        if (dum_date > cal_date) low = mid + 1;
        else high = mid;
      }

      let temp;
      for (let i = low; typeof values[i] !== "undefined"; i++) {
        temp = values[i];
        values[i] = val;
        val = temp;
      }
      values.push(val);
    } else {
      data[name] = [{ value, date, year }];
    }
  });

  const transformedData = Object.keys(data).flatMap((key) => {
    const values = data[key];

    return [
      {
        measurement: key,
        value: values[0].value,
        last_updated: `${values[0].date}, ${values[0].year}`,
      },
    ];
  });

  return transformedData;
};
