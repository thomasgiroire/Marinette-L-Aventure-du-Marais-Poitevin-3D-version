import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const MosquitoModel = () => {
  const wingRefLeft = useRef<THREE.Mesh>(null);
  const wingRefRight = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (wingRefLeft.current && wingRefRight.current) {
        // Super fast flapping
        const t = state.clock.elapsedTime * 60;
        wingRefLeft.current.rotation.z = Math.sin(t) * 0.5 + 0.2;
        wingRefRight.current.rotation.z = -Math.sin(t) * 0.5 - 0.2;
    }
  });

  return (
    <group position={[0, -0.2, 0]}>
        {/* Head */}
        <mesh position={[0, 0.4, 0.3]} castShadow>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#475569" />
        </mesh>
        
        {/* Eyes (Compound, Red) */}
        <mesh position={[0.06, 0.42, 0.38]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#ef4444" roughness={0.2} />
        </mesh>
        <mesh position={[-0.06, 0.42, 0.38]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#ef4444" roughness={0.2} />
        </mesh>

        {/* Proboscis (Needle) */}
        <mesh position={[0, 0.35, 0.6]} rotation={[1.57, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.02, 0.5]} />
            <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Thorax (Middle Segment) */}
        <mesh position={[0, 0.4, 0.05]} rotation={[0.2, 0, 0]} castShadow>
             <sphereGeometry args={[0.15, 16, 16]} />
             <meshStandardMaterial color="#334155" />
        </mesh>
        
        {/* Wings */}
        <group position={[0, 0.55, 0.1]}>
             <mesh ref={wingRefLeft} position={[0.2, 0, 0]} rotation={[0, 0, 0.2]}>
                 <boxGeometry args={[0.6, 0.01, 0.25]} />
                 <meshStandardMaterial color="#e2e8f0" transparent opacity={0.6} side={THREE.DoubleSide} />
             </mesh>
             <mesh ref={wingRefRight} position={[-0.2, 0, 0]} rotation={[0, 0, -0.2]}>
                 <boxGeometry args={[0.6, 0.01, 0.25]} />
                 <meshStandardMaterial color="#e2e8f0" transparent opacity={0.6} side={THREE.DoubleSide} />
             </mesh>
        </group>

        {/* Legs (Hanging down) */}
        <group position={[0, 0.3, 0.1]}>
            <mesh position={[0.15, -0.1, 0.1]} rotation={[0, 0, -0.5]}>
                <cylinderGeometry args={[0.01, 0.01, 0.4]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[-0.15, -0.1, 0.1]} rotation={[0, 0, 0.5]}>
                <cylinderGeometry args={[0.01, 0.01, 0.4]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0.15, -0.1, -0.1]} rotation={[0.2, 0, -0.6]}>
                <cylinderGeometry args={[0.01, 0.01, 0.5]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[-0.15, -0.1, -0.1]} rotation={[0.2, 0, 0.6]}>
                <cylinderGeometry args={[0.01, 0.01, 0.5]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>
        </group>
    </group>
  );
};