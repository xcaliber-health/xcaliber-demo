import React, { useState } from 'react';
import { WalkthroughProvider, useWalkthrough } from '../plugins/walkthrough-plugin';
import DeIdentification from '@xcaliber/privacy-preservation/DeIdentificationComponent';
import { Box, Tab, Tabs } from '@mui/material';

const DemoContent = () => {
  const { start } = useWalkthrough();
  const [currentTab, setCurrentTab] = useState(0);

  const startDemo = () => {
    start([
      {
        target: '#deid-tabs',
        title: 'Welcome to De-Identification',
        content: 'This tool helps you manage and protect sensitive data through various de-identification methods. Let\'s explore the main features.',
        requiredInteraction: {
          type: 'click',
          message: 'Click the Dashboards tab to continue',
          validator: (event: CustomEvent) => {
            return document.getElementById('deid-tab-dashboard')?.getAttribute('aria-selected') === 'true';
          }
        }
      },
      {
        target: '#deid-panel-dashboard',
        title: 'Dashboards',
        content: 'The dashboard provides an overview of your de-identification activities and metrics. Monitor the effectiveness of your privacy preservation measures here.',
        requiredInteraction: {
          type: 'click',
          message: 'Click the Synthetic Data tab to continue',
          validator: (event: CustomEvent) => {
            return document.getElementById('deid-tab-synthetic')?.getAttribute('aria-selected') === 'true';
          }
        }
      },
      {
        target: '#deid-panel-synthetic',
        title: 'Synthetic Data',
        content: 'Generate and manage synthetic data that maintains statistical properties while protecting individual privacy. View your files and their de-identification status.',
        requiredInteraction: {
          type: 'click',
          message: 'Click the Patient Documentation tab to continue',
          validator: (event: CustomEvent) => {
            return document.getElementById('deid-tab-docs')?.getAttribute('aria-selected') === 'true';
          }
        }
      },
      {
        target: '#deid-panel-docs',
        title: 'Patient Documentation',
        content: 'Access and manage patient documents with built-in privacy controls. Ensure sensitive medical information remains protected.',
        requiredInteraction: {
          type: 'click',
          message: 'Click the Data Products tab to continue',
          validator: (event: CustomEvent) => {
            return document.getElementById('deid-tab-products')?.getAttribute('aria-selected') === 'true';
          }
        }
      },
      {
        target: '#deid-panel-products',
        title: 'Data Products',
        content: 'Manage your data products including documents, interactions, encounters, and document providers. Each table comes with specific privacy settings.',
        requiredInteraction: {
          type: 'click',
          message: 'Click the Tuning tab to continue',
          validator: (event: CustomEvent) => {
            return document.getElementById('deid-tab-tuning')?.getAttribute('aria-selected') === 'true';
          }
        }
      },
      {
        target: '#deid-panel-tuning',
        title: 'Tuning',
        content: 'Fine-tune your de-identification policies and settings. Configure how sensitive data is handled and protected across your system.',
        requiredInteraction: {
          type: 'click',
          message: 'Click anywhere in this panel to finish the tour',
          validator: (event: CustomEvent) => {
            const clickedPanel = (event.target as HTMLElement).closest('#deid-panel-tuning');
            return clickedPanel !== null;
          }
        }
      }
    ]);
  };

  return (
    <div style={{ height: '100%' }}>
      <button
        onClick={startDemo}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '10px 20px',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        Start Tour
      </button>
      <DeIdentification />
    </div>
  );
};

const DeIdentificationDemo = () => {
  return (
    <WalkthroughProvider>
      <DemoContent />
    </WalkthroughProvider>
  );
};

export default DeIdentificationDemo;
