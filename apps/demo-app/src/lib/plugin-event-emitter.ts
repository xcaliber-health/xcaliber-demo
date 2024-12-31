import type {
  PluginEventType,
  PluginEventCallback,
  PluginEventMap,
  PluginEventEmitter,
} from '../types/plugin-events'

class PluginEventEmitterImpl implements PluginEventEmitter {
  private listeners: Map<PluginEventType, Set<PluginEventCallback<any>>> = new Map()

  emit<T extends PluginEventType>(event: T, data: PluginEventMap[T]): void {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach((callback) => callback(data))
    }
  }

  on<T extends PluginEventType>(
    event: T,
    callback: PluginEventCallback<T>
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }

    this.listeners.get(event)!.add(callback)

    return () => this.off(event, callback)
  }

  off<T extends PluginEventType>(event: T, callback: PluginEventCallback<T>): void {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.delete(callback)
      if (callbacks.size === 0) {
        this.listeners.delete(event)
      }
    }
  }
}

export const pluginEventEmitter = new PluginEventEmitterImpl()
