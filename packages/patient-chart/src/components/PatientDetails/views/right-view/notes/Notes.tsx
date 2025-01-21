import DOMPurify from "dompurify";
import Chip from "@mui/material/Chip";

interface Tag {
  text: string;
  color: string;
  textColor: string;
}

interface Section {
  content: string;
}

interface NoteDetails {
  date: string;
  tags: Tag[];
  sections: Section[];
}

interface NotesProps {
  note: NoteDetails;
}

const Notes = ({ note }: NotesProps) => {
  const { tags, sections } = note;

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
        <span style={{ fontSize: "14px", color: "#888" }}>Nurse: Francis Byrd</span>
        <div style={{ display: "flex", gap: "8px" }}>
          {tags.map(({ text, color, textColor }, index) => (
            <Chip
              key={index}
              label={text}
              style={{
                backgroundColor: color,
                color: textColor,
                fontSize: "12px",
                padding: "4px 12px",
                borderRadius: "16px",
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content Section */}
      <div
        style={{
          padding: "24px",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          border: "1px solid #ddd",
          width: "100%",
        }}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(
            sections.map((section) => section.content).join("")
          ),
        }}
      ></div>
    </div>
  );
};

export default Notes;
