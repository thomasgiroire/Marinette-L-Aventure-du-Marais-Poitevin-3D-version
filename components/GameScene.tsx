import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { GameState, TileType, GRID_SIZE } from '../types';
import { COLORS } from '../constants';
import { FollowCamera } from './game/FollowCamera';
import { Character } from './game/Character';
import { BoxTile, Tree, Collectible } from './world/WorldObjects';

interface GameSceneProps {
  gameState: GameState;
  attackTrigger?: number;
  isMovingBackwards?: boolean;
}

const GameScene: React.FC<GameSceneProps> = ({ gameState, attackTrigger, isMovingBackwards }) => {
  const { grid, player, enemies, items, levelExits } = gameState;

  // Memoize grid rendering
  const tiles = useMemo(() => {
    const els = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const type = grid[y][x];
        let color = COLORS.GRASS;
        if (type === TileType.WATER) color = COLORS.WATER;
        if (type === TileType.EXIT) {
            // Find specific exit color
            const exit = levelExits.find(e => e.position.x === x && e.position.y === y);
            color = exit ? exit.color : COLORS.EXIT;
        }
        
        els.push(
          <group key={`${x}-${y}`}>
            <BoxTile 
                position={[x, -0.5, y]} 
                color={color} 
                type={type} 
            />
            {type === TileType.OBSTACLE && <Tree position={[x, 0, y]} />}
          </group>
        );
      }
    }
    return els;
  }, [grid, levelExits]);

  return (
    <Canvas shadows dpr={[1, 2]}>
      <FollowCamera player={player} />
      
      <ambientLight intensity={0.7} />
      <directionalLight 
        position={[10, 20, 5]} 
        intensity={1.2} 
        castShadow 
        shadow-mapSize={[1024, 1024]} 
      />
      <Environment preset="park" />

      <group>
        {tiles}
        <Character 
            entity={player} 
            isPlayer 
            attackTrigger={attackTrigger} 
            isMovingBackwards={isMovingBackwards}
        />
        {enemies.map(e => !e.isHidden && <Character key={e.id} entity={e} />)}
        {items.map(i => <Collectible key={i.id} position={[i.position.x, 0, i.position.y]} />)}
      </group>
    </Canvas>
  );
};

export default GameScene;