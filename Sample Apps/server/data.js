// Demo patient dataset
const patients = [
  {
    id: 1,
    name: "John Doe",
    gender: "male",
    birthDate: "1985-02-15",
    email: "john.doe@example.com",
    city: "New York",
    state: "NY",
    phone: "555-1234",
    departmentId: 1,
  },
  {
    id: 2,
    name: "Jane Smith",
    gender: "female",
    birthDate: "1990-07-22",
    email: "jane.smith@example.com",
    city: "Boston",
    state: "MA",
    phone: "555-5678",
    departmentId: 169,
  },
  {
    id: 3,
    name: "Raj Patel",
    gender: "male",
    birthDate: "1978-11-03",
    email: "raj.patel@example.com",
    city: "San Francisco",
    state: "CA",
    phone: "555-9876",
    departmentId: 150,
  },
];

// Extended chart data
const chartData = {
  1: {
    vitals: [
      { name: "Blood Pressure", value: "120/80", date: "2025-08-01" },
      { name: "Heart Rate", value: "72 bpm", date: "2025-08-01" },
    ],
    problems: [
      { name: "Hypertension", status: "Active" },
    ],
    allergies: [
      { name: "Penicillin", reaction: "Rash" },
    ],
    immunizations: [
      { name: "COVID-19", date: "2022-02-20" },
    ],
    appointments: [
      { type: "Cardiology", date: "2025-09-05" },
    ],
  },
  2: {
    vitals: [
      { name: "Blood Pressure", value: "110/70", date: "2025-08-02" },
    ],
    problems: [],
    allergies: [],
    immunizations: [],
    appointments: [],
  },
  3: {
    vitals: [
      { name: "Blood Pressure", value: "130/85", date: "2025-08-03" },
    ],
    problems: [{ name: "Diabetes Type 2", status: "Active" }],
    allergies: [{ name: "Peanuts", reaction: "Swelling" }],
    immunizations: [],
    appointments: [],
  },
};

module.exports = { patients, chartData };
