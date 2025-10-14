const express = require("express");
const router = express.Router();
const controller = require("../controllers/patient");

// Routes
router.get("/", controller.getPatients);
router.get("/:id", controller.getPatientById);

// POST endpoints for each tab
router.post("/:id/vitals", controller.addVital);
router.post("/:id/problems", controller.addProblem);
router.post("/:id/allergies", controller.addAllergy);
router.post("/:id/immunizations", controller.addImmunization);
router.post("/:id/medications", controller.addMedication);
router.post("/:id/medication-orders", controller.addMedicationOrder);
router.post("/:id/requests", controller.addRequest);


module.exports = router;
