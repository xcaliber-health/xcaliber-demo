
import axios from "axios";

const SAMPLE_BFF_URL = import.meta.env.VITE_SAMPLE_BFF_URL;

export async function uploadClinicalPdf(file, setLatestCurl) {
  if (!file) {
    throw new Error("No PDF file provided");
  }

  const formData = new FormData();
  formData.append("pdfFile", file);

  const url = `${SAMPLE_BFF_URL}/api/pdf`;
  const headers = {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
  };

  // ✅ Generate a proper curl command for multipart upload
  let curlCommand = `curl "${url}" \\\n  -X POST`;
  Object.entries(headers).forEach(([key, value]) => {
    curlCommand += ` \\\n  -H "${key}: ${value}"`;
  });
  curlCommand += ` \\\n  -F "pdfFile=@${file.name}"`;

  if (typeof setLatestCurl === "function") {
    setLatestCurl(curlCommand);
  }

  try {
    const response = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data", "Authorization": `Bearer ${import.meta.env.VITE_API_TOKEN}`,},
    });

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
      status: data.status,
      entities,
    };
  } catch (error) {
    console.error("Upload error:", error.response?.data || error.message);
    throw error;
  }
}
