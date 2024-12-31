'use client';

import { useState } from 'react';

import {
  LayoutDashboard,
  BarChart,
  Users as UsersIcon,
  Settings as SettingsIcon,
  Bell,
  Calendar as CalendarIcon
} from 'lucide-react';

import type { Plugin } from '../types/plugin';

// Dashboard Component
const DashboardHome = () => {
  const [stats] = useState([
    { label: 'Total Users', value: '12345' },
    { label: 'Active Users', value: '8234' },
    { label: 'Revenue', value: '$45678' },
    { label: 'Growth', value: '+23%' }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-6 bg-white rounded-lg shadow-sm border"
          >
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Analytics Component
const Analytics = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">User Growth</h2>
        {/* Add your charts/graphs here */}
        <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
          Chart Placeholder
        </div>
      </div>
    </div>
  );
};

// Users Component
const UsersComponent = () => {
  const [users] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' }
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Users</h1>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Settings Component
const SettingsComponent = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center">
                <input
                  id="email-notifications"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  defaultChecked
                />
                <label
                  htmlFor="email-notifications"
                  className="ml-3 text-gray-700"
                >
                  Email Notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="push-notifications"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label
                  htmlFor="push-notifications"
                  className="ml-3 text-gray-700"
                >
                  Push Notifications
                </label>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Theme</h3>
            <select className="mt-4 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option>Light</option>
              <option>Dark</option>
              <option>System</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notifications Component
const Notifications = () => {
  const [notifications] = useState([
    { id: 1, message: 'New user registered', time: '5 min ago' },
    { id: 2, message: 'Server update completed', time: '1 hour ago' },
    { id: 3, message: 'Backup completed', time: '2 hours ago' }
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
      <div className="bg-white rounded-lg shadow-sm border divide-y">
        {notifications.map((notification) => (
          <div key={notification.id} className="p-4 hover:bg-gray-50">
            <p className="text-gray-900">{notification.message}</p>
            <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Calendar Component
const CalendarComponent = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="h-96 flex items-center justify-center text-gray-500">
          Calendar Component Placeholder
        </div>
      </div>
    </div>
  );
};

const DashboardPlugin: Plugin = {
  name: 'dashboard',
  version: '1.0.0',
  description:
    'A comprehensive dashboard plugin with analytics and user management',
  author: 'Example Author',

  // Plugin initialization
  async initialize() {
    console.log('Dashboard plugin initialized');
  },

  // Plugin cleanup
  async cleanup() {
    console.log('Dashboard plugin cleaned up');
  },

  // Define routes with proper grouping
  routes: [
    {
      path: '/dashboard',
      component: DashboardHome,
      icon: LayoutDashboard,
      label: 'Overview',
      group: 'Dashboard',
    },
    {
      path: '/analytics',
      component: Analytics,
      icon: BarChart,
      label: 'Analytics',
      group: 'Dashboard',
    },
    {
      path: '/users',
      component: UsersComponent,
      icon: UsersIcon,
      label: 'Users',
      group: 'Management',
    },
    {
      path: '/notifications',
      component: Notifications,
      icon: Bell,
      label: 'Notifications',
      group: 'Management',
    },
    {
      path: '/calendar',
      component: CalendarComponent,
      icon: CalendarIcon,
      label: 'Calendar',
      group: 'Tools',
    },
    {
      path: '/settings',
      component: SettingsComponent,
      icon: SettingsIcon,
      label: 'Settings',
      group: 'System',
    },
  ],

  // Example hooks
  hooks: {
    onUserLogin: async (userId: string) => {
      console.log(`User ${userId} logged in`);
    },
    onDataRefresh: async () => {
      console.log('Dashboard data refreshed');
    },
  },

  // Reusable components
  components: {
    StatCard: ({ label, value }: { label: string; value: string }) => (
      <div className="p-6 bg-white rounded-lg shadow-sm border">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-semibold text-gray-900 mt-2">{value}</p>
      </div>
    ),
  },
};

export default DashboardPlugin;
