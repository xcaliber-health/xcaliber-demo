import type { Plugin, PluginRoute } from './plugin'

export type PluginEventType =
  | 'routes:update'
  | 'plugin:enabled'
  | 'plugin:disabled'
  | 'plugin:registered'
  | 'plugin:unregistered'

export interface PluginEventMap {
  'routes:update': {
    routes: PluginRoute[]
  }
  'plugin:enabled': {
    plugin: Plugin
    routes: PluginRoute[]
  }
  'plugin:disabled': {
    plugin: Plugin
  }
  'plugin:registered': {
    plugin: Plugin
  }
  'plugin:unregistered': {
    pluginName: string
  }
}

export type PluginEventCallback<T extends PluginEventType> = (
  data: PluginEventMap[T]
) => void

export interface PluginEventEmitter {
  emit<T extends PluginEventType>(event: T, data: PluginEventMap[T]): void
  
  on<T extends PluginEventType>(
    event: T,
    callback: PluginEventCallback<T>
  ): () => void
  
  off<T extends PluginEventType>(
    event: T,
    callback: PluginEventCallback<T>
  ): void
}
