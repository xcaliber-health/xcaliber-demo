'use client';

// Import your icons from lucide-react or any other icon library
import { Box } from 'lucide-react';

import type { Plugin } from '../types/plugin';

import PatientChart from '@xcaliber/patient-chart/PatientChartComponent';

/**
 * Main component for your plugin
 * This will be the default view when users navigate to your plugin
 */
const PatientChartComponent = () => {
  return (
    <PatientChart />
  );
};


/**
 * Main Plugin Definition
 * This is where you configure your plugin's properties and behavior
 */
const PatientChartPlugin: Plugin = {
  // Basic plugin metadata
  name: 'patient-chart', // Unique identifier for your plugin
  version: '1.0.0',
  description: 'A plugin for patient chart demo',
  author: 'Xcaliber',

  // Lifecycle Methods
  async initialize() {
    console.log('Patient Chart plugin initialized');
  },

  async cleanup() {
    console.log('Patient Chart plugin cleaned up');
  },

  // Define the routes for your plugin
  routes: [
    {
      path: '/patient-chart', // The URL path for this route
      component: PatientChartComponent, // The component to render
      icon: Box, // The icon to show in navigation
      label: 'Patient Chart', // The label shown in navigation
      group: 'Patient Chart Group', // Group in the navigation menu
      showInSidebar: true, // Whether to show in sidebar navigation
    },
  ],

};

export default PatientChartPlugin;
