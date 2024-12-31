'use client';

import { useState, useEffect } from 'react';

import { Settings, Info } from 'lucide-react';

import { pluginManager } from '@/lib/plugin-manager';

interface PluginState {
  name: string;
  version: string;
  description?: string;
  enabled: boolean;
  author?: string;
  lastEnabled?: Date;
  lastDisabled?: Date;
}

export default function PluginManager() {
  const [plugins, setPlugins] = useState<PluginState[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlugins();
  }, []);

  const loadPlugins = () => {
    try {
      const allPlugins = pluginManager.getAllPlugins().map((plugin) => {
        const status = pluginManager.getPluginStatus(plugin.name);

        
return {
          ...plugin,
          ...status,
        } as PluginState;
      });

      setPlugins(allPlugins);
    } catch (err) {
      setError('Failed to load plugins');
      console.error('Failed to load plugins:', err);
    }
  };

  const handleTogglePlugin = async (
    pluginName: string,
    currentlyEnabled: boolean
  ) => {
    setLoading((prev) => ({ ...prev, [pluginName]: true }));
    setError(null);

    try {
      if (currentlyEnabled) {
        await pluginManager.disablePlugin(pluginName);
      } else {
        await pluginManager.enablePlugin(pluginName);
      }

      // Update plugins list
      setPlugins(
        plugins.map((p) => {
          if (p.name === pluginName) {
            return {
              ...p,
              enabled: !currentlyEnabled,
              lastEnabled: !currentlyEnabled ? new Date() : p.lastEnabled,
              lastDisabled: currentlyEnabled ? new Date() : p.lastDisabled,
            };
          }

          
return p;
        })
      );
    } catch (err) {
      setError(
        `Failed to ${
          currentlyEnabled ? 'disable' : 'enable'
        } plugin ${pluginName}`
      );
      console.error(`Failed to toggle plugin ${pluginName}:`, err);
    } finally {
      setLoading((prev) => ({ ...prev, [pluginName]: false }));
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plugin Manager</h1>
          <p className="text-gray-600 mt-1">
            Manage and configure your installed plugins
          </p>
        </div>
        <Settings className="h-6 w-6 text-gray-400" />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {plugins.map((plugin) => (
          <div
            key={plugin.name}
            className="border rounded-lg shadow-sm bg-white overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {plugin.name}
                    </h3>
                    <span className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      v{plugin.version}
                    </span>
                  </div>

                  {plugin.description && (
                    <p className="mt-2 text-gray-600">{plugin.description}</p>
                  )}

                  <div className="mt-4 space-y-1 text-sm text-gray-500">
                    {plugin.author && <p>Author: {plugin.author}</p>}
                    {plugin.lastEnabled && (
                      <p>Last enabled: {plugin.lastEnabled.toLocaleString()}</p>
                    )}
                    {plugin.lastDisabled && (
                      <p>
                        Last disabled: {plugin.lastDisabled.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="ml-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={plugin.enabled}
                      disabled={loading[plugin.name]}
                      onChange={() =>
                        handleTogglePlugin(plugin.name, plugin.enabled)
                      }
                    />
                    <div
                      className={`
                      w-11 h-6 rounded-full peer 
                      peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                      dark:peer-focus:ring-blue-800
                      ${plugin.enabled ? 'bg-blue-600' : 'bg-gray-200'}
                      ${loading[plugin.name] ? 'opacity-50' : ''}
                      after:content-[''] 
                      after:absolute 
                      after:top-[2px] 
                      after:left-[2px] 
                      after:bg-white 
                      after:border-gray-300 
                      after:border 
                      after:rounded-full 
                      after:h-5 
                      after:w-5
                      after:transition-all
                      peer-checked:after:translate-x-full
                    `}
                    ></div>
                    <span className="sr-only">
                      {plugin.enabled ? 'Disable' : 'Enable'} {plugin.name}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
