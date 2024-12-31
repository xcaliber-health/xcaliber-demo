'use client';

import { createContext, useContext } from 'react';

import type { Plugin, PluginRoute, PluginEventType, PluginEventCallback } from '../types/plugin';

// Define the shape of the plugin manager
interface IPluginManager {
  getPlugin: (name: string) => Plugin | undefined;
  getComponent: (componentId: string) => React.ComponentType<any> | undefined;
  getPluginStatus: (name: string) => (Plugin & { enabled: boolean; lastEnabled?: Date; lastDisabled?: Date; }) | null;
  getRoutes: () => PluginRoute[];
  enablePlugin: (name: string) => Promise<void>;
  disablePlugin: (name: string) => Promise<void>;
  getAllPlugins: () => Plugin[];
  onRoutesUpdate: (callback: () => void) => () => void;
  onPluginEvent: <T extends PluginEventType>(event: T, callback: PluginEventCallback<T>) => () => void;
  getPluginForRoute: (path: string) => Plugin | null;
}

const PluginContext = createContext<IPluginManager | null>(null);

export function PluginProvider({
  children,
  pluginManager,
}: {
  children: React.ReactNode;
  pluginManager: IPluginManager;
}) {
  return (
    <PluginContext.Provider value={pluginManager}>
      {children}
    </PluginContext.Provider>
  );
}

export function usePlugin(pluginName: string): Plugin | undefined {
  const manager = useContext(PluginContext);

  if (!manager) {
    throw new Error('usePlugin must be used within a PluginProvider');
  }

  return manager.getPlugin(pluginName);
}

export function usePluginComponent(componentId: string) {
  const manager = useContext(PluginContext);

  if (!manager) {
    throw new Error('usePluginComponent must be used within a PluginProvider');
  }

  return manager.getComponent(componentId);
}

export function usePluginStatus(pluginName: string) {
  const manager = useContext(PluginContext);

  if (!manager) {
    throw new Error('usePluginStatus must be used within a PluginProvider');
  }

  return manager.getPluginStatus(pluginName);
}

export function usePluginManager() {
  const manager = useContext(PluginContext);

  if (!manager) {
    throw new Error('usePluginManager must be used within a PluginProvider');
  }

  return manager;
}
