/**
 * api/googleDrive.js
 * Assumes the Google Drive file is publicly shared or accessible via the export link.
 */

/**
 * Fetches a PDF from Google Drive using its File ID and returns a Blob URL.
 * @param {string} fileId - The Google Drive file ID.
 * @returns {Promise<string>} - A promise that resolves to the Blob URL.
 */
export async function fetchGoogleDrivePdf(fileId) {
  if (!fileId) throw new Error("Google Drive File ID is missing.");

  // This is the Google Drive 'export' link format for a PDF download.
  // Replace 'YOUR_GOOGLE_DRIVE_FILE_ID' with the actual fileId from your list.
  const exportUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  try {
    const response = await fetch(exportUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch Google Drive PDF: ${response.status} ${response.statusText}`);
    }

    // Get the response body as a Blob
    const pdfBlob = await response.blob();

    // Create a secure Blob URL for the PDF Viewer
    return URL.createObjectURL(pdfBlob);

  } catch (error) {
    console.error("Error fetching Google Drive PDF:", error);
    // Re-throw to be caught in the component
    throw new Error(`Network or Fetch Error: ${error.message}`);
  }
}