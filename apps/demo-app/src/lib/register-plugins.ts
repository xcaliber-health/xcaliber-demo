'use client';

import { pluginManager } from './plugin-manager';
// import DashboardPlugin from '../plugins/dashboard-plugin';
// import NotesPlugin from '../plugins/notes-plugin';
import DeIdentificationPlugin from '../plugins/de-identification-plugin';
import PatientChartPlugin from '../plugins/patient-chart';
import LabOrderPlugin from '@/plugins/lab-order';

export async function registerPlugins() {
  try {
    // await pluginManager.registerPlugin(DashboardPlugin);
    // await pluginManager.registerPlugin(NotesPlugin);
    await pluginManager.registerPlugin(DeIdentificationPlugin);
    await pluginManager.registerPlugin(PatientChartPlugin);
    await pluginManager.registerPlugin(LabOrderPlugin)
    
    // Register other plugins here
  } catch (error) {
    console.error('Failed to register plugins:', error);
  }
}
