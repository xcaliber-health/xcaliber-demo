import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import LabOrderForm from "./LabOrderForm";
import { LabOrderService } from "../services/labOrderService";

export default function LabOrder({
  patientId,
  categoryCode,
  departmentId,
  encounterId,
  sourceId,
  practitionerId,
  practiceId,
}) {
  const [labOrders, setLabOrders] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const serviceRequest = await LabOrderService.getLabOrder(
          patientId,
          categoryCode,
          encounterId,
          sourceId
        );

        console.log("API Response:", serviceRequest);

        if (Array.isArray(serviceRequest)) {
          setLabOrders(serviceRequest);
        } else if (serviceRequest?.data && Array.isArray(serviceRequest.data)) {
          setLabOrders(serviceRequest.data);
        } else {
          setLabOrders([]);
        }
      } catch (error) {
        console.error("Error fetching lab orders:", error);
        setLabOrders([]);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="p-6">
      {isCreating ? (
        <LabOrderForm
          patientId={patientId}
          departmentId={departmentId}
          encounterId={encounterId}
          sourceId={sourceId}
          onCancel={() => setIsCreating(false)}
          practitionerId={practitionerId}
          practiceId={practiceId}
        />
      ) : (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Lab Orders</h1>
            <Button onClick={() => setIsCreating(true)}>Create Order</Button>
          </div>
          <div className="space-y-4">
            {labOrders?.map?.((order) => (
              <Card key={order.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {order.providerName}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Collection Date: {order.collectionDate}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full ${
                      order.status === "Complete"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-black"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
