import { TileType, GRID_SIZE, EntityType, Entity, Position, LevelExit } from '../types';
import { WORLD_MAP, EXIT_COLORS } from '../constants';
import { getRandomInt, isWalkable, isNearWater } from './utils';
import { v4 as uuidv4 } from 'uuid';

// --- Maze Generator (Recursive Backtracker) ---
const carveMaze = (grid: TileType[][]) => {
  const stack: Position[] = [];
  const start: Position = { x: 1, y: 1 };
  grid[start.y][start.x] = TileType.GRASS;
  stack.push(start);

  const directions = [
    { x: 0, y: -2 }, // N
    { x: 2, y: 0 },  // E
    { x: 0, y: 2 },  // S
    { x: -2, y: 0 }  // W
  ];

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    // Shuffle directions
    const shuffledDirs = directions.sort(() => Math.random() - 0.5);
    let carved = false;

    for (const dir of shuffledDirs) {
      const next: Position = { x: current.x + dir.x, y: current.y + dir.y };
      const wall: Position = { x: current.x + dir.x / 2, y: current.y + dir.y / 2 };

      if (
        next.x > 0 && next.x < GRID_SIZE - 1 &&
        next.y > 0 && next.y < GRID_SIZE - 1 &&
        grid[next.y][next.x] === TileType.OBSTACLE
      ) {
        grid[wall.y][wall.x] = TileType.GRASS;
        grid[next.y][next.x] = TileType.GRASS;
        stack.push(next);
        carved = true;
        break;
      }
    }

    if (!carved) {
      stack.pop();
    }
  }
};

// --- Level Generator ---
export const generateLevel = (nodeId: string): { grid: TileType[][], playerStart: Position, enemies: Entity[], items: Entity[], levelExits: LevelExit[] } => {
  // 1. Initialize full walls
  const grid: TileType[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(TileType.OBSTACLE));
  
  // 2. Carve Maze
  carveMaze(grid);

  // 3. Create Loops (Remove some random walls to make it Pac-Man like, not a perfect maze)
  for (let y = 1; y < GRID_SIZE - 1; y++) {
    for (let x = 1; x < GRID_SIZE - 1; x++) {
      if (grid[y][x] === TileType.OBSTACLE) {
        // If it separates two grass tiles, maybe remove it
        const hasHorizontal = grid[y][x-1] !== TileType.OBSTACLE && grid[y][x+1] !== TileType.OBSTACLE;
        const hasVertical = grid[y-1][x] !== TileType.OBSTACLE && grid[y+1][x] !== TileType.OBSTACLE;
        
        if ((hasHorizontal || hasVertical) && Math.random() < 0.15) {
          grid[y][x] = TileType.GRASS;
        }
      }
    }
  }

  // 4. Create Water Channels (Pac-Man ghost zones style or just hazards)
  const numRivers = getRandomInt(1, 3);
  for (let i = 0; i < numRivers; i++) {
    const isHoriz = Math.random() > 0.5;
    const line = getRandomInt(2, GRID_SIZE - 3);
    for (let k = 1; k < GRID_SIZE - 1; k++) {
      if (grid[isHoriz ? line : k][isHoriz ? k : line] !== TileType.OBSTACLE) {
        grid[isHoriz ? line : k][isHoriz ? k : line] = TileType.WATER;
      }
    }
  }

  // 5. Clear Center (Player Start Zone)
  const center = Math.floor(GRID_SIZE / 2);
  for(let y = center - 1; y <= center + 1; y++) {
    for(let x = center - 1; x <= center + 1; x++) {
      grid[y][x] = TileType.GRASS;
    }
  }
  const playerStart = { x: center, y: center };

  // 6. Setup Exits
  const currentNode = WORLD_MAP[nodeId];
  const connections = currentNode.connections;
  const levelExits: LevelExit[] = [];
  
  // Possible exit locations (Sides)
  const exitSides = [
    { x: Math.floor(GRID_SIZE/2), y: 0 },          // Top
    { x: GRID_SIZE-1, y: Math.floor(GRID_SIZE/2) }, // Right
    { x: Math.floor(GRID_SIZE/2), y: GRID_SIZE-1 }, // Bottom
    { x: 0, y: Math.floor(GRID_SIZE/2) }            // Left
  ];

  connections.forEach((connId, index) => {
    if (index >= exitSides.length) return; // Should not happen with current data

    const exitPos = exitSides[index];
    const color = EXIT_COLORS[index % EXIT_COLORS.length];
    
    // Mark on grid
    grid[exitPos.y][exitPos.x] = TileType.EXIT;
    
    // Ensure path to exit (clear 2 tiles inward)
    if (exitPos.x === 0) { grid[exitPos.y][1] = TileType.GRASS; grid[exitPos.y][2] = TileType.GRASS; }
    if (exitPos.x === GRID_SIZE-1) { grid[exitPos.y][GRID_SIZE-2] = TileType.GRASS; grid[exitPos.y][GRID_SIZE-3] = TileType.GRASS; }
    if (exitPos.y === 0) { grid[1][exitPos.x] = TileType.GRASS; grid[2][exitPos.x] = TileType.GRASS; }
    if (exitPos.y === GRID_SIZE-1) { grid[GRID_SIZE-2][exitPos.x] = TileType.GRASS; grid[GRID_SIZE-3][exitPos.x] = TileType.GRASS; }

    levelExits.push({
      position: exitPos,
      destinationId: connId,
      color: color
    });
  });

  // 7. Place Enemies
  const enemies: Entity[] = [];
  const numEnemies = getRandomInt(3, 5);
  for (let i = 0; i < numEnemies; i++) {
    const rand = Math.random();
    let type = EntityType.RAGONDIN;
    if (rand > 0.5) type = EntityType.MOUSTIQUE;
    if (rand > 0.75) type = EntityType.SANGLIER;
    if (rand > 0.9) type = EntityType.SNAKE;

    // Find valid spot based on Habitat
    let pos = { x: getRandomInt(1, GRID_SIZE - 2), y: getRandomInt(1, GRID_SIZE - 2) };
    let validSpot = false;
    let attempts = 0;

    while (!validSpot && attempts < 100) {
        attempts++;
        pos = { x: getRandomInt(1, GRID_SIZE - 2), y: getRandomInt(1, GRID_SIZE - 2) };
        
        // Basic check: don't spawn on player
        if (Math.abs(pos.x - playerStart.x) < 5 && Math.abs(pos.y - playerStart.y) < 5) continue;

        if (type === EntityType.RAGONDIN) {
            // Must be WATER
            if (grid[pos.y][pos.x] === TileType.WATER) validSpot = true;
        } else if (type === EntityType.MOUSTIQUE) {
            // Must be NEAR WATER
            if (isNearWater(grid, pos)) validSpot = true;
        } else if (type === EntityType.SNAKE) {
            // Can be anywhere walkable (including obstacles for snake)
            if (isWalkable(grid, pos, EntityType.SNAKE)) validSpot = true;
        } else {
            // Sanglier: Land only
            if (isWalkable(grid, pos, EntityType.SANGLIER) && grid[pos.y][pos.x] !== TileType.WATER) validSpot = true;
        }
    }

    if (validSpot) {
        enemies.push({
            id: uuidv4(),
            type,
            position: pos,
            direction: getRandomInt(0, 3),
            hp: 1,
            isHidden: type === EntityType.RAGONDIN && Math.random() > 0.7
        });
    }
  }

  // 8. Place Items
  const items: Entity[] = [];
  if (Math.random() > 0.4) {
    let pos = { x: getRandomInt(1, GRID_SIZE - 2), y: getRandomInt(1, GRID_SIZE - 2) };
    while (grid[pos.y][pos.x] !== TileType.GRASS) {
      pos = { x: getRandomInt(1, GRID_SIZE - 2), y: getRandomInt(1, GRID_SIZE - 2) };
    }
    items.push({
      id: uuidv4(),
      type: EntityType.ANGELIQUE,
      position: pos,
      direction: 0,
      hp: 0
    });
  }

  return { grid, playerStart, enemies, items, levelExits };
};