
// src/pages/VitalsTab.jsx
import { useEffect, useState, useContext } from "react";
import { fetchVitals, createVitals } from "../api/VitalsApi";
import { AppContext } from "../layouts/DashboardLayout";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function VitalsTab({ patientId }) {
  const { sourceId, departmentId } = useContext(AppContext);

  const [vitals, setVitals] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    systolic: "",
    diastolic: "",
    heightFt: "",
    heightIn: "",
    weight: "",
    bmi: "",
    pulse: "",
    temperature: "",
    respiration: "",
  });

  useEffect(() => {
    async function loadVitals() {
      setLoadingList(true);
      try {
        const data = await fetchVitals(patientId, departmentId, sourceId);
        const sortedVitals = (data.entry || []).sort((a, b) => {
          const timeA =
            new Date(a.resource?.meta?.created || a.resource?.meta?.lastUpdated).getTime() ||
            0;
          const timeB =
            new Date(b.resource?.meta?.created || b.resource?.meta?.lastUpdated).getTime() ||
            0;
          return timeB - timeA; // latest first
        });
        setVitals(sortedVitals);
        toast.success("Vitals loaded successfully");
      } catch (err) {
        console.error("Error fetching vitals:", err);
        toast.error("Failed to load vitals");
      } finally {
        setLoadingList(false);
      }
    }
    if (patientId && sourceId && departmentId) loadVitals();
  }, [patientId, sourceId, departmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const sanitizedValues = {
      systolic: formValues.systolic ? Number(formValues.systolic) : undefined,
      diastolic: formValues.diastolic ? Number(formValues.diastolic) : undefined,
      heightFt: formValues.heightFt ? Number(formValues.heightFt) : 0,
      heightIn: formValues.heightIn ? Number(formValues.heightIn) : 0,
      weight: formValues.weight ? Number(formValues.weight) : undefined,
      bmi: formValues.bmi ? Number(formValues.bmi) : undefined,
      pulse: formValues.pulse ? Number(formValues.pulse) : undefined,
      temperature: formValues.temperature ? Number(formValues.temperature) : undefined,
      respiration: formValues.respiration ? Number(formValues.respiration) : undefined,
    };

    try {
      await createVitals(patientId, departmentId, sourceId, sanitizedValues);
      toast.success("Vitals added successfully");
      setOpen(false);
      setFormValues({
        systolic: "",
        diastolic: "",
        heightFt: "",
        heightIn: "",
        weight: "",
        bmi: "",
        pulse: "",
        temperature: "",
        respiration: "",
      });
      const updated = await fetchVitals(patientId, departmentId, sourceId);
      const sortedUpdated = (updated.entry || []).sort((a, b) => {
        const timeA =
          new Date(a.resource?.meta?.created || a.resource?.meta?.lastUpdated).getTime() ||
          0;
        const timeB =
          new Date(b.resource?.meta?.created || b.resource?.meta?.lastUpdated).getTime() ||
          0;
        return timeB - timeA;
      });
      setVitals(sortedUpdated);
    } catch (err) {
      console.error("Error creating vitals:", err);
      toast.error("Failed to add vitals");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Vitals</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setOpen(true)}
        >
          Add Vitals
        </button>
      </div>

      {/* Dialog */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Add Vitals</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Blood Pressure */}
              <div>
                <label className="block mb-1">Blood Pressure</label>
                <div className="flex space-x-2">
                  <input
                    name="systolic"
                    placeholder="Sys"
                    value={formValues.systolic}
                    onChange={handleChange}
                    className="border p-1 w-16"
                  />
                  <input
                    name="diastolic"
                    placeholder="Dia"
                    value={formValues.diastolic}
                    onChange={handleChange}
                    className="border p-1 w-16"
                  />
                </div>
              </div>

              {/* Height */}
              <div>
                <label className="block mb-1">Height</label>
                <div className="flex space-x-2">
                  <input
                    name="heightFt"
                    placeholder="ft"
                    value={formValues.heightFt}
                    onChange={handleChange}
                    className="border p-1 w-16"
                  />
                  <input
                    name="heightIn"
                    placeholder="in"
                    value={formValues.heightIn}
                    onChange={handleChange}
                    className="border p-1 w-16"
                  />
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block mb-1">Weight (lbs)</label>
                <input
                  name="weight"
                  value={formValues.weight}
                  onChange={handleChange}
                  className="border p-1 w-full"
                />
              </div>

              {/* BMI */}
              <div>
                <label className="block mb-1">BMI</label>
                <input
                  name="bmi"
                  value={formValues.bmi}
                  onChange={handleChange}
                  className="border p-1 w-full"
                />
              </div>

              {/* Pulse */}
              <div>
                <label className="block mb-1">Pulse Rate (bpm)</label>
                <input
                  name="pulse"
                  value={formValues.pulse}
                  onChange={handleChange}
                  className="border p-1 w-full"
                />
              </div>

              {/* Temperature */}
              <div>
                <label className="block mb-1">Body Temperature (°F)</label>
                <input
                  name="temperature"
                  value={formValues.temperature}
                  onChange={handleChange}
                  className="border p-1 w-full"
                />
              </div>

              {/* Respiration */}
              <div>
                <label className="block mb-1">Respiration Rate (bpm)</label>
                <input
                  name="respiration"
                  value={formValues.respiration}
                  onChange={handleChange}
                  className="border p-1 w-full"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Saving...
                  </span>
                ) : (
                  "Save"
                )}
              </button>

              <button
                type="button"
                className="mt-2 w-full px-4 py-2 border rounded"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Display vitals list */}
      {loadingList ? (
        <div className="flex items-center justify-center py-6 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading vitals...
        </div>
      ) : vitals.length > 0 ? (
        <div className="space-y-2">
          {vitals.map((item, idx) => {
            const createdTime =
              item.resource?.meta?.created || item.resource?.meta?.lastUpdated;
            return (
              <div
                key={idx}
                className="p-3 border rounded-lg shadow-sm bg-white"
              >
                <p className="text-sm text-gray-600">
                  {item.resource?.code?.coding?.[0]?.display || "Vital"}
                </p>
                <p className="font-medium">
                  {item.resource?.valueQuantity?.value
                    ? `${item.resource.valueQuantity.value} ${
                        item.resource.valueQuantity.unit || ""
                      }`
                    : item.resource?.component
                        ?.map(
                          (c) =>
                            `${c.code?.coding?.[0]?.display}: ${
                              c.valueQuantity?.value
                            } ${c.valueQuantity?.unit || ""}`
                        )
                        .join(", ")}
                </p>
                {createdTime && (
                  <p className="text-xs text-gray-400">
                    Created: {new Date(createdTime).toLocaleString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No vitals found.</p>
      )}
    </div>
  );
}
