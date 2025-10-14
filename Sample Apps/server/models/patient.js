// In-memory patient + chart data
const patients = [
  { id: 1, name: "John Doe", gender: "male", birthDate: "1985-02-15", email: "john.doe@example.com", city: "New York", state: "NY", phone: "555-1234", departmentId: 1 },
  { id: 2, name: "Jane Smith", gender: "female", birthDate: "1990-07-22", email: "jane.smith@example.com", city: "Boston", state: "MA", phone: "555-5678", departmentId: 169 },
  // ... more patients
];

const chartData = {};
for (let i = 1; i <= patients.length; i++) {
  chartData[i] = {
    vitals: [
      { name: "Blood Pressure", value: `${110 + i}/80`, date: "2025-08-01" },
      { name: "Heart Rate", value: `${70 + (i % 10)} bpm`, date: "2025-08-01" },
    ],
    problems: [{ name: `Condition ${i}`, synopsis: "Dummy synopsis", date: "2025-08-01" }],
    allergies: [{ name: `Allergy ${i}`, status: "active", date: "2025-08-03" }],
    immunizations: [{ name: "COVID-19", date: "2022-02-20" }],
    medications: [{ name: `Medication ${i}`, date: "2023-02-20" }],
    medicationsOrder: [{ name: `Medication ${i}`, date: "2023-05-20" }],
    appointments: [{ type: "General", date: `2025-09-${(i % 28) + 1}` }],
  };
}


module.exports = { patients, chartData};
