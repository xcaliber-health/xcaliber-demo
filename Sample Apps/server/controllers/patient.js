const { patients, chartData } = require("../models/patient");

// GET all patients
exports.getPatients = (req, res) => {
  const { ehr, department } = req.query;
  let data = [...patients];

  if (department) {
    data = data.filter(p => p.departmentId.toString() === department.toString());
  }

  data = data.map(p => ({ ...p, ehr: ehr || "MockFHIR" }));

  res.json(data);
};

// GET single patient + chart
exports.getPatientById = (req, res) => {
  const { ehr } = req.query;
  const id = parseInt(req.params.id);

  let patient = patients.find(p => p.id === id);
  if (!patient) return res.status(404).json({ error: "Patient not found" });

  patient = { ...patient, ehr: ehr || "MockFHIR" };
  const chart = chartData[id] || {};

  res.json({ ...patient, ...chart });
};


// POST new vital
function addEntity(req, res, entity) {
  const id = parseInt(req.params.id);
  const body = req.body;

  if (!chartData[id]) return res.status(404).json({ error: "Patient not found" });

  chartData[id][entity].push(body);
  res.status(201).json(body);
}

//...................................................................................

exports.addVital = (req, res) => addEntity(req, res, "vitals");
exports.addProblem = (req, res) => addEntity(req, res, "problems");
exports.addAllergy = (req, res) => addEntity(req, res, "allergies");
exports.addImmunization = (req, res) => addEntity(req, res, "immunizations");
exports.addMedication = (req, res) => addEntity(req, res, "medications");
exports.addMedicationOrder = (req, res) => addEntity(req, res, "medicationsOrder");
exports.addRequest = (req, res) => addEntity(req, res, "requests");
// (later you can add problems, allergies, meds, etc.)
