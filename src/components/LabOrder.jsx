import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import LabOrderForm from "./LabOrderForm";
import { LabOrderService } from "../services/labOrderService";
import { ArrowLeft } from "lucide-react";

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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // ✅ Start loading
      try {
        const serviceRequest = await LabOrderService.getLabOrder(
          patientId,
          categoryCode,
          encounterId,
          sourceId
        );

        if (Array.isArray(serviceRequest)) {
          setLabOrders(serviceRequest);
        } else if (
          serviceRequest?.data?.entry &&
          Array.isArray(serviceRequest.data.entry)
        ) {
          setLabOrders(serviceRequest.data.entry);
        } else {
          setLabOrders([]);
        }
      } catch (error) {
        console.error("Error fetching lab orders:", error);
        setLabOrders([]);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, [patientId, categoryCode, encounterId, sourceId]);

  return (
    <div>
      {isCreating ? (
        <div>
          <div className="w-full h-full flex items-center mb-4">
            <button
              onClick={() => setIsCreating(false)}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to List
            </button>
          </div>
          <LabOrderForm
            patientId={patientId}
            departmentId={departmentId}
            encounterId={encounterId}
            sourceId={sourceId}
            onCancel={() => setIsCreating(false)}
            practitionerId={practitionerId}
            practiceId={practiceId}
          />
        </div>
      ) : selectedOrder ? (
        <>
          <div className="flex items-center mb-4">
            <button
              onClick={() => setSelectedOrder(null)}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to List
            </button>
          </div>

          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Lab Order Details
          </h1>

          <div className="space-y-3 text-gray-700 p-4">
            <p>
              <strong>ID:</strong> {selectedOrder.id}
            </p>
            <p>
              <strong>Provider:</strong>{" "}
              {selectedOrder.extension?.find((ext) =>
                ext.url.includes("ordering-provider")
              )?.valueString || "Unknown"}
            </p>
            <p>
              <strong>Encounter:</strong>{" "}
              {selectedOrder.encounter?.reference || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <p>
              <strong>Priority:</strong> {selectedOrder.priority}
            </p>
            <p>
              <strong>Reason:</strong>{" "}
              {selectedOrder.reasonCode
                ?.flatMap((rc) => rc.coding.map((code) => code.display))
                .join(", ") || "No reason specified"}
            </p>
            <p>
              <strong>Category:</strong>{" "}
              {selectedOrder.category
                ?.flatMap((cat) => cat.coding.map((code) => code.display))
                .join(", ") || "No category specified"}
            </p>
            <p>
              <strong>Collection Date:</strong>{" "}
              {selectedOrder.occurrenceDateTime
                ? new Date(
                    selectedOrder.occurrenceDateTime
                  ).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Authored On:</strong>{" "}
              {selectedOrder.authoredOn
                ? new Date(selectedOrder.authoredOn).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Performer:</strong>{" "}
              {selectedOrder.performer
                ?.map((p) => p.reference || p.extension?.[0]?.valueString)
                .join(", ") || "N/A"}
            </p>
          </div>
        </>
      ) : (
        <Card className="p-6 shadow-lg border border-gray-300 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Lab Orders</h1>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-[#D1E9FF] text-[#0C4A6E] px-4 py-2 rounded-lg shadow-md hover:bg-[#c7e2fa]"
            >
              + Create Order
            </Button>
          </div>

          <div className="space-y-4">
            {loading
              ? [...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse p-4 border border-gray-200 rounded-lg shadow-md bg-gray-100"
                  >
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))
              : labOrders?.map?.((order) => {
                  const resource = order.resource || order;

                  const id = resource.id;
                  const status = resource.status;
                  const priority = resource.priority;
                  const provider =
                    resource.extension?.find((ext) =>
                      ext.url.includes("ordering-provider")
                    )?.valueString || "Unknown Provider";
                  const collectionDate = resource.occurrenceDateTime
                    ? new Date(resource.occurrenceDateTime).toLocaleDateString()
                    : "N/A";

                  return (
                    <Card
                      key={id}
                      className="p-4 border border-gray-200 rounded-lg shadow-md transition-all hover:shadow-xl hover:bg-gray-100 cursor-pointer"
                      onClick={() => setSelectedOrder(resource)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            {provider}
                          </h2>
                          <p className="text-sm text-gray-600">
                            <strong>Collection Date:</strong> {collectionDate}
                          </p>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm ${
                            status === "REVIEW"
                              ? "bg-yellow-500"
                              : status === "ACTIVE"
                              ? "bg-blue-500"
                              : "bg-green-500"
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      {/* Priority Badge */}
                      <div className="mt-2">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold uppercase rounded-lg ${
                            priority === "urgent"
                              ? "bg-red-500 text-white"
                              : "bg-gray-300 text-black"
                          }`}
                        >
                          {priority}
                        </span>
                      </div>
                    </Card>
                  );
                })}
          </div>
        </Card>
      )}
    </div>
  );
}
