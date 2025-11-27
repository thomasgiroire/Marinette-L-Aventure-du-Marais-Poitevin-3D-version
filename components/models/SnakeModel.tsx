import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SnakeModel = () => {
  const bodyRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (bodyRef.current) {
        // Slithering animation
        bodyRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 5) * 0.1;
        bodyRef.current.position.x = Math.sin(state.clock.elapsedTime * 8) * 0.05;
    }
  });

  return (
    <group ref={bodyRef} position={[0, -0.4, 0]}>
      {/* Coiled Body Segments */}
      <mesh position={[0, 0.05, 0]} castShadow>
         <torusGeometry args={[0.25, 0.08, 16, 32]} />
         <meshStandardMaterial color="#65a30d" />
      </mesh>
      <mesh position={[0, 0.12, 0]} rotation={[0, 2, 0]} scale={[0.8, 1, 0.8]} castShadow>
         <torusGeometry args={[0.2, 0.07, 16, 32]} />
         <meshStandardMaterial color="#84cc16" />
      </mesh>

      {/* Head */}
      <group position={[0, 0.25, 0.15]}>
        <mesh scale={[1, 0.8, 1.2]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#4d7c0f" />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[0.08, 0.05, 0.1]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="yellow" />
        </mesh>
        <mesh position={[-0.08, 0.05, 0.1]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="yellow" />
        </mesh>
        
        {/* Tongue */}
        <mesh position={[0, -0.05, 0.2]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.02, 0.01, 0.1]} />
            <meshStandardMaterial color="red" />
        </mesh>
      </group>
    </group>
  );
};