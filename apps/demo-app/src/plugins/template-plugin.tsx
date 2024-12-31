'use client';

import { useState } from 'react';


// Import your icons from lucide-react or any other icon library
import { Box } from 'lucide-react';

import type { Plugin } from '../types/plugin';

/**
 * Main component for your plugin
 * This will be the default view when users navigate to your plugin
 */
const MainComponent = () => {
  // Example state management
  const [data, setData] = useState([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ]);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Plugin Title</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Action Button
        </button>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {/* Add your main content here */}
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.id} className="p-4 border rounded-lg">
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Secondary view component
 * Example of an additional route in your plugin
 */
const SecondaryComponent = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Secondary View</h1>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {/* Add your secondary view content here */}
        <p>This is a secondary view in your plugin</p>
      </div>
    </div>
  );
};

/**
 * Example of a reusable component that can be exported
 * Other plugins can import and use this component
 */
const ExampleCard = ({ title, content }: { title: string; content: string }) => (
  <div className="p-4 bg-white rounded-lg shadow-sm border">
    <h3 className="font-semibold">{title}</h3>
    <p className="mt-2 text-gray-600">{content}</p>
  </div>
);

// Define your plugin interface
interface PluginData {
  id: string;
  name: string;
}

// Define your plugin's custom hook types
interface PluginHooks {
  onDataChange: (data: PluginData) => Promise<void>;
  onAction: (id: string) => Promise<void>;
}

/**
 * Main Plugin Definition
 * This is where you configure your plugin's properties and behavior
 */
const TemplatePlugin: Plugin = {
  // Basic plugin metadata
  name: 'template-plugin', // Unique identifier for your plugin
  version: '1.0.0',
  description: 'A template for creating new plugins',
  author: 'Your Name',

  // Optional dependencies
  dependencies: [
    // List any other plugins that this plugin depends on
    // 'another-plugin'
  ],

  // Lifecycle Methods
  async initialize() {
    // Initialize your plugin
    // This is called when the plugin is first loaded
    console.log('Template plugin initialized');
    
    // Example initialization tasks:
    // - Load configuration
    // - Set up event listeners
    // - Initialize state
    // - Connect to services
  },

  async cleanup() {
    // Clean up any resources when the plugin is disabled
    console.log('Template plugin cleaned up');
    
    // Example cleanup tasks:
    // - Save state
    // - Remove event listeners
    // - Close connections
  },

  // Define the routes for your plugin
  routes: [
    {
      path: '/template', // The URL path for this route
      component: MainComponent, // The component to render
      icon: Box, // The icon to show in navigation
      label: 'Template', // The label shown in navigation
      group: 'Template Group', // Group in the navigation menu
      showInSidebar: true, // Whether to show in sidebar navigation
    },
    {
      path: '/template/secondary',
      component: SecondaryComponent,
      icon: Box,
      label: 'Secondary',
      group: 'Template Group',
    },
  ],

  // Define hooks that other plugins can use
  hooks: {
    // Example hooks with TypeScript types
    onDataChange: async (data: PluginData) => {
      console.log('Data changed:', data);

      // Implement your hook logic here
    },
    onAction: async (id: string) => {
      console.log('Action triggered for:', id);

      // Implement your hook logic here
    },
  },

  // Export reusable components
  components: {
    ExampleCard: ExampleCard,

    // Add more reusable components here
  },
};

export default TemplatePlugin;
