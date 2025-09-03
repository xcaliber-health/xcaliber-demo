import { Link, Outlet } from "react-router-dom";
import { useState, createContext } from "react";

export const AppContext = createContext();

export default function DashboardLayout() {
  const [ehr, setEhr] = useState("Epic");
  const [department, setDepartment] = useState("1");

  return (
    <AppContext.Provider value={{ ehr, department }}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg flex flex-col fixed left-0 top-0 bottom-0">
          <div className="p-6 text-2xl font-bold text-blue-600 border-b">
            Interop Demo
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <Link to="/scheduling" className="block p-2 rounded hover:bg-blue-50">Scheduling</Link>
            <Link to="/patients" className="block p-2 rounded hover:bg-blue-50">Patient Chart</Link>
          </nav>
          <div className="p-4 text-xs text-gray-400 border-t">v0.1 Demo</div>
        </aside>

        {/* Main Area */}
        <div className="flex-1 ml-64 flex flex-col">
          {/* Topbar */}
          <header className="h-20 bg-white shadow flex items-center justify-end px-6 space-x-6">
            <select 
              value={ehr}
              onChange={(e)=>setEhr(e.target.value)}
              className="border rounded-xl px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Epic</option>
              <option>Cerner</option>
              <option>Allscripts</option>
              <option>FHIR Mock</option>
            </select>

            <select 
              value={department}
              onChange={(e)=>setDepartment(e.target.value)}
              className="border rounded-xl px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">1</option>
              <option value="169">169</option>
              <option value="150">150</option>
              <option value="234">234</option>
              <option value="500">500</option>
              <option value="900">900</option>
            </select>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </AppContext.Provider>
  );
}
