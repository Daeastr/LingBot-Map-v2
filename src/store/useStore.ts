import { create } from 'zustand';
import { Vector3, Euler } from 'three';
import { SystemState, NavPhase, MapTile, DriftVector, Telemetry, AppNotification } from '../types';

interface Store extends SystemState {
  setPhase: (phase: NavPhase) => void;
  updateTelemetry: (telemetry: Partial<Telemetry>) => void;
  addTile: (tile: MapTile) => void;
  updateDrift: (drift: DriftVector) => void;
  setWatchdogStatus: (status: SystemState['watchdogStatus']) => void;
  toggleActive: () => void;
  authenticate: (status: boolean) => void;
  setSearchQuery: (query: string) => void;
  addNotification: (notification: Omit<AppNotification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

export const useStore = create<Store>((set) => ({
  isActive: false, // Default to false for auth gate
  phase: NavPhase.FOUNDATION,
  telemetry: {
    latency: 4.2,
    dt: 0.016,
    driftRmse: 0.012,
    thermalPressure: 0.32,
    memoryUsage: 256,
    computeBudget: 0.85,
  },
  tiles: [],
  currentDrift: {
    translation: new Vector3(0, 0, 0),
    rotation: new Euler(0, 0, 0),
    uncertainty: 0.001,
  },
  watchdogStatus: 'nominal',
  activeSensors: ['RGB', 'Depth', 'IMU'],
  isAuthenticated: false,
  searchQuery: '',
  notifications: [],

  addNotification: (notification) => set((state) => {
    // Priority check (UX-CONFIG 27: Ignore duplicates)
    if (state.notifications.some(n => n.message === notification.message)) return state;

    const id = Math.random().toString(36).substring(7);
    const newNotif: AppNotification = { ...notification, id } as AppNotification;
    
    const notifications = [...state.notifications, newNotif]
      .sort((a, b) => {
        const priority: Record<string, number> = { error: 0, warning: 1, success: 2 };
        return priority[a.type] - priority[b.type];
      })
      .slice(0, 3); // UX-CONFIG 24: Max visible 3

    return { notifications };
  }),

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),

  setPhase: (phase) => set({ phase }),
  updateTelemetry: (telemetry) => 
    set((state) => ({ telemetry: { ...state.telemetry, ...telemetry } })),
  addTile: (tile) => set((state) => ({ tiles: [...state.tiles, tile] })),
  updateDrift: (drift) => set({ currentDrift: drift }),
  setWatchdogStatus: (status) => set({ watchdogStatus: status }),
  toggleActive: () => set((state) => ({ isActive: !state.isActive })),
  authenticate: (status) => set({ isAuthenticated: status, isActive: status }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
