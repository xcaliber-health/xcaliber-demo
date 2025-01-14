interface Tag {
  text: string;
  color: string;
  textColor: string;
}

interface Section {
  heading: string;
  content: string[];
}

interface NoteDetails {
  date: string;
  title: string;
  tags: Tag[];
  sections: Section[];
}

interface NotesProps {
  note: NoteDetails;
}

const Notes = ({ note }: NotesProps) => {
  const { date, tags, sections } = note;

  return (
    <div className="p-4 space-y-4 bg-white rounded-md shadow-md">
      {/* Date and Tags Section */}
      <div className="flex justify-between items-center">
        <span className="text-gray-600 text-sm">{date}</span>
        <div className="flex gap-1">
          {tags.map(({ text, color, textColor }, index) => (
            <span
              key={index}
              className="font-medium text-xs rounded-full"
              style={{
                display: "inline-block",
                backgroundColor: color,
                color: textColor,
                padding: "3px 8px",
              }}
            >
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Sections */}
      {sections.map(({ heading, content }, index) => (
        <div key={index}>
          <p className="text-gray-800 font-semibold">{heading}</p>
          {content?.[0].map((line, idx) => (
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
