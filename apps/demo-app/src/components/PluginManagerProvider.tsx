'use client';

import { useEffect, useState } from 'react';

import { PluginProvider } from '../lib/plugin-context';
import { pluginManager } from '../lib/plugin-manager';
import { registerPlugins } from '../lib/register-plugins';

export function PluginManagerProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [isPluginsInitialized, setPluginsInitialized] = useState(false);

  useEffect(() => {
    const initPlugins = async () => {
      try {
        await registerPlugins();
        setPluginsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize plugins:', error);
      }
    };

    initPlugins();
  }, []);

  if (!isPluginsInitialized) {
    return null; // Or a loading spinner
  }

  return (
    <PluginProvider pluginManager={pluginManager}>
      {children}
    </PluginProvider>
  );
}
