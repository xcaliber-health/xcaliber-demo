const { providers, slots, appointments} = require("../models/scheduling");

/**
 * GET providers (filter by department optional)
 */
exports.getProviders = (req, res) => {
  const { department } = req.query;
  let data = [...providers];

  if (department) {
    data = data.filter((p) => p.departmentId.toString() === department.toString());
  }

  res.json(data);
};

/**
 * GET slots by provider
 */
exports.getSlots = (req, res) => {
  console.log("hi")
  const { provider } = req.query;
  let data = [...slots];

  if (provider) {
    data = data.filter((s) => s.providerId.toString() === provider.toString());
  }

  res.json(data);
};

/**
 * GET single slot by ID
 */
exports.getSlotById = (req, res) => {
  const id = parseInt(req.params.id);
  const slot = slots.find((s) => s.id === id);

  if (!slot) return res.status(404).json({ error: "Slot not found" });

  res.json(slot);
};

/**
 * POST new appointment (book slot)
 */
exports.bookAppointment = (req, res) => {
  const { patientId, slotId, providerId } = req.body;
  console.log("hi")
  const slot = slots.find((s) => s.id === slotId);
  if (!slot) return res.status(400).json({ error: "Invalid slot" });

  const provider = providers.find((p) => p.id === providerId);
  if (!provider) return res.status(400).json({ error: "Invalid provider" });

  const appointment = {
    id: appointments.length + 1,
    patientId,
    providerId,
    providerName: provider.name,
    start: slot.start,
    end: slot.end,
    status: "booked",
  };

  appointments.push(appointment);

  // Remove booked slot
  slots = slots.filter((s) => s.id !== slotId);
  console.log(appointment)
  res.json(appointment);
};

/**
 * GET appointments for a patient
 */
exports.getAppointments = (req, res) => {
  res.json(appointments);
};


