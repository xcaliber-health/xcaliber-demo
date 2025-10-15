import { Users } from "lucide-react";

export default function ClaimsDataStreaming() {
  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Claims Data Streaming
        </h1>
        <p className="text-gray-600 mt-2">This is your streaming claims page</p>
      </div>
    </div>
  );
}
