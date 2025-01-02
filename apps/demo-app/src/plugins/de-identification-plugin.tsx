'use client';

// Import your icons from lucide-react or any other icon library
import { Box } from 'lucide-react';

import React from 'react';
import { Card } from '@mui/material';

import type { Plugin } from '../types/plugin';
import DeIdentificationDemo from '@/components/DeIdentificationDemo';
import WalkthroughDemo from '@/components/WalkthroughDemo';

/**
 * Main component for your plugin
 * @returns JSX.Element
 */
const PrivacyPreservation = () => {
  return (
    <DeIdentificationDemo />
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
