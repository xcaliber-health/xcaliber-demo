import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { Loader2, List } from "lucide-react";

function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white/95 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 ${className}`}
    >
      {children}
    </div>
  );
}

export default function ScriptsList() {
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadScripts = async () => {
    setLoading(true);
    try {
      const baseUrl = "http://localhost:3000"; // backend URL(hardcoded for now)
      const fullUrl = `${baseUrl}/api/scripts`;

      const res = await fetch(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch scripts");

      const data = await res.json();
      setScripts(data.scripts || []);
    } catch (err) {
      toast.error(err.message || "Failed to load scripts");
      setScripts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScripts();
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 pb-1">
        <div className="max-w-6xl mx-auto flex justify-start items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <List className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Scripts List
            </h1>
            <p className="text-sm text-gray-600">
              View and run available scripts
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-2 overflow-hidden min-h-0">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden max-h-[570px]">
            <div className="flex-1 flex flex-col p-3 overflow-hidden min-h-0">
              <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-indigo-50 border-b border-gray-200 sticky top-0 z-10">
                    <tr>
                      <th className="p-3 text-left text-sm font-semibold uppercase text-gray-700">
                        Script Name
                      </th>
                      <th className="p-3 text-left text-sm font-semibold uppercase text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan="2"
                          className="p-4 text-center text-indigo-600"
                        >
                          <Loader2 className="animate-spin inline-block w-5 h-5 mr-2" />
                          Loading scripts...
                        </td>
                      </tr>
                    ) : scripts.length ? (
                      scripts.map((script) => (
                        <tr
                          key={script}
                          className="border-b hover:bg-indigo-50"
                        >
                          <td className="p-2">{script}</td>
                          <td className="p-2">
                            <td className="p-2">
                              <button
                                onClick={() => {
                                  const baseUrl = "http://localhost:3000"; // backend URL(hardcoded for now)
                                  fetch(`${baseUrl}/api/run-script`, {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      scriptName: script,
                                    }),
                                  })
                                    .then(() =>
                                      toast.success(
                                        `Script ${script} triggered!`
                                      )
                                    )
                                    .catch((err) =>
                                      toast.error(
                                        err.message || "Failed to run script"
                                      )
                                    );
                                }}
                                className="px-3 py-1 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                              >
                                Run
                              </button>
                            </td>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="2"
                          className="p-4 text-center text-gray-500"
                        >
                          No scripts found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
