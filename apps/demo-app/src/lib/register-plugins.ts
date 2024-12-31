'use client';

import { pluginManager } from './plugin-manager';
// import DashboardPlugin from '../plugins/dashboard-plugin';
// import NotesPlugin from '../plugins/notes-plugin';
import DeIdentificationPlugin from '../plugins/de-identification-plugin';

export async function registerPlugins() {
  try {
    // await pluginManager.registerPlugin(DashboardPlugin);
    // await pluginManager.registerPlugin(NotesPlugin);
    await pluginManager.registerPlugin(DeIdentificationPlugin);
    
    // Register other plugins here
  } catch (error) {
    console.error('Failed to register plugins:', error);
  }
}
