import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

interface Section {
  content: string;
}

interface NoteDetails {
  id: string; // Practitioner ID
  date: string;
  sections: Section[];
}

interface NotesProps {
  note: NoteDetails;
}

const Notes = ({ note }: NotesProps) => {
  const { id, date, sections } = note;
  const [isElation, setIsElation] = useState(false);

  // Check localStorage for "elation" or other values
  useEffect(() => {
    const systemType = localStorage.getItem("elation") || "athena";
    setIsElation(systemType === "elation");
  }, []);

  return (
    <div
      style={{
        fontFamily: "Helvetica, Arial, sans-serif",
        fontSize: "16px",
        lineHeight: "1.8",
        color: "#333",
        borderRadius: "12px",
        backgroundColor: "#fff",
        width: "100%",
        padding: "16px",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <span style={{ fontSize: "14px", color: "#888" }}>
          Practitioner ID: {id}
        </span>
      </div>

      {/* Notes Date */}
      <div style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
        {date}
      </div>

      {/* Main Content Section */}
      <div
        style={{
          padding: "16px",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          border: "1px solid #ddd",
          width: "100%",
        }}
      >
        {isElation ? (
          sections.length > 0 ? (
            sections.map((section, index) => {
              // Split content into title and actual text
              const match = section.content.match(/^(.*?):\s*(.*)$/);
              const title = match ? match[1] : "";
              const data = match ? match[2] : section.content;

              return (
                <div key={index} style={{ marginBottom: "16px" }}>
                  {/* Title */}
                  {title && (
                    <div style={{ fontWeight: "800" }}>
                      {title}:
                    </div>
                  )}
                  {/* Data Content */}
                  <div style={{ marginBottom: "8px" }}>{data}</div>
                </div>
              );
            })
          ) : (
            <p>No content available.</p>
          )
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                sections.map((section) => section.content).join("<br /><br />")
              ),
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default Notes;
