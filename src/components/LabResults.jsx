"use client";

import { useEffect, useState } from "react";
import { DiagnosticService } from "../services/diagnosticService";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export default function LabResults({ patientId, departmentId, sourceId }) {
  const [labData, setLabData] = useState([]);
  const [patientInfo, setPatientInfo] = useState({ name: "", id: "" });
  const [collectionDate, setCollectionDate] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [loading, setLoading] = useState(true);

  function formatDateTime(dateString) {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await DiagnosticService.getDiagnosticReport(
          patientId,
          departmentId,
          sourceId
        );
        console.log("Diagnostic Report Response:", response);

        if (!response.data || !response.data.entry) return;

        const reports = response.data.entry.map((entry) => entry.resource);
        if (reports.length === 0) return;

        const patientReference = reports[0].subject?.reference || "Unknown";
        setPatientInfo({
          id: patientReference.split("/").pop(),
        });

        setCollectionDate(
          formatDateTime(reports[0].effectiveDateTime) || "Unknown"
        );
        setReportDate(formatDateTime(reports[0].issued) || "Unknown");

        const latestReportsMap = new Map();

        reports.forEach((report) => {
          const testGroupName = report.code?.text || "Unknown Test Group";
          const issuedDate = new Date(report.issued).getTime();

          if (
            !latestReportsMap.has(testGroupName) ||
            latestReportsMap.get(testGroupName).issuedDate < issuedDate
          ) {
            const tests = [];
            try {
              const testResults = JSON.parse(report.text.div);
              for (const [key, value] of Object.entries(testResults)) {
                tests.push({
                  name: formatFieldLabel(key),
                  value: value.toString(),
                });
              }
            } catch (error) {
              console.warn("Failed to parse test details", error);
            }

            latestReportsMap.set(testGroupName, {
              name: testGroupName,
              tests,
              issuedDate,
            });
          }
        });

        const sortedPanels = [...latestReportsMap.values()].sort((a, b) => {
          const createdA = a.tests.find(
            (test) => test.name === "Createddatetime"
          )?.value;
          const createdB = b.tests.find(
            (test) => test.name === "Createddatetime"
          )?.value;

          return new Date(createdB) - new Date(createdA);
        });

        latestReportsMap;
        setLabData(sortedPanels);
      } catch (error) {
        console.error("Error fetching diagnostic report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId, departmentId, sourceId]);

  function formatFieldLabel(label) {
    return label
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Lab Results Summary</h1>
        <div className="text-muted-foreground">
          <p>
            <span className="font-semibold">Patient ID:</span> {patientInfo.id}
          </p>
        </div>
      </div>

      {loading ? (
        // Shimmer Effect While Loading
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="border rounded-lg animate-pulse bg-gray-200 p-4"
            >
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {labData.map((panel) => {
            const createdDateTime = panel.tests.find(
              (test) => test.name === "Createddatetime"
            )?.value;

            return (
              <AccordionItem
                key={panel.name}
                value={panel.name}
                className="border rounded-lg"
              >
                <AccordionTrigger className="hover:no-underline bg-white px-6 rounded-lg transition-colors duration-300 data-[state=open]:bg-[#D1E9FF]">
                  <div className="flex flex-col gap-2 justify-center w-full">
                    <h2 className="text-xl font-semibold">{panel.name}</h2>
                    <span className="text-sm text-gray-500">
                      Created: {formatDateTime(createdDateTime)}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0 border-none">
                  <div className="pt-2">
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-2 bg-white">
                        {panel.tests.map((test, index) => (
                          <div
                            key={test.name}
                            className={`flex items-center justify-between gap-4 md:gap-10 px-6 py-3 border-b border-gray-300 
              ${index % 2 !== 0 ? "md:border-l border-gray-300" : ""} 
              bg-white hover:bg-gray-50 transition
             ${
               index === panel.tests.length - 1 && panel.tests.length % 2 !== 0
                 ? "md:border-r border-gray-300"
                 : ""
             }`}
                          >
                            <div className="font-medium text-gray-700">
                              {test.name}
                            </div>
                            <div className="font-semibold text-blue-700">
                              {test.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}

      <div className="text-sm text-muted-foreground space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Collected:</span> {collectionDate}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Reported:</span> {reportDate}
        </div>
      </div>
    </div>
  );
}
