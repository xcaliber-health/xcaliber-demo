
import React, { useContext } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../layouts/DashboardLayout"; // <- import context

export default function VirtualPhone() {
  const navigate = useNavigate();
  const { messages } = useContext(AppContext); // <- get messages from context

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-4 relative border border-indigo-100">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-gray-500 hover:text-indigo-600 flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="text-xl font-bold text-center text-indigo-700 mb-4 mt-2">
          📩 Notifications
        </h1>

        <div className="h-[680px] overflow-y-auto flex flex-col gap-2 p-2 border rounded-xl bg-gray-50">
          {messages.length === 0 && (
            <div className="text-gray-400 text-center mt-4">No messages yet</div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[80%] p-2 rounded-2xl text-white ${
                msg.sender === "clinic"
                  ? "self-end bg-indigo-500"
                  : "self-start bg-gray-400"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
