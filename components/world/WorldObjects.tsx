import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TileType } from '../../types';
import { COLORS } from '../../constants';

export const BoxTile = ({ position, color, type }: { position: [number, number, number], color: string, type: TileType }) => {
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

export const Tree = ({ position }: { position: [number, number, number] }) => (
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

export const Collectible = ({ position }: { position: [number, number, number] }) => {
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
};