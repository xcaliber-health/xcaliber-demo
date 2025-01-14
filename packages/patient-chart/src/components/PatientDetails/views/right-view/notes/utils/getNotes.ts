import { NoteService } from "../../../../../../services/noteService";

export interface TransformedNote {
  id: string;
  date: string;
  plainTextContent: string[];
}

/**
 * Utility function to check if a string is Base64 encoded.
 * @param str - The string to validate.
 * @returns True if the string is Base64 encoded; otherwise, false.
 */
function isBase64(str: string): boolean {
  try {
    // Validate that decoding and encoding the string gives the same result
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
}

/**
 * Extracts plain text from raw HTML or Base64 content.
 * @param rawData - The raw data, either Base64-encoded or HTML.
 * @returns Extracted plain text content.
 */
function extractPlainText(rawData: string): string {
  if (!rawData) return "No Content Available";

  try {
    // Validate if the data is Base64 encoded
    if (isBase64(rawData)) {
      const decoded = atob(rawData);
      // Extract plain text from decoded HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(decoded, "text/html");
      return doc.body.textContent?.trim() || decoded;
    } else {
      // Handle raw HTML or plain text
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawData, "text/html");
      return doc.body.textContent?.trim() || rawData;
    }
  } catch (error) {
    console.error("Error extracting plain text:", error);
    return "Failed to extract content.";
  }
}

/**
 * Transforms plain text content into structured lines.
 * @param plainTextContent - The plain text content as a string.
 * @returns An array of lines from the plain text content.
 */
const transformPlainTextToLines = (plainTextContent: string): string[] => {
  // Replace commas with spaces
  const withoutCommas = plainTextContent.replace(/,/g, " ");
  // Split into lines by common delimiters (periods, newlines)
  const lines = withoutCommas.split(/(?<!\d)\.|\n/).map(line => line.trim()); // Avoid splitting decimal points
  // Filter out empty lines
  return lines.filter(line => line !== "");
};

/**
 * Transforms raw notes data into a structured format.
 * @param notes - The raw notes data.
 * @returns The transformed notes data.
 */
function transformNotesData(notes: any[]): TransformedNote[] {
  const source = localStorage.getItem("XCALIBER_SOURCE");

  if (!Array.isArray(notes)) {
    console.warn("Invalid notes data format. Expected an array.");
    return [];
  }

  return notes.map((note) => {
    // Safely access note resource and its properties
    const resource = note?.resource || {};
    const noteDateValue =
      source === "ELATION" || source === "EPIC"
        ? resource.date
        : resource?.context?.period?.start;

    // Extract and decode plain text content using extractPlainText
    const plainTextContent = (resource?.content || []).map((item: any) => {
      const rawData = item?.attachment?.data || "";
      if (rawData) {
        const extractedContent = extractPlainText(rawData);
        return transformPlainTextToLines(extractedContent); 
      }
      return "No Content Available";
    });

    // Return the transformed note object
    return {
      id: note.resource.id || "No ID Available",
      date: noteDateValue || "Unknown Date",
      plainTextContent: plainTextContent.filter((content: string) => content), // Filter out empty entries
    };
  });
}

/**
 * Fetches and transforms patient notes.
 * @param patientId - The ID of the patient.
 * @returns A promise that resolves to transformed notes data.
 */
export const fetchNotes = async (patientId: string): Promise<TransformedNote[]> => {
  try {
    // Fetch notes from the NoteService
    const notes = await NoteService.getVisitNotes(patientId);

    if (!notes || notes.length === 0) {
      console.warn("No notes data found for the given patient.");
      return [];
    }

    // Transform and return the notes
    return transformNotesData(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};
