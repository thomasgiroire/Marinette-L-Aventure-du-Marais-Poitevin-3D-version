import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { GameState, TileType, EntityType, GRID_SIZE } from '../types';
import { COLORS } from '../constants';

// Fix for missing JSX.IntrinsicElements types in this environment
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
      [elemName: string]: any;
    }
  }
}

interface GameSceneProps {
  gameState: GameState;
  attackTrigger?: number;
}

const BoxTile = ({ position, color, type }: { position: [number, number, number], color: string, type: TileType }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  // Subtle animation for water
  useFrame((state) => {
    if (type === TileType.WATER && mesh.current) {
      mesh.current.position.y = -0.5 + Math.sin(state.clock.elapsedTime + position[0]) * 0.05;
    }
    // Pulsing effect for exit
    if (type === TileType.EXIT && mesh.current) {
        (mesh.current.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(color);
        (mesh.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
  });

  return (
    <mesh ref={mesh} position={position} receiveShadow>
      <boxGeometry args={[0.95, 1, 0.95]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const Tree = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh position={[0, 0.5, 0]}>
      <cylinderGeometry args={[0.1, 0.2, 1, 8]} />
      <meshStandardMaterial color="#3f2e18" />
    </mesh>
    <mesh position={[0, 1.2, 0]}>
      <dodecahedronGeometry args={[0.5]} />
      <meshStandardMaterial color={COLORS.OBSTACLE} />
    </mesh>
  </group>
);

const Character = ({ entity, isPlayer, attackTrigger }: { entity: any, isPlayer?: boolean, attackTrigger?: number }) => {
  const mesh = useRef<THREE.Group>(null);
  const tongueMesh = useRef<THREE.Mesh>(null);
  const targetRotation = useRef(0);
  
  const isMosquito = entity.type === EntityType.MOUSTIQUE;
  const isBoar = entity.type === EntityType.SANGLIER;

  useEffect(() => {
    switch (entity.direction) {
        case 0: targetRotation.current = Math.PI; break;
        case 1: targetRotation.current = Math.PI / 2; break;
        case 2: targetRotation.current = 0; break;
        case 3: targetRotation.current = -Math.PI / 2; break;
    }
  }, [entity.direction]);

  useFrame((state) => {
    if (mesh.current) {
      // Bobbing animation
      mesh.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
      
      // Smooth Rotation
      let rot = mesh.current.rotation.y;
      mesh.current.rotation.y = THREE.MathUtils.lerp(rot, targetRotation.current, 0.2);

      // Flying animation for mosquito
      if (!isPlayer && isMosquito) {
         mesh.current.position.y = 1.5 + Math.sin(state.clock.elapsedTime * 10) * 0.2;
      }
    }

    // Tongue Animation
    if (isPlayer && tongueMesh.current && attackTrigger) {
        const now = Date.now();
        const elapsed = now - attackTrigger;
        const duration = 200; // ms
        
        if (elapsed < duration) {
            const progress = elapsed / duration;
            const scale = Math.sin(progress * Math.PI); 
            const maxLength = 2.2; 
            const currentLength = scale * maxLength;

            tongueMesh.current.visible = true;
            tongueMesh.current.scale.z = currentLength;
            tongueMesh.current.position.z = 0.35 + (currentLength / 2); 
        } else {
            tongueMesh.current.visible = false;
        }
    }
  });

  const getColor = () => {
    if (isPlayer) return COLORS.PLAYER;
    if (entity.type === EntityType.SANGLIER) return '#ef4444'; // Red
    if (entity.type === EntityType.RAGONDIN) return '#92400e'; // Brown
    if (entity.type === EntityType.MOUSTIQUE) return '#94a3b8'; // Gray
    return '#ffffff';
  };

  // Adjust body size: Mosquito is smaller to show wings better
  const bodyRadius = isMosquito ? 0.2 : 0.4;

  return (
    <group ref={mesh} position={[entity.position.x, 0.5, entity.position.y]}>
      {/* Body */}
      <mesh castShadow>
        <sphereGeometry args={[bodyRadius, 32, 32]} />
        <meshStandardMaterial color={getColor()} />
      </mesh>
      
      {/* Eyes for Player */}
      {isPlayer && (
        <group position={[0, 0, 0.35]}> 
            <mesh position={[0.15, 0.2, 0]}>
                <sphereGeometry args={[0.1]} />
                <meshStandardMaterial color="white" />
            </mesh>
            <mesh position={[-0.15, 0.2, 0]}>
                <sphereGeometry args={[0.1]} />
                <meshStandardMaterial color="white" />
            </mesh>
            <mesh position={[0.15, 0.2, 0.08]}>
                <sphereGeometry args={[0.04]} />
                <meshStandardMaterial color="black" />
            </mesh>
            <mesh position={[-0.15, 0.2, 0.08]}>
                <sphereGeometry args={[0.04]} />
                <meshStandardMaterial color="black" />
            </mesh>
        </group>
      )}

      {/* Tongue (Player Only) */}
      {isPlayer && (
         <mesh ref={tongueMesh} position={[0, 0.1, 0]} visible={false}>
            {/* Box of length 1 */}
            <boxGeometry args={[0.15, 0.05, 1]} /> 
            <meshStandardMaterial color={COLORS.TONGUE} />
         </mesh>
      )}

      {/* Wings for Mosquito */}
      {isMosquito && (
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.8, 0.05, 0.2]} />
          <meshStandardMaterial color="white" opacity={0.6} transparent />
        </mesh>
      )}

      {/* Tail for Boar (Sanglier) */}
      {isBoar && (
        <group position={[0, 0, -0.35]} rotation={[0.5, 0, 0]}>
           <mesh>
             <cylinderGeometry args={[0.03, 0.05, 0.2, 8]} />
             <meshStandardMaterial color={getColor()} />
           </mesh>
        </group>
      )}
    </group>
  );
};

const Collectible = ({ position }: { position: [number, number, number] }) => {
    const ref = useRef<THREE.Group>(null);
    useFrame((state) => {
        if(ref.current) ref.current.rotation.y += 0.02;
    })
    return (
        <group ref={ref} position={position}>
             <mesh position={[0, 0.5, 0]}>
                <octahedronGeometry args={[0.3]} />
                <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.5]} />
                <meshStandardMaterial color="green" />
            </mesh>
        </group>
    )
}

const FollowCamera = ({ player }: { player: any }) => {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const targetPos = useRef(new THREE.Vector3());
    const cameraPos = useRef(new THREE.Vector3());

    useFrame(() => {
        if (!cameraRef.current) return;
        let offsetX = 0;
        let offsetZ = 0;
        
        // Move camera back to see more environment
        const distance = 8; // Increased from 4
        const height = 7;   // Increased from 4

        if (player.direction === 0) offsetZ = distance;
        else if (player.direction === 1) offsetX = -distance;
        else if (player.direction === 2) offsetZ = -distance;
        else if (player.direction === 3) offsetX = distance;

        const idealX = player.position.x + offsetX;
        const idealZ = player.position.y + offsetZ;
        
        cameraPos.current.lerp(new THREE.Vector3(idealX, height, idealZ), 0.05);
        cameraRef.current.position.copy(cameraPos.current);

        const lookAtX = player.position.x;
        const lookAtZ = player.position.y;
        targetPos.current.lerp(new THREE.Vector3(lookAtX, 0.5, lookAtZ), 0.1);
        cameraRef.current.lookAt(targetPos.current);
    });

    return <PerspectiveCamera ref={cameraRef} makeDefault fov={50} />;
};

const GameScene: React.FC<GameSceneProps> = ({ gameState, attackTrigger }) => {
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
        <Character entity={player} isPlayer attackTrigger={attackTrigger} />
        {enemies.map(e => !e.isHidden && <Character key={e.id} entity={e} />)}
        {items.map(i => <Collectible key={i.id} position={[i.position.x, 0, i.position.y]} />)}
      </group>
    </Canvas>
  );
};

export default GameScene;