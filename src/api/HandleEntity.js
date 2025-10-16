import { createAppointment } from "./appointment"; // adjust path as needed

export async function submitEntity(setLatestCurl) {
  try {
    // 🩺 Extract IDs from entity container (adjust keys to your structure)
    const patientId = "4406";
    const provider = "67";

    // 🕒 Set up appointment details
    const start = new Date();
    const end = new Date(start.getTime() + 30 * 60000); // 30-minute appointment
    const departmentId = "1"; // Example department ID
    const sourceId = "ef123977-6ef1-3e8e-a30f-3879cea0b344"; // Example source ID
    // 📅 Create appointment using existing helper
    console.log("📅 Creating appointment for abnormal lab report...");
    const response = await createAppointment({
      patientId,
      providerId: provider,
      sourceId,
      departmentId,
      start: start.toISOString(),
      end: end.toISOString(),
      appointmentType: { code: "962", display: "Health History Checkup" },
      setLatestCurl,
    });

    console.log("✅ Appointment successfully created for abnormal lab report.");
    return { success: true, appointmentId:response.data.id };
  } catch (error) {
    console.error("❌ Error submitting entity / creating appointment:", error);
    return { success: false, error };
  }
}
