import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";

const backendUrl = import.meta.env.VITE_BASE_URL;

const AssistantFinal = ({ recorderData }) => {
  const id = recorderData?.[0]?.id || null;

  const [scriptList, setScriptList] = useState([]);
  const [activeScript, setActiveScript] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [replayUrl, setReplayUrl] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const cancelCloseRef = useRef(false);
  const countdownRef = useRef(6);

  // Fetch scripts
  useEffect(() => {
    const fetchScripts = async () => {
      try {
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
        toast.custom(
          (t) => (
            <div className="flex items-center gap-2 border-t-4 border-red-500 bg-white text-gray-800 px-4 py-2 rounded shadow">
              <HiOutlineXCircle className="w-5 h-5 text-red-500" />
              <span>Failed to fetch scripts</span>
            </div>
          ),
          { duration: 4000 }
        );
        console.error(err);
      }
    };
    fetchScripts();
  }, [id]);

  // Initialize input values when script changes
  useEffect(() => {
    if (activeScript?.parameters) {
      const defaults = Object.fromEntries(
        activeScript.parameters.map((p) => [p.name, p.default || ""])
      );
      setInputValues(defaults);
    }
  }, [activeScript]);

  const executeTest = async () => {
    if (!activeScript) return;

    cancelCloseRef.current = false;
    countdownRef.current = 6;

    // Running toast
    const runningToastId = toast.custom(
      (t) => (
        <div className="flex items-center gap-2 border-t-4 border-green-500 bg-white text-gray-800 px-4 py-2 rounded shadow">
          <HiOutlineCheckCircle className="w-5 h-5 text-green-500" />
          <span>Script "{activeScript.title}" is running...</span>
        </div>
      ),
      { duration: Infinity }
    );

    try {
      setIsRunning(true);
      setReplayUrl(`${import.meta.env.VITE_VNC_URL}/vnc.html?autoconnect=true&resize=remote`);

      const response = await fetch(`${backendUrl}/replay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid: activeScript.uuid, parameters: inputValues }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Failed to execute script");
      }

      await response.json();

      // Completed toast
      toast.dismiss(runningToastId);
      toast.custom(
        (t) => (
          <div className="flex items-center gap-2 border-t-4 border-green-500 bg-white text-gray-800 px-4 py-2 rounded shadow">
            <HiOutlineCheckCircle className="w-5 h-5 text-green-500" />
            <span>Script "{activeScript.title}" completed!</span>
          </div>
        ),
        { duration: 3000 }
      );

      // Enable button immediately
      setIsRunning(false);

      // Countdown toast for sandbox iframe
      const confirmToastId = toast.custom(
        (t) => (
          <div className="flex flex-col gap-2 border-t-4 border-green-500 bg-white text-gray-800 px-4 py-2 rounded shadow">
            <span>Sandbox will close in {countdownRef.current}s</span>
            <button
              className="bg-gray-100 text-green-600 px-2 py-1 rounded hover:bg-gray-200 w-fit"
              onClick={() => {
                cancelCloseRef.current = true;
                toast.dismiss(t.id);
                toast.custom(
                  (t2) => (
                    <div className="flex items-center gap-2 border-t-4 border-green-500 bg-white text-gray-800 px-4 py-2 rounded shadow">
                      <span>Stayed on sandbox</span>
                    </div>
                  ),
                  { duration: 3000 }
                );
              }}
            >
              Stay Here
            </button>
          </div>
        ),
        { duration: Infinity }
      );

      const countdownInterval = setInterval(() => {
        if (countdownRef.current > 1) {
          countdownRef.current -= 1;
          toast.update(confirmToastId, {
            render: (t) => (
              <div className="flex flex-col gap-2 border-t-4 border-green-500 bg-white text-gray-800 px-4 py-2 rounded shadow">
                <span>Sandbox will close in {countdownRef.current}s</span>
                <button
                  className="bg-gray-100 text-green-600 px-2 py-1 rounded hover:bg-gray-200 w-fit"
                  onClick={() => {
                    cancelCloseRef.current = true;
                    toast.dismiss(t.id);
                    toast.custom(
                      (t2) => (
                        <div className="flex items-center gap-2 border-t-4 border-green-500 bg-white text-gray-800 px-4 py-2 rounded shadow">
                          <span>Stayed on sandbox</span>
                        </div>
                      ),
                      { duration: 3000 }
                    );
                  }}
                >
                  Stay Here
                </button>
              </div>
            ),
          });
        } else {
          clearInterval(countdownInterval);
          if (!cancelCloseRef.current) {
            setReplayUrl(null);
            toast.dismiss(confirmToastId);
          }
        }
      }, 1000);

    } catch (err) {
      toast.dismiss(runningToastId);
      toast.custom(
        (t) => (
          <div className="flex items-center gap-2 border-t-4 border-red-500 bg-white text-gray-800 px-4 py-2 rounded shadow">
            <HiOutlineXCircle className="w-5 h-5 text-red-500" />
            <span>Error: {err.message}</span>
          </div>
        ),
        { duration: 5000 }
      );
      console.error(err);
      setReplayUrl(null);
      setIsRunning(false);
    }
  };

  return (
    <div className="h-[calc(100vh-60px)] flex gap-4 px-4 py-4 overflow-hidden">
      <Toaster position="bottom-right" />
      {/* Left Panel */}
      <div className="w-1/4 flex flex-col gap-4 overflow-y-auto p-4 bg-white/95 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl">
        <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Select a Script
        </h3>

        {scriptList.length ? (
          <select
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setActiveScript(scriptList.find((s) => s.uuid === e.target.value))}
            value={activeScript?.uuid || ""}
          >
            {scriptList.map((script) => (
              <option key={script.uuid} value={script.uuid}>
                {script.title}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-gray-500 text-sm">No scripts available.</p>
        )}

        {activeScript?.parameters?.length > 0 && (
          <>
            {activeScript.parameters.map((param) => (
              <div key={param.name} className="flex flex-col gap-2">
                <label className="text-gray-600 text-sm">{param.description}</label>
                <input
                  type={param.name.toLowerCase().includes("password") ? "password" : "text"}
                  value={inputValues[param.name] || ""}
                  onChange={(e) => setInputValues({ ...inputValues, [param.name]: e.target.value })}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={`Enter ${param.name}`}
                />
              </div>
            ))}

            <button
              className={`mt-2 px-4 py-2 rounded-xl text-white transition 
                ${isRunning ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
              onClick={executeTest}
              disabled={isRunning}
            >
              Execute Test
            </button>
          </>
        )}
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col overflow-hidden gap-2 p-4 bg-white/95 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl">
        {!replayUrl && (
          <div className="flex flex-1 items-center justify-center text-gray-500 text-xl font-medium">
            Execute a script to see
          </div>
        )}

        {replayUrl && (
          <iframe className="w-full h-full border-none rounded-2xl" src={replayUrl} />
        )}
      </div>
    </div>
  );
};

export default AssistantFinal;
