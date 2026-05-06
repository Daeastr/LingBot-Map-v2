import { Vector3, Euler } from 'three';

export enum NavPhase {
  FOUNDATION = 0,
  ARCHITECTURE = 1,
  SOL_TRAINING = 2,
  EDGE_RUNTIME = 3,
  SECURITY_COHERENCE = 4,
  AR_VR_DEPLOY = 5,
  ROBOTICS_SAFETY = 6,
  MULTI_AGENT = 7,
  GOVERNANCE = 8,
  EVOLUTION = 9
}

export interface MapTile {
  id: string;
  position: Vector3;
  version: number;
  confidence: number;
  semanticClass: 'structural' | 'dynamic' | 'hazard' | 'unknown';
  lastUpdated: number;
}

export interface DriftVector {
  translation: Vector3;
  rotation: Euler;
  uncertainty: number;
}

export interface Telemetry {
  latency: number;
  dt: number;
  driftRmse: number;
  thermalPressure: number;
  memoryUsage: number;
  computeBudget: number;
}

export interface SystemState {
  isActive: boolean;
  phase: NavPhase;
  telemetry: Telemetry;
  tiles: MapTile[];
  currentDrift: DriftVector;
  watchdogStatus: 'nominal' | 'warning' | 'critical' | 'fallback';
  activeSensors: string[];
  isAuthenticated: boolean;
  searchQuery: string;
  notifications: AppNotification[];
}

export interface AppNotification {
  id: string;
  type: 'success' | 'warning' | 'error';
  message: string;
}
