'use client';

// Import your icons from lucide-react or any other icon library
import { Box } from 'lucide-react';

import type { Plugin } from '../types/plugin';
import DeIdentification from '@xcaliber/privacy-preservation/DeIdentificationComponent';

/**
 * Main component for your plugin
 * This will be the default view when users navigate to your plugin
 */
const PrivacyPreservation = () => {
  return (
    <DeIdentification />
  );
};


/**
 * Main Plugin Definition
 * This is where you configure your plugin's properties and behavior
 */
const PrivacyPreservationPlugin: Plugin = {
  // Basic plugin metadata
  name: 'privacy-preservation', // Unique identifier for your plugin
  version: '1.0.0',
  description: 'A plugin for privacy preservation demo',
  author: 'Xcaliber',

  // Lifecycle Methods
  async initialize() {
    console.log('Privacy Preservation plugin initialized');
  },

  async cleanup() {
    console.log('Privacy Preservation plugin cleaned up');
  },

  // Define the routes for your plugin
  routes: [
    {
      path: '/privacy-preservation', // The URL path for this route
      component: PrivacyPreservation, // The component to render
      icon: Box, // The icon to show in navigation
      label: 'Privacy Preservation', // The label shown in navigation
      group: 'Privacy Preservation Group', // Group in the navigation menu
      showInSidebar: true, // Whether to show in sidebar navigation
    },
  ],

};

export default PrivacyPreservationPlugin;
