import { EntityType, GameState, TileType } from '../types';
import { getRandomInt, isWalkable } from './utils';

// --- AI Logic ---
export const moveEnemies = (gameState: GameState): GameState => {
  const newEnemies = gameState.enemies.map(enemy => {
    // Cooldown management (Ragondin hidden)
    if (enemy.isHidden) {
        if (enemy.cooldown && enemy.cooldown > 0) {
            enemy.cooldown--;
            if (enemy.cooldown <= 0) {
                // Respawn Logic: Find a valid water or bank spot
                // For simplicity, just unhide at current pos if valid, or stay hidden
                // The prompt/CDC implies they disappear for 5 turns then come back.
                // We'll just unhide.
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
        // Aggressive: If dist < 3, chase player.
        if (dist < 3) {
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
        // Random displacement. Can fly over walls if near water (implemented in isWalkable check logic implicitly or simplified)
        // CDC: "Déplacement aléatoire"
        const move = getRandomInt(0, 4);
        if (move === 0) moveX = 1;
        if (move === 1) moveX = -1;
        if (move === 2) moveY = 1;
        if (move === 3) moveY = -1;
    }
    else {
        // --- RAGONDIN (Coypu) ---
        // Habitat: Water / River banks. 
        // Logic: Try to move. If next tile is Water OR adjacent to water (Bank), allow. Else pick another.
        // Simplified: Random move, but check validity specifically.
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
    
    // Common Walkable Check (Bounds & Walls)
    if (isWalkable(gameState.grid, proposedPos, enemy.type === EntityType.MOUSTIQUE)) {
        valid = true;
    }

    // Specific Habitat Constraints
    if (valid && enemy.type === EntityType.RAGONDIN) {
        // Must be Water OR Adjacent to Water
        const tile = gameState.grid[proposedPos.y][proposedPos.x];
        if (tile === TileType.WATER) {
            valid = true;
        } else {
            // Check neighbors for water
            let nearWater = false;
            const neighbors = [{x:0, y:1}, {x:0, y:-1}, {x:1, y:0}, {x:-1, y:0}];
            for(let n of neighbors) {
                const nx = proposedPos.x + n.x;
                const ny = proposedPos.y + n.y;
                if (nx >= 0 && ny >= 0 && nx < gameState.grid[0].length && ny < gameState.grid.length) {
                    if (gameState.grid[ny][nx] === TileType.WATER) {
                        nearWater = true; 
                        break;
                    }
                }
            }
            valid = nearWater;
        }
    }

    if (valid) {
       return { ...enemy, position: proposedPos, direction: nextDir };
    }
    return enemy;
  });

  return { ...gameState, enemies: newEnemies };
};