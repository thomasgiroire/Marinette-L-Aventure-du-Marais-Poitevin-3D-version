import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, EntityType, TileType, GRID_SIZE, CameraMode } from './types';
import { WORLD_MAP, STARTING_NODE, ENEMY_STATS } from './constants';
import { generateLevel, moveEnemies } from './services/gameLogic';
import GameScene from './components/GameScene';
import UIOverlay from './components/UIOverlay';

// Simple Swipe Detection Hook
const useSwipe = (onSwipe: (dir: string) => void, onTap: () => void) => {
  const touchStart = useRef<{x: number, y: number} | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;
      const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
      
      const diffX = touchEnd.x - touchStart.current.x;
      const diffY = touchEnd.y - touchStart.current.y;
      
      if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
        onTap();
      } else if (Math.abs(diffX) > Math.abs(diffY)) {
        onSwipe(diffX > 0 ? 'RIGHT' : 'LEFT');
      } else {
        onSwipe(diffY > 0 ? 'DOWN' : 'UP');
      }
      touchStart.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipe, onTap]);
};

function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const { grid, playerStart, enemies, items, levelExits } = generateLevel(STARTING_NODE);
    return {
      currentLocationId: STARTING_NODE,
      grid,
      player: { id: 'player', type: EntityType.PLAYER, position: playerStart, direction: 2, hp: 3 }, // Start facing South
      enemies,
      items,
      levelExits,
      score: 0,
      lives: 3,
      turn: 0,
      status: 'PLAYING',
      history: [STARTING_NODE]
    };
  });

  const [attackTrigger, setAttackTrigger] = useState<number>(0);
  const [isFacingCamera, setIsFacingCamera] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<CameraMode>('FPS');

  // Sound effects mock
  const playSound = (type: 'move' | 'attack' | 'hit' | 'win') => {
    // console.log(`Playing Sound: ${type}`); 
  };

  // Define loadLevel first so it can be used in handleAction
  const loadLevel = useCallback((nodeId: string) => {
    const node = WORLD_MAP[nodeId];
    
    if (node.isFinal) {
        setGameState(prev => ({
            ...prev,
            status: 'WON',
            score: prev.score + 500,
            currentLocationId: nodeId
        }));
        return;
    }

    const { grid, playerStart, enemies, items, levelExits } = generateLevel(nodeId);
    
    setGameState(prev => {
        const isTrackback = prev.history.includes(nodeId);
        const newScore = isTrackback ? Math.max(0, prev.score - 50) : prev.score + 100;
        
        return {
            ...prev,
            currentLocationId: nodeId,
            grid,
            player: { ...prev.player, position: playerStart, direction: 2 }, // Reset direction
            enemies,
            items,
            levelExits,
            score: newScore,
            status: 'PLAYING',
            history: [...prev.history, nodeId]
        };
    });
  }, []);

  const handleAction = useCallback((action: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'ATTACK') => {
    if (gameState.status !== 'PLAYING') return;

    setGameState(prev => {
      let nextState = { ...prev };
      let playerMoved = false;

      // Update orientation state based on key press (only relevant for TPS visuals)
      if (action === 'DOWN') {
          setIsFacingCamera(true);
      } else if (['UP', 'LEFT', 'RIGHT', 'ATTACK'].includes(action)) {
          setIsFacingCamera(false);
      }

      // --- TANK CONTROLS ---
      // UP = Forward, DOWN = Backward, LEFT/RIGHT = Rotate Camera
      
      if (action === 'LEFT') {
        nextState.player.direction = (prev.player.direction + 3) % 4; // Rotate Counter-Clockwise
        return nextState;
      }
      
      if (action === 'RIGHT') {
        nextState.player.direction = (prev.player.direction + 1) % 4; // Rotate Clockwise
        return nextState;
      }

      if (action === 'ATTACK') {
        playSound('attack');
        setAttackTrigger(Date.now()); // Trigger visual animation
        
        // Tongue Logic: Attack in front of player
        let tx = prev.player.position.x;
        let ty = prev.player.position.y;
        
        // Range 2
        for(let i=0; i<2; i++) {
            // Direction 0: North (-Y)
            // Direction 1: East (+X)
            // Direction 2: South (+Y)
            // Direction 3: West (-X)
            if (prev.player.direction === 0) ty -= 1;
            if (prev.player.direction === 1) tx += 1;
            if (prev.player.direction === 2) ty += 1;
            if (prev.player.direction === 3) tx -= 1;
            
            // Hit check
            const target = nextState.enemies.find(e => e.position.x === tx && e.position.y === ty);
            if (target) {
                 if (target.type === EntityType.SANGLIER) {
                    // Push back
                    let px = 0, py = 0;
                    if (prev.player.direction === 0) py = -5;
                    if (prev.player.direction === 1) px = 5;
                    if (prev.player.direction === 2) py = 5;
                    if (prev.player.direction === 3) px = -5;
                    
                    target.position.x = Math.max(0, Math.min(GRID_SIZE-1, target.position.x + px));
                    target.position.y = Math.max(0, Math.min(GRID_SIZE-1, target.position.y + py));
                 } else {
                     target.hp = 0;
                 }

                 if (target.hp <= 0) {
                     nextState.enemies = nextState.enemies.filter(e => e.id !== target.id);
                     nextState.score += ENEMY_STATS[target.type].points;
                 }
                 break; // Hit one enemy
            }
        }
        playerMoved = true;
      } 
      else if (action === 'UP' || action === 'DOWN') {
        // Movement Logic
        let dx = 0, dy = 0;
        
        // Determine vector based on direction
        const isForward = action === 'UP';
        const mult = isForward ? 1 : -1;

        if (prev.player.direction === 0) dy = -1 * mult;
        if (prev.player.direction === 1) dx = 1 * mult;
        if (prev.player.direction === 2) dy = 1 * mult;
        if (prev.player.direction === 3) dx = -1 * mult;

        const currentTile = prev.grid[prev.player.position.y][prev.player.position.x];
        let steps = 1;
        // Water acceleration (Only on forward)
        if (currentTile === TileType.WATER && isForward) steps = 2;

        let newX = prev.player.position.x;
        let newY = prev.player.position.y;

        for(let i=0; i<steps; i++) {
            const testX = newX + dx;
            const testY = newY + dy;
            
            // Boundary Check
            if (testX < 0 || testX >= GRID_SIZE || testY < 0 || testY >= GRID_SIZE) break;
            
            // Wall Check
            if (prev.grid[testY][testX] === TileType.OBSTACLE) break;

            newX = testX;
            newY = testY;
        }

        if (newX !== prev.player.position.x || newY !== prev.player.position.y) {
          nextState.player.position = { x: newX, y: newY };
          playSound('move');
          playerMoved = true;
          
          // Check Exit Logic
          if (prev.grid[newY][newX] === TileType.EXIT) {
              const exitInfo = prev.levelExits.find(e => e.position.x === newX && e.position.y === newY);
              if (exitInfo) {
                   // Logic handled by effect
              }
          }

          // Check Item Pickup
          const itemIndex = nextState.items.findIndex(i => i.position.x === newX && i.position.y === newY);
          if (itemIndex > -1) {
             const item = nextState.items[itemIndex];
             if (item.type === EntityType.ANGELIQUE) {
                 nextState.lives = Math.min(3, nextState.lives + 1);
                 nextState.items.splice(itemIndex, 1);
                 playSound('win');
             }
          }
        }
      }

      if (playerMoved) {
        nextState = moveEnemies(nextState);
        nextState.turn += 1;

        const hitEnemy = nextState.enemies.find(e => e.position.x === nextState.player.position.x && e.position.y === nextState.player.position.y);
        if (hitEnemy) {
            playSound('hit');
            nextState.lives -= 1;
            nextState.enemies = nextState.enemies.filter(e => e.id !== hitEnemy.id);
            if (nextState.lives <= 0) nextState.status = 'LOST';
        }
      }

      return nextState;
    });
  }, [gameState.status, loadLevel]);

  // Effect to handle instant level loading when stepping on an exit
  useEffect(() => {
      if (gameState.status === 'PLAYING') {
          const { x, y } = gameState.player.position;
          if (gameState.grid[y][x] === TileType.EXIT) {
              const exit = gameState.levelExits.find(e => e.position.x === x && e.position.y === y);
              if (exit) {
                  // Short delay for visual feedback
                  setTimeout(() => {
                      loadLevel(exit.destinationId);
                  }, 200);
              }
          }
      }
  }, [gameState.player.position, gameState.grid, gameState.status, gameState.levelExits, loadLevel]);

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') handleAction('UP');
      if (e.key === 'ArrowDown') handleAction('DOWN');
      if (e.key === 'ArrowLeft') handleAction('LEFT');
      if (e.key === 'ArrowRight') handleAction('RIGHT');
      if (e.key === ' ') handleAction('ATTACK');
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleAction]);

  // Touch Controls
  useSwipe(
    (dir) => handleAction(dir as any),
    () => handleAction('ATTACK')
  );

  const restartGame = () => {
      const { grid, playerStart, enemies, items, levelExits } = generateLevel(STARTING_NODE);
      setGameState({
          currentLocationId: STARTING_NODE,
          grid,
          player: { id: 'player', type: EntityType.PLAYER, position: playerStart, direction: 2, hp: 3 },
          enemies,
          items,
          levelExits,
          score: 0,
          lives: 3,
          turn: 0,
          status: 'PLAYING',
          history: [STARTING_NODE]
      });
  };

  const toggleCameraMode = () => {
      setCameraMode(prev => prev === 'FPS' ? 'TPS' : 'FPS');
  };

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden select-none">
      <div className="absolute inset-0 z-0">
         <GameScene 
            gameState={gameState} 
            attackTrigger={attackTrigger} 
            isFacingCamera={cameraMode === 'TPS' && isFacingCamera} // Only apply "face camera" rotation in TPS
            cameraMode={cameraMode}
         />
      </div>

      <UIOverlay 
        state={gameState} 
        onRestart={restartGame}
        onExitSelect={() => {}} 
        availableExits={[]}
        cameraMode={cameraMode}
        onToggleCamera={toggleCameraMode}
      />
    </div>
  );
}

export default App;