import { createAppointment } from "./appointment"; // adjust path as needed

export async function submitEntity(entityContainer, setLatestCurl, sourceId, departmentId) {
  try {
    // 🩺 Extract IDs from entity container (adjust keys to your structure)
    const patientId = "4406";
    const provider = entityContainer?.Practitioner?.[0] || { id: "67" };

    // 🕒 Set up appointment details
    const start = new Date();
    const end = new Date(start.getTime() + 30 * 60000); // 30-minute appointment

    // 📅 Create appointment using existing helper
    await createAppointment({
      patientId,
      providerId: provider.id,
      sourceId,
      departmentId,
      start: start.toISOString(),
      end: end.toISOString(),
      appointmentType: { code: "562", display: "Nurse Visit" },
      setLatestCurl,
    });

    console.log("✅ Appointment successfully created for abnormal lab report.");
    return { success: true };
  } catch (error) {
    console.error("❌ Error submitting entity / creating appointment:", error);
    return { success: false, error };
  }
}
