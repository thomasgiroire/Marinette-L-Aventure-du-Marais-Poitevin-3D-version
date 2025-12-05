export enum TileType {
  GRASS = 0,
  WATER = 1,
  OBSTACLE = 2, // Trees/Vegetation
  EXIT = 3
}

export enum EntityType {
  PLAYER = 'PLAYER',
  RAGONDIN = 'RAGONDIN', // Coypu - Hides
  MOUSTIQUE = 'MOUSTIQUE', // Mosquito - Flies over walls
  SANGLIER = 'SANGLIER', // Boar - Aggressive
  ANGELIQUE = 'ANGELIQUE', // Healing Plant
  SNAKE = 'SNAKE' // Snake
}

export type CameraMode = 'FPS' | 'TPS';

export interface Position {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  type: EntityType;
  position: Position;
  direction: number; // 0: North (-Y), 1: East (+X), 2: South (+Y), 3: West (-X)
  hp: number;
  isHidden?: boolean; // For Ragondin
  cooldown?: number;
  aggroTurns?: number; // For Sanglier chase duration
}

export interface LevelExit {
  position: Position;
  destinationId: string;
  color: string;
}

export interface GameState {
  currentLocationId: string;
  grid: TileType[][];
  player: Entity;
  enemies: Entity[];
  items: Entity[];
  levelExits: LevelExit[]; // Specific exits with colors
  score: number;
  lives: number; // Max 3
  turn: number;
  status: 'MENU' | 'PLAYING' | 'WON' | 'LOST' | 'TRANSITION';
  winMessage?: string;
  history: string[]; // Trackback penalty
}

// Map Connectivity Graph
export interface LocationNode {
  id: string;
  name: string;
  connections: string[];
  isFinal?: boolean;
  legend?: string;
  theme?: string;
}

export const GRID_SIZE = 21;

// Global Type Definitions for R3F
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      directionalLight: any;
      mesh: any;
      group: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      cylinderGeometry: any;
      dodecahedronGeometry: any;
      sphereGeometry: any;
      octahedronGeometry: any;
      capsuleGeometry: any;
      circleGeometry: any;
      coneGeometry: any;
      torusGeometry: any;
      [elemName: string]: any;
    }
  }
}