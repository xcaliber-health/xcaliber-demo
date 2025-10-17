import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function KafkaToSnowflakeDemo() {
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
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  function pushLog(text) {
    setLogs((s) => [
      ...s,
      `${new Date().toLocaleTimeString()} — ${text}`,
    ].slice(-200));
  }

  function simulateCollecting() {
    pushLog(`Connecting to Kafka topic '${topic}' on partition ${partition}...`);
    const steps = [
      { delay: 600, text: "Fetching topic metadata (partitions, leaders)..." },
      { delay: 1200, text: `Reading latest offset (current: ${offset})...` },
      { delay: 1900, text: `Inspecting schema registry for topic '${topic}'...` },
      { delay: 2500, text: "Verifying Snowflake target and credentials..." },
    ];

    steps.forEach((s) => {
      setTimeout(() => pushLog(s.text), s.delay);
    });

    setTimeout(() => {
      setPhase("transferring");
      pushLog("Starting transfer: streaming EDI claims and writing to Snowflake...");
      simulateTransfer();
    }, 2800);
  }

  function simulateTransfer() {
    let transferred = 0;
    setRowsTransferred(0);
    setThroughput(0);

    const start = Date.now();
    const duration = 4000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(1, elapsed / duration);
      const currentThroughput = Math.round(100 + 900 * pct);
      const add = Math.round(currentThroughput * 0.3);

      transferred += add;
      setRowsTransferred(transferred);
      setThroughput(currentThroughput);

      const sample =
        sampleEvents.current[Math.floor(Math.random() * sampleEvents.current.length)];
      pushLog(
        `Parsed claim ${sample.claim_id} (patient=${sample.patient_id}, proc=${sample.procedure_code}, amt=$${sample.amount.toFixed(
          2
        )}, status=${sample.status})`
      );

      if (elapsed >= duration) {
        clearInterval(interval);
        pushLog(`Flushed ${transferred} rows into Snowflake table ${snowflakeSchema}.`);
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

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start gap-6">
          {/* LEFT PANEL — Controls */}
          <div className="w-2/5 bg-white rounded-2xl shadow p-5">
            <h2 className="text-xl font-semibold mb-3">
              Kafka → Snowflake (EDI claims)
            </h2>

            <div className="space-y-3">
              <label className="block text-sm">Kafka Topic</label>
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm">Partition</label>
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={partition}
                    onChange={(e) => setPartition(Number(e.target.value))}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm">Starting offset</label>
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={offset}
                    onChange={(e) => setOffset(Number(e.target.value))}
                  />
                </div>
              </div>

              <label className="block text-sm">Batch size</label>
              <input
                type="range"
                min={100}
                max={2000}
                step={50}
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
              />
              <div className="text-sm text-slate-500">
                Batch: {batchSize} rows
              </div>

              <label className="block text-sm">Snowflake Target</label>
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                value={snowflakeSchema}
                onChange={(e) => setSnowflakeSchema(e.target.value)}
              />

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleStart}
                  disabled={running}
                  className={`flex-1 py-2 rounded-lg font-medium transition disabled:opacity-50 ${
                    running
                      ? "bg-slate-300 text-slate-700"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {running ? "Running..." : "Start"}
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg border"
                >
                  Reset
                </button>
              </div>

              <div className="mt-4 text-sm space-y-1">
                <div>
                  Status: <span className="font-medium">{phase}</span>
                </div>
                <div>
                  Rows transferred:{" "}
                  <span className="font-medium">{rowsTransferred}</span>
                </div>
                <div>
                  Throughput:{" "}
                  <span className="font-medium">{throughput} rows/s</span>
                </div>
              </div>

              <div className="mt-4">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={mappingPreviewOpen}
                    onChange={() => setMappingPreviewOpen((v) => !v)}
                  />
                  <span className="text-sm">Show mapping/schema preview</span>
                </label>
              </div>

              {mappingPreviewOpen && (
                <div className="mt-3 bg-slate-50 p-3 rounded text-sm border">
                  <div className="font-medium">
                    Detected schema (EDI 837 → Snowflake mapping)
                  </div>
                  <pre className="text-xs mt-2">{`{
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
          </div>

          {/* RIGHT PANEL — Visualization */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow p-5 mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Live Transfer Preview</h3>
                <div className="text-sm text-slate-500">
                  Target: <span className="font-medium">{snowflakeSchema}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                {/* Event Stream */}
                <div className="col-span-2">
                  <div className="h-40 rounded-lg border p-3 bg-slate-50 overflow-auto text-sm">
                    <div className="mb-2 text-xs text-slate-500">
                      Event stream 
                    </div>
                    <div className="space-y-2">
                      {Array.from({ length: 6 }).map((_, i) => {
                        const evt =
                          sampleEvents.current[
                            (i + rowsTransferred) %
                              sampleEvents.current.length
                          ];
                        return (
                          <div
                            key={`${evt.claim_id}-${i}`}
                            className="flex items-center justify-between bg-white border rounded px-3 py-1"
                          >
                            <div className="text-sm font-medium">
                              {evt.claim_id} • {evt.procedure_code} • ${evt.amount.toFixed(2)}
                            </div>
                            <div className="text-xs text-slate-400">
                              offset {offset + i}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Progress + Offsets */}
                <div>
                  <div className="rounded-lg border p-3 bg-slate-50">
                    <div className="text-xs text-slate-500">Progress</div>
                    <div className="mt-2 h-3 w-full bg-white rounded overflow-hidden border">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                        style={{
                          width: `${Math.min(
                            100,
                            (rowsTransferred / Math.max(1, batchSize * 10)) * 100
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="mt-2 text-sm font-medium">
                      {Math.min(
                        100,
                        Math.round(
                          (rowsTransferred / Math.max(1, batchSize * 10)) * 100
                        )
                      )}
                      %
                    </div>

                    <div className="mt-4 text-xs text-slate-500">
                      Latency 
                    </div>
                    <div className="mt-1 font-medium">
                      {phase === "transferring"
                        ? `${Math.round(50 + Math.random() * 150)} ms`
                        : "—"}
                    </div>
                  </div>

                  <div className="mt-3 rounded-lg border p-3 bg-white text-sm">
                    <div className="text-xs text-slate-500">Offsets</div>
                    <div className="mt-2">
                      current: <span className="font-medium">{offset}</span>
                    </div>
                    <div>
                      committed:{" "}
                      <span className="font-medium">
                        {offset + rowsTransferred}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logs + Metrics */}
            <div className="bg-white rounded-2xl shadow p-4 h-60 flex">
              {/* Logs */}
              <div className="w-1/2 border-r pr-4">
                <div className="text-sm text-slate-500 mb-2">Live logs</div>
                <div
                  ref={logRef}
                  className="h-full overflow-auto text-xs bg-slate-50 p-2 rounded"
                >
                  {logs.length === 0 && (
                    <div className="text-slate-400">
                      No logs yet — start to see collection and transfer
                      steps.
                    </div>
                  )}
                  <AnimatePresence>
                    {logs.map((l, i) => (
                      <motion.div
                        key={`${l}-${i}`}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className="mb-1"
                      >
                        <div>{l}</div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Metrics */}
              <div className="w-1/2 pl-4 flex flex-col">
                <div className="text-sm text-slate-500 mb-2">Metrics</div>
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded p-3 text-sm border">
                    <div className="text-xs text-slate-500">Rows/sec</div>
                    <div className="text-lg font-semibold">{throughput}</div>
                  </div>
                  <div className="bg-slate-50 rounded p-3 text-sm border">
                    <div className="text-xs text-slate-500">Total rows</div>
                    <div className="text-lg font-semibold">
                      {rowsTransferred}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded p-3 text-sm border col-span-2">
                    <div className="text-xs text-slate-500">Last commit</div>
                    <div className="mt-2 text-sm">
                      {phase === "completed"
                        ? `${rowsTransferred} rows committed to ${snowflakeSchema}`
                        : "—"}
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-400">
                  Tip: Use the inputs on the left to change topic/offset before
                  starting .
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
