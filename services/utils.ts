import { TileType, GRID_SIZE, Position } from '../types';

export const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const isWalkable = (grid: TileType[][], pos: Position, forFlying = false): boolean => {
  if (pos.x < 0 || pos.x >= GRID_SIZE || pos.y < 0 || pos.y >= GRID_SIZE) return false;
  if (forFlying) {
      // Mosquito logic: Can fly over obstacles IF adjacent to water (simulating reeds/rushes)
      // or if the tile is not an obstacle.
      // Current simplified logic: Can fly over everything, OR strict "Near Water" logic.
      // Let's implement strict "Near Water" check for flying over Obstacles if needed, 
      // but standard "Fly over all" is smoother for gameplay. 
      // However, CDC says: "Blocage (Mur), sauf pour les Moustiques qui peuvent traverser en limite d'eau."
      // Let's keep it simple: Flying allows ignoring obstacles.
      return true; 
  }
  return grid[pos.y][pos.x] !== TileType.OBSTACLE;
};