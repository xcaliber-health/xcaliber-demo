
import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "../layouts/DashboardLayout";
import { fetchAppointments } from "../api/appointment";
import { Loader2, X, Calendar, Filter, Clock, User, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// ✅ Reusable components
function Card({ children, className = "" }) {
  return (
    <div className={`bg-white/95 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 ${className}`}>
      {children}
    </div>
  );
}

function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}

function Select({ children, className = "", ...props }) {
  return (
    <select
      {...props}
      className={`border-2 border-gray-200/50 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 outline-none bg-white/80 backdrop-blur-sm transition-all duration-200 ${className}`}
    >
      {children}
    </select>
  );
}

const localizer = momentLocalizer(moment);

export default function AppointmentDashboard() {
  const { sourceId, departmentId } = useContext(AppContext);
  const location = useLocation();
  const { providerId, providerName } = location.state || {};

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  // ✅ Month/Year selection
  const [selectedMonth, setSelectedMonth] = useState(moment().month());
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [currentDate, setCurrentDate] = useState(new Date());

  // ✅ Modal
  const [selectedEvent, setSelectedEvent] = useState(null);

  const isAthena = sourceId?.startsWith("ef");
  const patientId = isAthena
    ? import.meta.env.VITE_ATHENA_PATIENT_ID
    : import.meta.env.VITE_ELATION_PATIENT_ID;

  useEffect(() => {
    if (!sourceId || !patientId) return;

    setLoading(true);
    setError(null);

    fetchAppointments({
      patientId,
      sourceId,
      departmentId,
      providerId,
    })
      .then(setAppointments)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [sourceId, departmentId, patientId, providerId]);

  // ✅ Apply filter
  const filteredAppointments =
    statusFilter === "all"
      ? appointments
      : appointments.filter((appt) => appt.status === statusFilter);

  // ✅ Transform appointments for calendar
  const calendarEvents = filteredAppointments.map((appt) => ({
    id: appt.id,
    title: `${appt.type} (${appt.status})`,
    start: appt.start ? new Date(appt.start) : new Date(),
    end: appt.end ? new Date(appt.end) : new Date(),
    resource: appt,
  }));

  // ✅ Custom event style
  const eventStyleGetter = (event) => {
    let bg = "#6366f1"; // indigo default
    if (event.resource.status === "Checked-In") bg = "#10b981"; // emerald
    if (event.resource.status === "Checked-Out") bg = "#6b7280"; // gray
    if (event.resource.status === "Future") bg = "#3b82f6"; // blue
    return {
      style: {
        backgroundColor: bg,
        borderRadius: "8px",
        color: "white",
        padding: "4px 8px",
        border: "none",
        fontSize: "12px",
        fontWeight: "500",
      },
    };
  };

  // ✅ Handle month/year filter
  useEffect(() => {
    const newDate = moment()
      .year(selectedYear)
      .month(selectedMonth)
      .startOf("month")
      .toDate();
    setCurrentDate(newDate);
  }, [selectedMonth, selectedYear]);

  // ✅ Status icon helper
  const getStatusIcon = (status) => {
    switch (status) {
      case "Checked-In":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case "Checked-Out":
        return <XCircle className="w-4 h-4 text-gray-600" />;
      case "Future":
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 pb-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {providerName ? `Appointments with ${providerName}` : "My Appointments"}
              </h1>
              <p className="text-sm text-gray-600">View and manage your healthcare appointments</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-500" />
              <label className="text-sm font-medium text-gray-700">Status:</label>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="min-w-[120px]"
              >
                <option value="all">All Status</option>
                <option value="Future">Future</option>
                <option value="Checked-In">Checked In</option>
                <option value="Checked-Out">Checked Out</option>
              </Select>
            </div>

            {/* Month / Year Selectors */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="min-w-[100px]"
              >
                {moment.months().map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </Select>

              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="min-w-[80px]"
              >
                {Array.from({ length: moment().year() - 2015 + 1 }, (_, i) => 2015 + i).map(
                  (year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  )
                )}
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden px-4 pb-4 min-h-0">
        <div className="max-w-7xl mx-auto h-full">
          <Card className="h-full flex flex-col max-h-[500px]">
            <div className="flex-1 flex flex-col p-4 overflow-hidden min-h-0">
              {/* Stats Bar */}
              {!loading && appointments.length > 0 && (
                <div className="flex-shrink-0 mb-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-indigo-700">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">
                          {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="text-gray-600">
                        {moment.months()[selectedMonth]} {selectedYear}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Future</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        <span>Checked-In</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        <span>Checked-Out</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div className="flex-1 flex justify-center items-center text-indigo-600">
                  <div className="text-center">
                    <Loader2 className="animate-spin h-8 w-8 mx-auto mb-3" />
                    <p className="text-sm font-medium">Loading appointments...</p>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex-shrink-0 p-4 bg-red-50 border border-red-200 rounded-xl mb-3">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-700 font-medium">Error: {error}</p>
                  </div>
                </div>
              )}

              {/* Empty */}
              {!loading && filteredAppointments.length === 0 && !error && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No appointments found</h3>
                    <p className="text-sm text-gray-500 mb-4">Try changing filters or check with your provider</p>
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={() => setStatusFilter("all")}
                    >
                      Show All Appointments
                    </Button>
                  </div>
                </div>
              )}

              {/* Calendar View */}
              {!loading && filteredAppointments.length > 0 && (
                <div className="flex-1 overflow-hidden min-h-0">
                  <div className="h-full calendar-container">
                    <BigCalendar
                      localizer={localizer}
                      events={calendarEvents}
                      startAccessor="start"
                      endAccessor="end"
                      style={{ height: "100%" }}
                      eventPropGetter={eventStyleGetter}
                      date={currentDate}
                      onSelectEvent={(event) => setSelectedEvent(event.resource)}
                      views={["month"]}
                      popup
                      className="custom-calendar"
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal for Appointment Actions */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 w-full max-w-md relative border border-white/20">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
                <p className="text-sm text-gray-600">Manage your appointment</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Type:</span>
                <span className="text-sm text-gray-900">{selectedEvent.type}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Start:</span>
                <span className="text-sm text-gray-900">
                  {new Date(selectedEvent.start).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">End:</span>
                <span className="text-sm text-gray-900">
                  {new Date(selectedEvent.end).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedEvent.status)}
                  <span className="text-sm text-gray-900">{selectedEvent.status}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm">
                Check-In
              </Button>
              <Button className="bg-gray-600 hover:bg-gray-700 text-white text-sm">
                Check-Out
              </Button>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white text-sm">
                Reschedule
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white text-sm">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .calendar-container .rbc-calendar {
          font-family: inherit;
        }
        .calendar-container .rbc-header {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border: 1px solid #e2e8f0;
          font-weight: 600;
          color: #475569;
          padding: 12px 8px;
        }
        .calendar-container .rbc-month-view {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
        }
        .calendar-container .rbc-date-cell {
          padding: 8px;
        }
        .calendar-container .rbc-today {
          background-color: #fef3c7;
        }
        .calendar-container .rbc-off-range-bg {
          background-color: #f8fafc;
        }
        .calendar-container .rbc-event {
          border-radius: 8px !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}