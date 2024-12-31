export interface PluginRoute {
  path: string;
  component: React.ComponentType<any>;
  icon?: React.ComponentType<any>;
  label: string;
  showInSidebar?: boolean;
  group?: string;
}

export interface Plugin {
  name: string;
  version: string;
  description?: string;
  author?: string;
  dependencies?: string[];
  initialize?: () => Promise<void>;
  cleanup?: () => Promise<void>;
  hooks?: {
    [key: string]: (...args: any[]) => Promise<any>;
  };
  components?: {
    [key: string]: React.ComponentType<any>;
  };
  routes?: PluginRoute[];
}

export type PluginEventType = string;

export type PluginEventCallback<T extends PluginEventType> = (eventData: any) => void | Promise<void>;

export interface PluginMetadata {
  enabled: boolean;
  lastEnabled?: Date;
  lastDisabled?: Date;
}
