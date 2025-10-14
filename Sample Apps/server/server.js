const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const patientRoutes = require("./routes/patient");
const schedulingRoutes = require("./routes/scheduling")
app.use("/api/patients", patientRoutes);
app.use("/api/scheduling",schedulingRoutes)

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
