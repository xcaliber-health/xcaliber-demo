import type { PluginMetadata } from '../types/plugin';

class PluginRegistry {
  private storage: Storage | null = null;
  private metadata: Map<string, PluginMetadata> = new Map();
  private STORAGE_KEY = 'plugin-registry';

  constructor() {
    if (typeof window !== 'undefined') {
      this.storage = window.localStorage;
      this.loadMetadata();
    }
  }

  private loadMetadata() {
    if (!this.storage) return;

    try {
      const saved = this.storage.getItem(this.STORAGE_KEY);

      if (saved) {
        const data = JSON.parse(saved);

        Object.entries(data).forEach(([name, meta]) => {
          this.metadata.set(name, meta as PluginMetadata);
        });
      }
    } catch (error) {
      console.error('Failed to load plugin metadata:', error);
    }
  }

  private saveMetadata() {
    if (!this.storage) return;

    const data = Object.fromEntries(this.metadata.entries());

    this.storage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  getMetadata(pluginName: string): PluginMetadata {
    return (
      this.metadata.get(pluginName) || { enabled: true } // Default to enabled if no metadata exists
    );
  }

  setMetadata(pluginName: string, metadata: Partial<PluginMetadata>) {
    const current = this.getMetadata(pluginName);

    this.metadata.set(pluginName, { ...current, ...metadata });
    this.saveMetadata();
  }

  isEnabled(pluginName: string): boolean {
    return this.getMetadata(pluginName).enabled;
  }
}

export const pluginRegistry = new PluginRegistry();
