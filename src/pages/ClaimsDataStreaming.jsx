import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Server, Play, RotateCw } from "lucide-react";

function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-200 ${className}`}
    >
      {children}
    </div>
  );
}

function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 transform hover:scale-[1.03] active:scale-95 focus:ring-2 focus:ring-indigo-400 focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
}

export default function KafkaToSnowflakeDemo() {
  // --- existing state & logic preserved ---
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [logs, setLogs] = useState([]);
  const [rowsTransferred, setRowsTransferred] = useState(0);
  const [throughput, setThroughput] = useState(0);
  const [topic, setTopic] = useState("edi.claims.837.v1");
  const [partition, setPartition] = useState(0);
  const [offset, setOffset] = useState(12345);
  const [batchSize, setBatchSize] = useState(500);
  const [snowflakeSchema, setSnowflakeSchema] = useState("PUBLIC.EDI_CLAIMS");
  const [mappingPreviewOpen, setMappingPreviewOpen] = useState(true);
  const logRef = useRef(null);

  const sampleEvents = useRef([
    {
      claim_id: "CLM0001",
      patient_id: "PAT123",
      provider_npi: "1234567890",
      service_date: "2025-09-10",
      procedure_code: "99213",
      amount: 120.0,
      diagnosis_code: "J10",
      status: "PENDING",
    },
    {
      claim_id: "CLM0002",
      patient_id: "PAT456",
      provider_npi: "9876543210",
      service_date: "2025-09-11",
      procedure_code: "87070",
      amount: 45.5,
      diagnosis_code: "A09",
      status: "PENDING",
    },
    {
      claim_id: "CLM0003",
      patient_id: "PAT789",
      provider_npi: "1357924680",
      service_date: "2025-09-09",
      procedure_code: "80050",
      amount: 350.75,
      diagnosis_code: "E11",
      status: "DENIED",
    },
    {
      claim_id: "CLM0004",
      patient_id: "PAT321",
      provider_npi: "2468013579",
      service_date: "2025-09-12",
      procedure_code: "83036",
      amount: 18.25,
      diagnosis_code: "R10",
      status: "APPROVED",
    },
  ]);

  useEffect(() => {
    if (running) {
      setPhase("collecting");
      simulateCollecting();
    }
  }, [running]);
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  function pushLog(text) {
    setLogs((s) =>
      [...s, `${new Date().toLocaleTimeString()} — ${text}`].slice(-200)
    );
  }
  function simulateCollecting() {
    pushLog(
      `Connecting to Kafka topic '${topic}' on partition ${partition}...`
    );
    const steps = [
      { delay: 600, text: "Fetching topic metadata..." },
      { delay: 1200, text: `Reading latest offset (current: ${offset})...` },
      {
        delay: 1900,
        text: `Inspecting schema registry for topic '${topic}'...`,
      },
      { delay: 2500, text: "Verifying Snowflake target and credentials..." },
    ];
    steps.forEach((s) => setTimeout(() => pushLog(s.text), s.delay));
    setTimeout(() => {
      setPhase("transferring");
      pushLog("Starting transfer...");
      simulateTransfer();
    }, 2800);
  }

  function simulateTransfer() {
    let transferred = 0;
    setRowsTransferred(0);
    setThroughput(0);
    const start = Date.now(),
      duration = 4000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(1, elapsed / duration);
      const currentThroughput = Math.round(100 + 900 * pct);
      const add = Math.round(currentThroughput * 0.3);
      transferred += add;
      setRowsTransferred(transferred);
      setThroughput(currentThroughput);
      const sample =
        sampleEvents.current[
          Math.floor(Math.random() * sampleEvents.current.length)
        ];
      pushLog(
        `Parsed claim ${sample.claim_id} (proc=${
          sample.procedure_code
        }, amt=$${sample.amount.toFixed(2)})`
      );
      if (elapsed >= duration) {
        clearInterval(interval);
        pushLog(`Flushed ${transferred} rows into ${snowflakeSchema}.`);
        setPhase("completed");
        setRunning(false);
      }
    }, 300);
  }

  function handleStart() {
    setLogs([]);
    setRowsTransferred(0);
    setThroughput(0);
    setPhase("idle");
    setRunning(true);
  }
  function handleReset() {
    setRunning(false);
    setPhase("idle");
    setLogs([]);
    setRowsTransferred(0);
    setThroughput(0);
  }

  // --- UI ---
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      {/* Header */}
      <header className="p-4 pb-1">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Server className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Real-Time Claims Feed to Snowflake
              </h1>
              <p className="text-sm text-gray-500">
                See how claims flow into your analytics lake seconds after submission.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-5 py-3 overflow-hidden">
        <div className="max-w-6xl mx-auto h-full flex gap-6">
          {/* LEFT PANEL */}
          <Card className="w-2/5 p-5 flex flex-col overflow-y-auto">
            <h2 className="text-lg font-semibold text-indigo-700 mb-4">
              Incoming Claims Stream
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <label className="font-medium text-gray-700">Kafka Topic</label>
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="font-medium text-gray-700">Partition</label>
                  <input
                    type="number"
                    value={partition}
                    onChange={(e) => setPartition(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="font-medium text-gray-700">Offset</label>
                  <input
                    type="number"
                    value={offset}
                    onChange={(e) => setOffset(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-gray-700">Batch Size</label>
                <input
                  type="range"
                  min={100}
                  max={2000}
                  step={50}
                  value={batchSize}
                  onChange={(e) => setBatchSize(Number(e.target.value))}
                  className="w-full accent-indigo-600 mt-1"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Batch: {batchSize} rows
                </p>
              </div>

              <div>
                <label className="font-medium text-gray-700">
                  Snowflake Target
                </label>
                <input
                  value={snowflakeSchema}
                  onChange={(e) => setSnowflakeSchema(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleStart}
                  disabled={running}
                  className={`flex-1 ${
                    running
                      ? "bg-gray-300 text-gray-600"
                      : "bg-indigo-600 text-white"
                  }`}
                >
                  {running ? "Stimulating..." : "Simulate Stream"}
                </Button>
                <Button
                  onClick={handleReset}
                  className="bg-gray-100 border border-gray-300 text-gray-700"
                >
                  <RotateCw className="inline w-4 h-4 mr-1" /> Reset
                </Button>
              </div>

              {mappingPreviewOpen && (
                <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-xs overflow-auto max-h-60">
                  <p className="font-medium text-indigo-700 mb-2">
                    Detected schema
                  </p>
                  <pre>{`{
  "claim_id": "STRING",
  "patient_id": "STRING",
  "provider_npi": "STRING",
  "service_date": "DATE",
  "procedure_code": "STRING",
  "diagnosis_code": "STRING",
  "amount": "NUMBER",
  "status": "STRING",
  "raw_837": "VARIANT"
}`}</pre>
                </div>
              )}
            </div>
          </Card>

          {/* RIGHT PANEL */}
          <div className="flex-1 flex flex-col gap-4 min-h-0">
            {/* Live Transfer Preview */}
            <Card className="flex-1 p-5 flex flex-col min-h-0">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-indigo-700">
                  Live Transfer Preview
                </h3>
                <span className="text-sm text-gray-500">
                  Target:{" "}
                  <span className="font-medium text-indigo-600">
                    {snowflakeSchema}
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
                {/* Stream */}
                <div className="col-span-2 flex flex-col min-h-0">
                  <div className="flex-1 bg-indigo-50 border border-gray-200 rounded-xl p-3 flex flex-col overflow-hidden">
                    <div className="text-xs text-gray-500 mb-2 flex-shrink-0">
                      Incoming Claims
                    </div>
                    <div className="flex-1 overflow-auto pr-1 text-sm space-y-2">
                      {Array.from({ length: 8 }).map((_, i) => {
                        const evt =
                          sampleEvents.current[
                            (i + rowsTransferred) % sampleEvents.current.length
                          ];
                        return (
                          <div
                            key={i}
                            className="bg-white border rounded-lg px-3 py-1 flex justify-between"
                          >
                            <span>
                              {evt.claim_id} • {evt.procedure_code} • $
                              {evt.amount.toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-400">
                              offset {offset + i}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="flex flex-col bg-indigo-50 border border-gray-200 rounded-xl p-4 justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Claims Streamed</p>
                    <div className="mt-2 h-3 bg-white border rounded overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        style={{
                          width: `${Math.min(
                            100,
                            (rowsTransferred / Math.max(1, batchSize * 10)) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                    <p className="mt-2 text-sm font-medium text-indigo-700">
                      {Math.min(
                        100,
                        Math.round(
                          (rowsTransferred / Math.max(1, batchSize * 10)) * 100
                        )
                      )}
                      %
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Avg Stream Delay</p>
                    <p className="font-medium">
                      {phase === "transferring"
                        ? `${Math.round(50 + Math.random() * 150)} ms`
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Logs & Metrics */}
            <Card className="p-5 flex flex-1 min-h-[14rem] overflow-hidden">
              <div className="w-1/2 pr-4 border-r flex flex-col min-h-0">
                <p className="text-sm text-gray-500 mb-2">Live Logs</p>
                <div
                  ref={logRef}
                  className="flex-1 bg-indigo-50 rounded-lg p-2 overflow-auto text-xs"
                >
                  {logs.length === 0 ? (
                    <div className="text-gray-400">
                      No logs yet — start to see activity...
                    </div>
                  ) : (
                    <AnimatePresence>
                      {logs.map((l, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="mb-1"
                        >
                          {l}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </div>

              <div className="w-1/2 pl-4 flex flex-col min-h-0">
                <p className="text-sm text-gray-500 mb-2">Metrics</p>
                <div className="grid grid-cols-2 gap-3 flex-1">
                  <div className="bg-indigo-50 rounded-lg border p-3">
                    <p className="text-xs text-gray-500">Rows/sec</p>
                    <p className="text-lg font-semibold text-indigo-700">
                      {throughput}
                    </p>
                  </div>
                  <div className="bg-indigo-50 rounded-lg border p-3">
                    <p className="text-xs text-gray-500">Total rows</p>
                    <p className="text-lg font-semibold text-indigo-700">
                      {rowsTransferred}
                    </p>
                  </div>
                  <div className="col-span-2 bg-white border rounded-lg p-3">
                    <p className="text-xs text-gray-500">Last commit</p>
                    <p className="mt-1 text-sm text-indigo-700">
                      {phase === "completed"
                        ? `${rowsTransferred} rows committed to ${snowflakeSchema}`
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
