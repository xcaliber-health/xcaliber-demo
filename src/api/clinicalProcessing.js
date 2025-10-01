// // src/api/pdfService.js
// import axios from "axios";

// const API_URL = "https://blitz.xcaliberapis.com/sample/bff/api/pdf";

// // Upload a clinical PDF and return structured entities
// export async function uploadClinicalPdf(file) {
//   if (!file) {
//     throw new Error("No PDF file provided");
//   }

//   const formData = new FormData();
//   formData.append("pdfFile", file);

//   const response = await axios.post(API_URL, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

//   // Entities come as a string, parse it
//   const entities = JSON.parse(response.data.entities);

//   return {
//     message: response.data.message,
//     id: response.data.id,
//     bytes: response.data.bytes,
//     entities,
//   };
// }
import axios from "axios";

const API_URL = "https://blitz.xcaliberapis.com/sample/bff/api/pdf";

// Upload a clinical PDF and return structured entities with status info
export async function uploadClinicalPdf(file) {
  if (!file) {
    throw new Error("No PDF file provided");
  }

  const formData = new FormData();
  formData.append("pdfFile", file);

//   const response = await axios.post(API_URL, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
try {
  const response = await axios.post(API_URL, formData, {
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
