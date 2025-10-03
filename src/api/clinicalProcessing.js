
import axios from "axios";


const SAMPLE_BFF_URL = import.meta.env.VITE_SAMPLE_BFF_URL;


// Upload a clinical PDF and return structured entities with status info
export async function uploadClinicalPdf(file) {
  if (!file) {
    throw new Error("No PDF file provided");
  }

  const formData = new FormData();
  formData.append("pdfFile", file);
try {
  const response = await axios.post(`${SAMPLE_BFF_URL}/api/pdf`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
} catch (error) {
  console.error("Upload error response:", error.response?.data || error.message);
  throw error; // rethrow so frontend catch can handle it
}


  const data = response.data;

  let entities = null;
  if (data.entities) {
    try {
      entities = JSON.parse(data.entities);
    } catch (err) {
      console.warn("Failed to parse entities:", err);
      entities = null;
    }
  }

  return {
    message: data.message,
    id: data.id,
    bytes: data.bytes,
    status: data.status,  // important for frontend polling
    entities,
  };
}
