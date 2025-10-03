
import { useEffect, useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { Loader2, Search, List } from "lucide-react";

function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white/95 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 ${className}`}
    >
      {children}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="border-2 border-gray-200/50 py-3 px-12 rounded-2xl w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 outline-none bg-white/80 backdrop-blur-sm transition-all duration-200 placeholder:text-gray-400"
    />
  );
}

export default function EventBrowser() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonLoading, setJsonLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [jsonString, setJsonString] = useState("");
  const [isValid, setIsValid] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const API_URL =
    "https://blitz.xcaliberapis.com/subscription-interop/api/v2/events?tenantId=512fe16b-57cc-3887-b28f-829f21aa9ef2&x-data-product-id=0000-0000-0000-0000";

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  // fetch events
  useEffect(() => {
    setLoading(true);
    axios
      .get(API_URL)
      .then((res) => {
        setEvents(res.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = events.filter((event) =>
    event.id.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEvents.length / rowsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSelect = async (event) => {
    setSelectedEvent(event);
    setJsonLoading(true);
    setJsonString("");

    try {
      const res = await axios.get(
        `https://blitz.xcaliberapis.com/subscription-interop/api/v2/events/${event.id}?tenantId=512fe16b-57cc-3887-b28f-829f21aa9ef2&x-data-product-id=0000-0000-0000-0000`
      );

      setJsonString(JSON.stringify(res.data, null, 2));
      setIsValid(true);
    } catch (err) {
      console.error(err);
      setJsonString(`Error fetching event: ${err.message}`);
      setIsValid(false);
    } finally {
      setJsonLoading(false);
    }
  };

  const handleEditorChange = (value) => {
    setJsonString(value);
    try {
      JSON.parse(value);
      setIsValid(true);
    } catch {
      setIsValid(false);
    }
  };

  const getEventType = (event) =>
    event.eventType || "No Event Type";

  const formatCreatedTime = (time) => {
    try {
      return new Date(time).toLocaleString();
    } catch {
      return time;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 pb-1">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <List className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Event Browser
              </h1>
              <p className="text-sm text-gray-600">
                Search and explore events
              </p>
            </div>
          </div>

          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search by Event ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-12 shadow-lg py-2.5"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-2 overflow-hidden min-h-0">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden max-h-[500px]">
            <div className="flex-1 flex flex-col p-3 overflow-hidden min-h-0">
              {!selectedEvent && (
                <div className="flex-shrink-0 flex items-center justify-between mb-2 p-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                  <span className="font-medium text-sm text-indigo-700">
                    {filteredEvents.length} event
                    {filteredEvents.length !== 1 ? "s" : ""} found
                  </span>
                  {totalPages > 1 && (
                    <span className="text-gray-600 text-xs">
                      Page {currentPage} of {totalPages}
                    </span>
                  )}
                </div>
              )}

              {/* Table or JSON Editor */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                  <div className="flex-1 flex justify-center items-center text-indigo-600 h-40">
                    <Loader2 className="animate-spin h-6 w-6" />
                  </div>
                ) : selectedEvent ? (
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-3">
                      <button
                        className="text-indigo-600 hover:underline text-sm"
                        onClick={() => setSelectedEvent(null)}
                      >
                        ← Back to events
                      </button>
                      <span className="text-sm text-gray-500">
                        Event ID: {selectedEvent.id}
                      </span>
                    </div>

                    {/* Loader while fetching JSON */}
                    {jsonLoading ? (
                      <div className="flex-1 flex justify-center items-center text-indigo-600">
                        <Loader2 className="animate-spin h-6 w-6" />
                      </div>
                    ) : (
                      <Editor
                        height="100%"
                        defaultLanguage="json"
                        value={jsonString}
                        onChange={handleEditorChange}
                        options={{
                          readOnly: false,
                          minimap: { enabled: false },
                          fontSize: 13,
                          lineNumbers: "on",
                          wordWrap: "on",
                          folding: true,
                          bracketMatching: "always",
                        }}
                        theme="vs"
                      />
                    )}

                    {!isValid && (
                      <div className="text-red-600 text-sm mt-2">
                        Invalid JSON format
                      </div>
                    )}
                  </div>
                ) : paginatedEvents.length ? (
                  <table className="min-w-full border border-gray-200 rounded-lg">
                    <thead className="bg-indigo-50">
                      <tr>
                        <th className="py-2 px-4 border-b text-left text-sm font-medium text-indigo-700">
                          ID
                        </th>
                        <th className="py-2 px-4 border-b text-left text-sm font-medium text-indigo-700">
                          Event Type
                        </th>
                        <th className="py-2 px-4 border-b text-left text-sm font-medium text-indigo-700">
                          Created Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedEvents.map((event) => (
                        <tr
                          key={event.id}
                          className="cursor-pointer hover:bg-indigo-50 transition-colors"
                          onClick={() => handleSelect(event)}
                        >
                          <td className="py-2 px-4 border-b text-sm text-gray-800">
                            {event.id}
                          </td>
                          <td className="py-2 px-4 border-b text-sm text-gray-600">
                            {getEventType(event)}
                          </td>
                          <td className="py-2 px-4 border-b text-sm text-gray-600">
                            {formatCreatedTime(event.createdTime || event.createdAt || "")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        No events found
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Try adjusting your search criteria
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {!selectedEvent && totalPages > 1 && (
                <div className="flex-shrink-0 flex justify-between items-center pt-2 mt-2 border-t border-gray-200">
                  <button
                    className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    ← Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: Math.min(totalPages, 5) },
                      (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-6 h-6 rounded-lg transition-all text-xs ${
                              currentPage === pageNum
                                ? "bg-indigo-600 text-white shadow-lg"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                    {totalPages > 5 && (
                      <span className="text-gray-400 text-xs">...</span>
                    )}
                  </div>
                  <button
                    className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #e0e7ff #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e0e7ff;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c7d2fe;
        }
      `}</style>
    </div>
  );
}
