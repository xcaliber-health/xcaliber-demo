import type { Plugin, PluginRoute } from '../types/plugin';
import { pluginRegistry } from './plugin-registry';
import { pluginEventEmitter } from './plugin-event-emitter';
import type { PluginEventType, PluginEventCallback } from '../types/plugin-events';

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private hooks: Map<string, Array<(...args: any[]) => Promise<any>>> = new Map();
  private components: Map<string, React.ComponentType<any>> = new Map();
  private routes: Map<string, { plugin: string; route: PluginRoute }> = new Map();

  // Event subscription methods
  onPluginEvent<T extends PluginEventType>(event: T, callback: PluginEventCallback<T>) {
    return pluginEventEmitter.on(event, callback);
  }

  async registerPlugin(plugin: Plugin) {
    // Check dependencies
    if (plugin.dependencies) {
      for (const dep of plugin.dependencies) {
        if (!this.plugins.has(dep)) {
          throw new Error(`Plugin ${plugin.name} depends on ${dep} which is not registered`);
        }
      }
    }

    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} is already registered`);
    }

    this.plugins.set(plugin.name, plugin);
    pluginEventEmitter.emit('plugin:registered', { plugin });

    // Only register if enabled
    if (pluginRegistry.isEnabled(plugin.name)) {
      await this.enablePlugin(plugin.name);
    }
  }

  async enablePlugin(pluginName: string) {
    const plugin = this.plugins.get(pluginName);

    if (!plugin) {
      throw new Error(`Plugin ${pluginName} not found`);
    }

    const initialRoutes = Array.from(this.routes.values());

    // Register routes
    if (plugin.routes) {
      plugin.routes.forEach((route) => {
        this.routes.set(route.path, { plugin: pluginName, route });
      });
    }

    // Register hooks
    if (plugin.hooks) {
      Object.entries(plugin.hooks).forEach(([hookName, hookFn]) => {
        if (!this.hooks.has(hookName)) {
          this.hooks.set(hookName, []);
        }
        this.hooks.get(hookName)?.push(hookFn);
      });
    }

    // Register components
    if (plugin.components) {
      Object.entries(plugin.components).forEach(([componentName, component]) => {
        this.components.set(`${plugin.name}:${componentName}`, component);
      });
    }

    // Initialize plugin
    if (plugin.initialize) {
      await plugin.initialize();
    }

    // Update metadata
    pluginRegistry.setMetadata(pluginName, {
      enabled: true,
      lastEnabled: new Date(),
    });

    // Emit events
    const currentRoutes = Array.from(this.routes.values()).map(({ route }) => route);
    if (currentRoutes.length !== initialRoutes.length) {
      pluginEventEmitter.emit('routes:update', { routes: currentRoutes });
    }
    pluginEventEmitter.emit('plugin:enabled', { plugin, routes: currentRoutes });
  }

  async disablePlugin(pluginName: string) {
    const plugin = this.plugins.get(pluginName);

    if (!plugin) {
      throw new Error(`Plugin ${pluginName} not found`);
    }

    const initialRoutes = Array.from(this.routes.values());

    // Remove routes
    let routesChanged = false;

    for (const [path, routeInfo] of this.routes) {
      if (routeInfo.plugin === pluginName) {
        this.routes.delete(path);
        routesChanged = true;
      }
    }

    // Remove hooks
    if (plugin.hooks) {
      Object.keys(plugin.hooks).forEach((hookName) => {
        const hooks = this.hooks.get(hookName) || [];
        this.hooks.set(hookName, hooks.filter((h) => h !== plugin.hooks![hookName]));
      });
    }

    // Remove components
    if (plugin.components) {
      Object.keys(plugin.components).forEach((componentName) => {
        this.components.delete(`${plugin.name}:${componentName}`);
      });
    }

    // Cleanup plugin
    if (plugin.cleanup) {
      await plugin.cleanup();
    }

    // Update metadata
    pluginRegistry.setMetadata(pluginName, {
      enabled: false,
      lastDisabled: new Date(),
    });

    // Emit events
    if (routesChanged) {
      pluginEventEmitter.emit('routes:update', { routes: Array.from(this.routes.values()).map(({ route }) => route) });
    }
    pluginEventEmitter.emit('plugin:disabled', { plugin });
  }

  getComponent(componentId: string) {
    return this.components.get(componentId);
  }

  getPlugin(name: string) {
    return this.plugins.get(name);
  }

  getAllPlugins() {
    return Array.from(this.plugins.values());
  }

  getRoutes() {
    return Array.from(this.routes.values()).map(({ route }) => route);
  }

  getPluginForRoute(path: string) {
    const routeInfo = this.routes.get(path);
    return routeInfo ? this.plugins.get(routeInfo.plugin) : null;
  }

  getSidebarItems() {
    return Array.from(this.routes.values())
      .map(({ route }) => route)
      .filter((route) => route.showInSidebar !== false)
      .sort((a, b) => {
        if (a.group && b.group) {
          if (a.group !== b.group) {
            return a.group.localeCompare(b.group);
          }
        } else if (a.group) {
          return -1;
        } else if (b.group) {
          return 1;
        }

        return a.label.localeCompare(b.label);
      });
  }

  getPluginStatus(name: string) {
    const plugin = this.getPlugin(name);

    if (!plugin) return null;

    return { ...plugin, ...pluginRegistry.getMetadata(name) };
  }

  onRoutesUpdate(callback: () => void) {
    return pluginEventEmitter.on('routes:update', callback);
  }
}

export const pluginManager = new PluginManager();
