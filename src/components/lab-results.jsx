"use client";

import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const labData = [
  {
    name: "Complete Blood Count (CBC)",
    tests: [
      {
        name: "Hemoglobin",
        value: "13.8 g/dL",
        range: "12.0-15.5",
        status: "Normal",
      },
      {
        name: "White Blood Cells",
        value: "7.8 K/µL",
        range: "4.5-11.0",
        status: "Normal",
      },
      {
        name: "Platelets",
        value: "140 K/µL",
        range: "150-450",
        status: "Low",
      },
    ],
  },
  {
    name: "Basic Metabolic Panel",
    tests: [
      {
        name: "Glucose",
        value: "142 mg/dL",
        range: "70-99",
        status: "High",
      },
      {
        name: "Creatinine",
        value: "0.9 mg/dL",
        range: "0.6-1.2",
        status: "Normal",
      },
      {
        name: "Potassium",
        value: "4.0 mEq/L",
        range: "3.5-5.0",
        status: "Normal",
      },
    ],
  },
  {
    name: "Lipid Panel",
    tests: [
      {
        name: "Total Cholesterol",
        value: "210 mg/dL",
        range: "125-200",
        status: "High",
      },
      {
        name: "HDL",
        value: "55 mg/dL",
        range: "40-60",
        status: "Normal",
      },
      {
        name: "LDL",
        value: "135 mg/dL",
        range: "<130",
        status: "High",
      },
    ],
  },
];

export default function LabResults() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Lab Results Summary</h1>
        <div className="text-muted-foreground">
          <p>Jane Smith • ID: PT-483291</p>
        </div>
      </div>

      <Accordion type="multiple" className="space-y-4">
        {labData.map((panel) => (
          <AccordionItem
            key={panel.name}
            value={panel.name}
            className="border rounded-lg px-6"
          >
            <AccordionTrigger className="hover:no-underline bg-white">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{panel.name}</h2>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 py-4">
                {panel.tests.map((test) => (
                  <div
                    key={test.name}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center"
                  >
                    <div className="font-medium">{test.name}</div>
                    <div
                      className={`font-semibold ${
                        test.status === "Normal"
                          ? "text-green-600"
                          : test.status === "Low"
                          ? "text-blue-600"
                          : "text-red-600"
                      }`}
                    >
                      {test.value}
                    </div>
                    <div className="text-muted-foreground">{test.range}</div>
                    <div
                      className={`${
                        test.status === "Normal"
                          ? "text-green-600"
                          : test.status === "Low"
                          ? "text-blue-600"
                          : "text-red-600"
                      }`}
                    >
                      {test.status}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="text-sm text-muted-foreground space-y-1">
        <div className="flex items-center gap-2">
          <span>Collected: Feb 12, 2025 08:30 AM</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Reported: Feb 12, 2025 10:45 AM</span>
        </div>
      </div>
    </div>
  );
}
