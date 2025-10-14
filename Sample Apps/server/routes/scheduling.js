const express = require("express");
const router = express.Router();
const schedulingController = require("../controllers/scheduling");


router.get("/providers", schedulingController.getProviders);
router.get("/slots", schedulingController.getSlots);
router.get("/slots/:id", schedulingController.getSlotById);
router.post("/appointments", schedulingController.bookAppointment);
router.get("/appointments", schedulingController.getAppointments);

module.exports = router;