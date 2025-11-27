import { TileType, GRID_SIZE, Position, EntityType } from '../types';

export const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const isWalkable = (grid: TileType[][], pos: Position, type?: EntityType): boolean => {
  // Bounds check
  if (pos.x < 0 || pos.x >= GRID_SIZE || pos.y < 0 || pos.y >= GRID_SIZE) return false;

  // Specific Entity Traversability Rules
  if (type === EntityType.MOUSTIQUE) {
      // Mosquitos fly over everything
      return true; 
  }
  
  if (type === EntityType.SNAKE) {
      // Snakes can move through obstacles (Trees)
      return true; 
  }

  // Default (Player, Boar, etc.) cannot walk on Obstacles
  return grid[pos.y][pos.x] !== TileType.OBSTACLE;
};

export const isNearWater = (grid: TileType[][], pos: Position): boolean => {
    if (grid[pos.y][pos.x] === TileType.WATER) return true;
    
    const directions = [{x:0, y:1}, {x:0, y:-1}, {x:1, y:0}, {x:-1, y:0}];
    for(const dir of directions) {
        const nx = pos.x + dir.x;
        const ny = pos.y + dir.y;
        if (nx >= 0 && ny >= 0 && nx < GRID_SIZE && ny < GRID_SIZE) {
            if (grid[ny][nx] === TileType.WATER) return true;
        }
    }
    return false;
};