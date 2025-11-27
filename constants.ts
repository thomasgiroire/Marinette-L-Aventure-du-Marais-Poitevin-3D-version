import { LocationNode, EntityType } from './types';

export const COLORS = {
  GRASS: '#86efac', // Vert Tendre
  WATER: '#06b6d4', // Bleu Cyan
  OBSTACLE: '#166534', // Dark Green trees
  EXIT: '#fbbf24', // Default Exit (Fallback)
  PLAYER: '#4ade80', // Marinette
  TONGUE: '#db2777', // Rose Vif
  SKY: '#bae6fd',
  UI_BG: '#fef3c7', // Parchment
};

export const EXIT_COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#f97316', // Orange
];

// Section 4.2 & 4.3 Data
export const WORLD_MAP: Record<string, LocationNode> = {
  'coulon': { id: 'coulon', name: 'Coulon', connections: ['vanneau', 'sansais', 'benet'] },
  'vanneau': { id: 'vanneau', name: 'Le Vanneau-Irleau', connections: ['arcais', 'damvix', 'st-hilaire'] },
  'sansais': { id: 'sansais', name: 'Sansais', connections: ['coulon', 'st-georges', 'amure'] },
  'benet': { id: 'benet', name: 'Benet', connections: ['coulon', 'maillezais', 'gue-velluire'] },
  'arcais': { id: 'arcais', name: 'Arçais', connections: ['vanneau', 'st-hilaire', 'mazeau'] },
  'damvix': { id: 'damvix', name: 'Damvix', connections: ['vanneau', 'maillezais', 'vix'] },
  'st-hilaire': { id: 'st-hilaire', name: 'St-Hilaire-la-Palud', connections: ['arcais', 'greve', 'courcon'] },
  'st-georges': { id: 'st-georges', name: 'St-Georges-de-Rex', connections: ['sansais', 'amure', 'mazeau'] },
  'amure': { id: 'amure', name: 'Amuré', connections: ['sansais', 'st-georges'] }, // Simplified
  'mazeau': { id: 'mazeau', name: 'Le Mazeau', connections: ['arcais', 'st-georges', 'vix'] },
  'maillezais': { id: 'maillezais', name: 'Maillezais', connections: ['benet', 'damvix'] }, // Simplified
  'gue-velluire': { id: 'gue-velluire', name: 'Le Gué-de-Velluire', connections: ['benet'] }, // Simplified
  'vix': { id: 'vix', name: 'Vix', connections: ['damvix', 'mazeau', 'ile-delle'] },
  'greve': { id: 'greve', name: 'La Grève-sur-Mignon', connections: ['st-hilaire', 'courcon'] },
  'courcon': { id: 'courcon', name: 'Courçon', connections: ['st-hilaire', 'greve', 'ferrieres'] },
  'ferrieres': { id: 'ferrieres', name: 'Ferrières', connections: ['courcon'] },
  'ile-delle': { id: 'ile-delle', name: "L'Île-d'Elle", connections: ['vix', 'marans'] },
  'marans': { id: 'marans', name: 'Marans', connections: ['ile-delle', 'charron'] },
  
  // Final Destinations
  'tranche': { 
    id: 'tranche', 
    name: 'La Tranche-sur-Mer', 
    connections: [], 
    isFinal: true,
    legend: "L'Esprit des Estuaires",
    theme: "Je veille sur la rencontre des eaux. Le marais filtre les pollutions et protège l'océan, garantissant un refuge vital pour la biodiversité."
  },
  'esnandes': { 
    id: 'esnandes', 
    name: 'Esnandes', 
    connections: [], 
    isFinal: true,
    legend: "L'Assemblée des Huîtres",
    theme: "Nous sommes les sentinelles de l'eau. Grâce au marais qui retient les sédiments, le littoral reste pur et nos coquilles prospèrent."
  },
  'charron': { 
    id: 'charron', 
    name: 'Charron', 
    connections: ['marans', 'esnandes'], 
    isFinal: true,
    legend: "La Fée Mélusine",
    theme: "Je garde la mémoire des canaux. Ce labyrinthe hydraulique régule les inondations et préserve l'eau douce essentielle à toute vie."
  },
  
  // Connectors to finals (Simplified graph for playability to ensure reachability)
  'st-michel': { id: 'st-michel', name: "St-Michel-en-l'Herm", connections: ['tranche'] },
};

// Helper to get reachable nodes for game generation
export const STARTING_NODE = 'coulon';

export const ENEMY_STATS = {
  [EntityType.RAGONDIN]: { hp: 1, points: 20 },
  [EntityType.MOUSTIQUE]: { hp: 1, points: 15 },
  [EntityType.SANGLIER]: { hp: 1, points: 30 },
  [EntityType.SNAKE]: { hp: 1, points: 25 },
};