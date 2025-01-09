import { VitalService } from "../../../../../../services/vitalService";
import { VitalsProps } from "../VitalDetails";
import { Helper } from "../../../../../../core-utils/helper";

export const fetchVitals = async (id): Promise<VitalsProps[]> => {
  const response = await VitalService.getVitals(id);
  let data: Record<
    string,
    Array<{ value: string; date: string; year: string }>
  > = {};

  response.map((vital) => {
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
      if (vital?.resource?.valueString) value = vital?.resource?.valueString;
      else value = vital?.resource?.valueQuantity.value;
    } else if (name.toLowerCase() === "blood pressure") {
      var systolic, diastolic;
      vital?.resource?.component?.map((code) => {
        if (code?.code?.coding?.[0]?.code === "8462-4") {
          diastolic = code?.valueQuantity?.value;
        } else if (code?.code?.coding?.[0]?.code === "8480-6") {
          systolic = code?.valueQuantity?.value;
        }
      });
      value = systolic + "/" + diastolic;
    } else {
      if (vital?.resource?.valueQuantity?.unit)
        value =
          vital?.resource?.valueQuantity?.value +
          " " +
          vital?.resource?.valueQuantity?.unit;
      else value = vital?.resource?.valueQuantity?.value;
    }
    let date =
      dateObject?.DAY + " " + dateObject?.MONTH + " " + dateObject?.DATE;
    let year = dateObject?.YEAR;
    let cal_date = new Date(
      dateObject?.MONTH + " " + dateObject?.DATE + " " + dateObject?.YEAR
    );
    if (
      Object.keys(data).includes(vital?.resource?.code?.coding?.[0]?.display)
    ) {
      const values = data[name];
      var low = 0;
      var high = values.length;
      var val = {
        value: value,
        date: date,
        year: year,
      };
      while (low < high) {
        var mid = (low + high) >>> 1;
        var dum_date = new Date(
          values[mid].date.slice(4, 10) + " " + values[mid].year
        );
        if (dum_date > cal_date) low = mid + 1;
        else high = mid;
      }
      var temp;
      for (let i = low; typeof values[i] !== "undefined"; i++) {
        temp = values[i];
        values[i] = val;
        val = temp;
      }
      values.push(val);
    } else {
      data[name] = [
        {
          value: value,
          date: date,
          year: year,
        },
      ];
    }
  });

  const transformedData = Object.keys(data).flatMap((key) => {
    const values = data[key];

    return [
      {
        measurement: key,
        value: values[0].value,
        last_updated: `${values[0].date}, ${values[0].year}`,
        action: "view/edit",
      },
    ];
  });

  return transformedData;
};
