interface NotesProps {
    note: {
      date: string;
      title: string;
      tags: { text: string; color: string; textColor: string }[];
      sections: { heading: string; content: string[] }[];
    };
  }
  
  const Notes = ({ note }: NotesProps) => {
    return (
      <div className="p-4 space-y-4 bg-white rounded-md shadow-md">
        {/* Date and Header */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">{note.date}</span>
          <div className="flex gap-1">
            {note.tags.map((tag, index) => (
              <span
                key={index}
                className="font-medium text-xs rounded-full"
                style={{
                  display: "inline-block",
                  backgroundColor: tag.color,
                  color: tag.textColor,
                  padding: "3px 8px",
                }}
              >
                {tag.text}
              </span>
            ))}
          </div>
        </div>
  
        {/* Sections */}
        {note.sections.map((section, index) => (
          <div key={index}>
            <p className="text-gray-800 font-semibold">{section.heading}</p>
            {section.content.map((line, idx) => (
              <p key={idx} className="text-gray-600 text-sm">
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>
    );
  };
  
  export default Notes;
  