import { Badge } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { LabOrderService } from "../services/labOrderService";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { ReferenceDataService } from "../services/referenceDataService";
import { Combobox } from "./ui/combobox";
export default function LabOrderForm({
  patientId,
  departmentId,
  encounterId,
  sourceId,
  practitionerId,
  practiceId,
}) {
  // console.log(practiceId);
  const [formData, setFormData] = useState({
    collectionDate: "",
    collectionTime: "",
    approvingProvider: "Ach, Chip",
    orderingProvider: "Ach, Chip",
    npi1: "",
    npi2: "",
    accountName: "",
    address: "",
    phone: "",
    noteToLab: "",
    internalNote: "",
    stat: false,
    standingOrder: false,
    publishResults: false,
    reference: "",
  });
  const [referenceOptions, setReferenceOptions] = useState([]);

  const handleReferenceChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      reference: value,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const fetchReferenceData = async () => {
    try {
      const referenceData = await ReferenceDataService.getReferenceData(
        practiceId,
        sourceId
      );
      console.log("Reference Data Response:", referenceData);

      // Ensure it's always an array
      if (Array.isArray(referenceData)) {
        setReferenceOptions(referenceData);
      } else {
        setReferenceOptions([]); // Fallback to empty array
      }
    } catch (error) {
      console.error("Error fetching reference data:", error);
      setReferenceOptions([]); // Fallback in case of error
    }
  };

  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const referenceData = await ReferenceDataService.getReferenceData(
          practiceId,
          sourceId
        );
        console.log("Raw API Response:", referenceData);

        // Ensure we correctly access the nested 'result' array
        if (
          referenceData?.data?.result &&
          Array.isArray(referenceData.data.result)
        ) {
          console.log("Extracted Reference Data:", referenceData.data.result);
          setReferenceOptions(referenceData.data.result);
        } else {
          console.warn(
            "API Response did not contain 'result' array inside 'data'"
          );
          setReferenceOptions([]);
        }
      } catch (error) {
        console.error("Error fetching reference data:", error);
        setReferenceOptions([]);
      }
    };

    fetchReferenceData();
  }, [practiceId, sourceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      context: { departmentId: departmentId },
      data: {
        resourceType: "ServiceRequest",
        encounter: { reference: `Encounter/${encounterId}` },
        subject: { reference: `Patient/${patientId}` },
        contained: [],
        category: [
          {
            coding: [
              {
                system: "http://hl7.org/fhir/ValueSet/servicerequest-category",
                code: "108252007",
                display: "Lab",
              },
            ],
          },
          {
            coding: [
              {
                code: 342223,
                display: "Lab",
                system: "ATHENA",
              },
            ],
            text: "CMP, serum or plasma",
          },
        ],
        reasonCode: [
          {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "16331000",
                display: "injury of hip region",
              },
            ],
          },
        ],
        priority: formData.stat ? "urgent" : "routine",
        authoredOn: new Date().toISOString(),
        requester: { reference: `Practitioner/${practitionerId}` },
        performer: [
          { reference: "Organization/10848074", display: "CVS/Pharmacy #5590" },
        ],
        status: "REVIEW",
      },
    };

    try {
      const createLabOrder = await LabOrderService.createLabOrder(
        payload,
        sourceId
      );
      console.log("Create Lab Order Response:", createLabOrder);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-bold">LAB ORDER DETAILS</h1>
          <Badge className="bg-[#40E0D0] text-black">COMPLETE</Badge>
        </div>
        {/* Reference Dropdown */}
        <div>
          {/* <Select onValueChange={handleReferenceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a reference" />
            </SelectTrigger>
            <SelectContent>
              {referenceOptions.length > 0 ? (
                referenceOptions.map((option) => (
                  <SelectItem
                    key={option.ordertypeid}
                    value={option.ordertypeid.toString()}
                  >
                    {option.name}
                  </SelectItem>
                ))
              ) : (
                <p className="p-2 text-gray-500">No references found</p>
              )}
            </SelectContent>
          </Select> */}

          <Label>Reference</Label>
          <Combobox
            label="Select a reference"
            options={referenceOptions.map((option) => ({
              value: option.ordertypeid.toString(),
              label: option.name,
            }))}
            value={formData.reference}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, reference: value }))
            }
          />
        </div>

        {/* <div className="grid gap-6 mb-6">
          <Label>Collection Date:</Label>
          <Input type="date" name="collectionDate" onChange={handleChange} />
          <Label>Collection Time:</Label>
          <Input type="time" name="collectionTime" onChange={handleChange} />
        </div>

        <h2 className="text-lg font-semibold mt-4">PROVIDER INFORMATION</h2>
        <Label>Approving Provider:</Label>
        <Input name="approvingProvider" defaultValue="Ach, Chip" />
        <Label>NPI:</Label>
        <Input name="npi1" onChange={handleChange} />
        <Label>Ordering Provider:</Label>
        <Input name="orderingProvider" defaultValue="Ach, Chip" />
        <Label>NPI:</Label>
        <Input name="npi2" onChange={handleChange} />

        <h2 className="text-lg font-semibold mt-4">
          CLIENT / ORDERING SITE INFO
        </h2>
        <Label>Account Name:</Label>
        <Input name="accountName" onChange={handleChange} />
        <Label>Address:</Label>
        <Input name="address" onChange={handleChange} />
        <Label>Phone:</Label>
        <Input name="phone" onChange={handleChange} />

        <Label>Note to lab:</Label>
        <Textarea name="noteToLab" onChange={handleChange} />
        <Label>Internal note:</Label>
        <Textarea name="internalNote" onChange={handleChange} />

        <Checkbox
          id="stat"
          name="stat"
          onChange={handleChange}
          className="m-2"
        />
        <Label htmlFor="stat">STAT</Label>
        <Checkbox
          id="standingOrder"
          name="standingOrder"
          onChange={handleChange}
          className="m-2"
        />
        <Label htmlFor="standingOrder">Standing order</Label>
        <Checkbox
          id="publishResults"
          name="publishResults"
          onChange={handleChange}
          className="m-2"
        />
        <Label htmlFor="publishResults">
          Do not immediately publish results upon receipt
        </Label> */}

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" type="submit">
            SUBMIT ORDER
          </Button>
        </div>
      </form>
    </Card>
  );
}
