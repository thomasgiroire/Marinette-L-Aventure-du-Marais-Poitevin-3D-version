import { EntityType, GameState, TileType } from '../types';
import { getRandomInt, isWalkable, isNearWater } from './utils';

// --- AI Logic ---
export const moveEnemies = (gameState: GameState): GameState => {
  const newEnemies = gameState.enemies.map(enemy => {
    // Cooldown management (Ragondin hidden)
    if (enemy.isHidden) {
        if (enemy.cooldown && enemy.cooldown > 0) {
            enemy.cooldown--;
            if (enemy.cooldown <= 0) {
                return { ...enemy, isHidden: false, cooldown: 0 };
            }
            return enemy;
        }
    }

    // Standard AI Move
    let nextPos = { ...enemy.position };
    let nextDir = enemy.direction;
    const pPos = gameState.player.position;
    
    // Manhattan distance
    const dist = Math.abs(pPos.x - enemy.position.x) + Math.abs(pPos.y - enemy.position.y);

    let moveX = 0;
    let moveY = 0;

    // AI BEHAVIOR DEFINITIONS
    if (enemy.type === EntityType.SANGLIER) {
        // --- SANGLIER (Boar) ---
        // Passive: Random patrol on Land
        // Aggressive: If dist < 5 (UPDATED), chase player.
        if (dist < 5) {
             // Aggressive Chase
             if (pPos.x > enemy.position.x) moveX = 1;
             else if (pPos.x < enemy.position.x) moveX = -1;
             else if (pPos.y > enemy.position.y) moveY = 1;
             else if (pPos.y < enemy.position.y) moveY = -1;
        } else {
             // Passive Random
             const move = getRandomInt(0, 4);
             if (move === 0) moveX = 1;
             else if (move === 1) moveX = -1;
             else if (move === 2) moveY = 1;
             else if (move === 3) moveY = -1;
        }
    } 
    else if (enemy.type === EntityType.MOUSTIQUE) {
        // --- MOUSTIQUE (Mosquito) ---
        // Random displacement but strictly restricted to WATER or NEAR WATER later in validation
        const move = getRandomInt(0, 4);
        if (move === 0) moveX = 1;
        if (move === 1) moveX = -1;
        if (move === 2) moveY = 1;
        if (move === 3) moveY = -1;
    }
    else if (enemy.type === EntityType.SNAKE) {
        // --- SNAKE ---
        // "Live on a line": Keep current direction. If blocked, reverse.
        // Direction mapping: 0:N (-Y), 1:E (+X), 2:S (+Y), 3:W (-X)
        if (enemy.direction === 0) moveY = -1;
        else if (enemy.direction === 1) moveX = 1;
        else if (enemy.direction === 2) moveY = 1;
        else if (enemy.direction === 3) moveX = -1;
    }
    else {
        // --- RAGONDIN (Coypu) ---
        // Random move, but strictly restricted to WATER later in validation
        const move = getRandomInt(0, 4);
        if (move === 0) moveX = 1;
        else if (move === 1) moveX = -1;
        else if (move === 2) moveY = 1;
        else if (move === 3) moveY = -1;
    }

    // Determine Direction (Visual)
    if (moveX === 1) nextDir = 1; // East
    if (moveX === -1) nextDir = 3; // West
    if (moveY === 1) nextDir = 2; // South
    if (moveY === -1) nextDir = 0; // North

    const proposedPos = { x: nextPos.x + moveX, y: nextPos.y + moveY };

    // Validity Check
    let valid = false;
    
    // 1. Physical Walkability
    if (isWalkable(gameState.grid, proposedPos, enemy.type)) {
        valid = true;
    }

    // 2. Habitat Constraints
    if (valid) {
        if (enemy.type === EntityType.RAGONDIN) {
            // Strictly WATER only
            if (gameState.grid[proposedPos.y][proposedPos.x] !== TileType.WATER) {
                valid = false;
            }
        } 
        else if (enemy.type === EntityType.MOUSTIQUE) {
            // WATER or adjacent to WATER
            if (!isNearWater(gameState.grid, proposedPos)) {
                valid = false;
            }
        }
    }

    if (valid) {
       return { ...enemy, position: proposedPos, direction: nextDir };
    } else {
        // If Snake is blocked, reverse direction
        if (enemy.type === EntityType.SNAKE) {
            const reverseDir = (enemy.direction + 2) % 4;
            return { ...enemy, direction: reverseDir };
        }
    }
    
    return enemy;
  });

  return { ...gameState, enemies: newEnemies };
};