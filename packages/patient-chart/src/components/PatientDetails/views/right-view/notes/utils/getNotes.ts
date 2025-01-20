import { NoteService } from "../../../../../../services/noteService";

export interface Note {
  id: string;
  date: string;
  content: any[]; // Keeping this generic since content can vary
}

/**
 * Utility function to safely parse a date from raw data.
 * @param rawDate - The raw date string.
 * @returns A formatted date string or "Unknown Date" if invalid.
 */
function parseDate(rawDate: string | undefined): string {
  if (!rawDate) return "Unknown Date";

  const date = new Date(rawDate);
  return !isNaN(date.getTime())
    ? date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown Date";
}

/**
 * Fetches and returns patient notes data with parsed dates and raw content.
 * @param patientId - The ID of the patient.
 * @returns A promise that resolves to the raw notes data.
 */
export const fetchNotes = async (patientId: string): Promise<Note[]> => {
  try {
    // Fetch notes from the NoteService
    const notes = await NoteService.getVisitNotes(patientId);

    if (!notes || notes.length === 0) {
      console.warn("No notes data found for the given patient.");
      return [];
    }

    
    return notes.map((note) => {
      const resource = note?.resource || {};
      return {
        id: resource.id || "No ID Available",
        date: parseDate(resource.date || resource?.context?.period?.start),
        content: resource.content || [], 
      };
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};
