
import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function VirtualPhone() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);

  // Load existing notifications
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("virtualPhoneNotifications") || "[]");
    setMessages(stored);
  }, []);

  // Listen for new notifications in other tabs/components
  useEffect(() => {
    function handleStorage(event) {
      if (event.key === "virtualPhoneNotifications") {
        const updated = JSON.parse(event.newValue || "[]");
        setMessages(updated);
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

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
          📩 Patient Notifications
        </h1>

        <div className="h-[680px] overflow-y-auto flex flex-col gap-2 p-2 border rounded-xl bg-gray-50">
          {messages.map((msg, i) => (
            <div key={i} className="self-end bg-indigo-500 text-white rounded-2xl p-2 max-w-[80%]">
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
