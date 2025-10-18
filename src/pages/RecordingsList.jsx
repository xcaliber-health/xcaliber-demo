import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  HiOutlineCheckCircle,
  HiChevronRight,
  HiOutlineStop,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";

const backendUrl = import.meta.env.VITE_BASE_URL;

const AssistantFinal = ({ recorderData }) => {
  const id = recorderData?.[0]?.id || null;

  const [scriptList, setScriptList] = useState([]);
  const [activeScript, setActiveScript] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [replayUrl, setReplayUrl] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(false);
  // Selected EHR filter
  const [selectedEHR, setSelectedEHR] = useState("");
  // Get all unique EHR tags from scripts
  const ehrOptions = Array.from(
    new Set(scriptList.flatMap((s) => s.tags || []))
  );
  // Filter scripts by selected EHR tag
  const filteredScripts = selectedEHR
    ? scriptList.filter((s) => s.tags.includes(selectedEHR))
    : scriptList;

  useEffect(() => {
    if (!filteredScripts.includes(activeScript)) {
      setActiveScript(filteredScripts[0] || null);
    }
  }, [selectedEHR, filteredScripts]);

  const intervalRef = useRef(null);

  // Fetch scripts
  const [loading, setLoading] = useState(false);

  // Inside useEffect for fetching scripts
  useEffect(() => {
    const fetchScripts = async () => {
      try {
        setLoading(true);
        let scripts = [];
        if (id) {
          const res = await fetch(`${backendUrl}/file/${id}`);
          const data = await res.json();
          scripts = [data];
        } else {
          const res = await fetch(`${backendUrl}/scripts`);
          const data = await res.json();
          if (Array.isArray(data.scriptDetailList)) {
            scripts = data.scriptDetailList.filter((s) => s.type === "script");
          } else if (Array.isArray(data)) {
            scripts = data.filter((s) => s.type === "script");
          }
        }
        setScriptList(scripts);
        if (scripts.length) setActiveScript(scripts[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchScripts();
  }, [id]);

  // Initialize input values
  useEffect(() => {
    if (activeScript?.parameters) {
      const defaults = Object.fromEntries(
        activeScript.parameters.map((p) => [p.name, p.default || ""])
      );
      setInputValues(defaults);
    }
  }, [activeScript]);

  const stopScript = () => {
    setReplayUrl(null);
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setIsCollapsed(false);
  };

  const executeTest = async () => {
    if (!activeScript) return;

    setIsCollapsed(true);

    const runningToastId = toast.custom(
      () => (
        <div className="flex items-center gap-2 border-t-4 border-green-500 bg-white text-gray-800 px-4 py-2 rounded shadow">
          <HiOutlineCheckCircle className="w-5 h-5 text-green-500" />
          <span>Script "{activeScript.title}" is running...</span>
        </div>
      ),
      { duration: Infinity, position: "bottom-right" }
    );

    try {
      setIsRunning(true);
      setReplayUrl(
        `${
          import.meta.env.VITE_VNC_URL
        }/vnc.html?autoconnect=true&resize=remote`
      );

      const response = await fetch(`${backendUrl}/replay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uuid: activeScript.uuid,
          parameters: inputValues,
        }),
      });

      if (!response.ok) throw new Error("Failed to execute workflow");

      await response.json();
      toast.dismiss(runningToastId);

      toast.custom(
        () => (
          <div className="flex items-center gap-2 border-t-4 border-green-500 bg-white text-gray-800 px-4 py-2 rounded shadow">
            <HiOutlineCheckCircle className="w-5 h-5 text-green-500" />
            <span>Workflow "{activeScript.title}" completed!</span>
          </div>
        ),
        { duration: 3000, position: "bottom-right" }
      );

      // Close the VNC/browser
      setReplayUrl(null);
      setIsCollapsed(false);
      setIsRunning(false);
    } catch (err) {
      console.error(err);
      toast.dismiss(runningToastId);
      setIsRunning(false);
    }
  };

  return (
    <div className="h-[calc(100vh-60px)] flex gap-4 px-4 py-4 overflow-hidden transition-all duration-500">
      <Toaster position="bottom-right" />

      {/* Sidebar */}
      <div
        className={`relative flex flex-col bg-white/95 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl transition-all duration-500 ease-in-out overflow-hidden ${
          isCollapsed ? "w-[60px] p-2" : "w-1/4 p-4"
        }`}
      >
        {/* Stop button */}
        {isRunning && (
          <div className="w-full flex justify-center mb-2">
            <button
              onClick={stopScript}
              className={`transition-all ${
                isCollapsed
                  ? "w-10 h-10 rounded-full flex items-center justify-center text-white"
                  : "w-full px-4 py-2 rounded-lg text-white text-sm font-semibold flex items-center justify-center"
              } bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700`}
            >
              {isCollapsed ? (
                <HiOutlineStop className="w-6 h-6" />
              ) : (
                "Stop Workflow"
              )}
            </button>
          </div>
        )}

        {/* Sidebar toggle arrow */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute transition-all ${
            isCollapsed
              ? "bottom-4 left-1/2 -translate-x-1/2"
              : "bottom-4 right-4 translate-x-0"
          } bg-white border border-gray-200 shadow-lg rounded-full p-1 hover:bg-gray-100`}
        >
          <HiChevronRight
            className={`w-5 h-5 text-gray-600 transform transition-transform ${
              !isCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Sidebar content */}
        <div
          className={`flex flex-col gap-4 transition-opacity duration-300 overflow-visible ${
            isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {/* EHR Filter */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by EHR
            </label>
            <select
              className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              onChange={(e) => setSelectedEHR(e.target.value)}
              value={selectedEHR}
            >
              <option value="">All</option>
              {ehrOptions.map((ehr) => (
                <option key={ehr} value={ehr}>
                  {ehr}
                </option>
              ))}
            </select>
          </div>

          <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Select a Workflow
          </h3>

          {/* Script selector / loader / empty message */}
          {loading ? (
            <div className="flex items-center justify-center py-2 gap-2">
              <div className="w-5 h-5 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
              <span className="text-gray-600 text-sm font-medium">
                Loading workflows...
              </span>
            </div>
          ) : scriptList.length > 0 ? (
            <div className="relative z-0">
              <select
                className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                onChange={(e) =>
                  setActiveScript(
                    filteredScripts.find((s) => s.uuid === e.target.value)
                  )
                }
                value={activeScript?.uuid || ""}
              >
                {filteredScripts.map((script) => (
                  <option key={script.uuid} value={script.uuid}>
                    {script.title}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No workflows available.</p>
          )}

          {/* Accordion */}
          {activeScript?.parameters?.length > 0 && (
            <div className="flex flex-col gap-2">
              <button
                className="flex items-center justify-between text-left text-base font-medium px-2 py-2 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none"
                onClick={() => setAccordionOpen(!accordionOpen)}
              >
                <span>Edit Parameters</span>
                {accordionOpen ? (
                  <HiChevronUp className="w-5 h-5" />
                ) : (
                  <HiChevronDown className="w-5 h-5" />
                )}
              </button>

              {accordionOpen && (
                <div className="flex flex-col flex-1 bg-gray-50 rounded overflow-hidden">
                  {/* Scrollable parameter inputs */}
                  <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
                    {activeScript.parameters.map((param) => (
                      <div key={param.name} className="flex flex-col gap-1">
                        <label className="text-gray-700 text-sm">
                          {param.description}
                        </label>
                        <input
                          type={
                            ["password", "mfaKey"].includes(param.name)
                              ? "password"
                              : "text"
                          }
                          value={inputValues[param.name] || ""}
                          onChange={(e) =>
                            setInputValues({
                              ...inputValues,
                              [param.name]: e.target.value,
                            })
                          }
                          className="px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm w-full"
                          placeholder={
                            ["password", "mfaKey", "mfaKey_sms_json"].includes(
                              param.name
                            )
                              ? "••••••••"
                              : `Enter ${param.name}`
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                className={`mt-3 px-4 py-3 rounded-xl text-white transition ${
                  isRunning
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
                onClick={executeTest}
                disabled={isRunning}
              >
                Execute
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div
        className={`flex-1 flex flex-col overflow-hidden gap-2 p-4 bg-white/95 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl transition-all duration-500 ${
          isCollapsed ? "w-[calc(100%-80px)]" : "w-full"
        }`}
      >
        {!replayUrl ? (
          <div className="flex flex-1 items-center justify-center text-gray-500 text-xl font-medium">
            Execute a workflow to see
          </div>
        ) : (
          <iframe
            className="w-full h-full border-none rounded-2xl"
            src={replayUrl}
          />
        )}
      </div>
    </div>
  );
};

export default AssistantFinal;
