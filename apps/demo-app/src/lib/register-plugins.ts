'use client';

import { pluginManager } from './plugin-manager';
import DashboardPlugin from '../plugins/dashboard-plugin';
import NotesPlugin from '../plugins/notes-plugin';

export async function registerPlugins() {
  try {
    await pluginManager.registerPlugin(DashboardPlugin);
    await pluginManager.registerPlugin(NotesPlugin);
    
    // Register other plugins here
  } catch (error) {
    console.error('Failed to register plugins:', error);
  }
}
