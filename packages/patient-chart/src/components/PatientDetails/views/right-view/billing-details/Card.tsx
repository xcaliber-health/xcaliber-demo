import React from "react";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";

interface Tag {
  text: string;
  bgColor: string;
  textColor: string;
}

interface CardContent {
  heading: string;
  tags: Tag[];
  content: string[];
}

interface CardProps {
  card: CardContent;
}

const Card: React.FC<CardProps> = ({ card }) => {
  return (
    <div className="border border-blue-400 rounded-lg bg-white shadow-md flex flex-col">
      <div className="flex justify-between items-center p-4">
        <h4 className="text-base font-semibold text-gray-800">
          {card.heading}
        </h4>
        {card.tags.map((tag, tagIndex) => (
          <Chip
            key={tagIndex}
            label={tag.text}
            style={{
              backgroundColor: "#8C57FF29",
              color: "#007BFF",
              fontWeight: 500,
              fontSize: "0.75rem",
              borderRadius: "16px",
              padding: "4px 8px",
            }}
          />
        ))}
      </div>

      <div className="p-4 text-sm text-gray-600 space-y-2">
        {card.content.map((line, lineIndex) => (
          <p key={lineIndex}>{line}</p>
        ))}
      </div>

      <Divider />

      <div className="flex justify-end gap-4 p-4">
        <button
          className="text-sm font-medium rounded-md px-4 py-2"
          style={{
            backgroundColor: "#EAF3FF",
            color: "#1c1d1d",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Edit
        </button>
        <button
          className="text-sm font-medium rounded-md px-4 py-2"
          style={{
            backgroundColor: "#FFECEC",
            color: "#FF0000",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default Card;
