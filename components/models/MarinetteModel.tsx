import React from 'react';
import * as THREE from 'three';

export const MarinetteModel = ({ color }: { color: string }) => {
  return (
    <group position={[0, -0.3, 0]}>
      {/* Torso */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      
      {/* Belly Patch */}
      <mesh position={[0, 0.32, 0.2]} scale={[0.85, 0.85, 0.4]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color="#fef08a" roughness={0.5} />
      </mesh>

      {/* Head/Eyes Group */}
      <group position={[0, 0.6, 0.15]}>
        {/* Left Eye */}
        <mesh position={[0.18, 0, 0]} rotation={[0, 0, -0.2]} castShadow>
           <sphereGeometry args={[0.14, 32, 32]} />
           <meshStandardMaterial color="white" roughness={0.1} />
        </mesh>
        <mesh position={[0.18, 0.05, 0.11]}>
           <sphereGeometry args={[0.06, 16, 16]} />
           <meshStandardMaterial color="black" roughness={0} />
        </mesh>
        <mesh position={[0.20, 0.08, 0.15]}>
           <sphereGeometry args={[0.02, 8, 8]} />
           <meshStandardMaterial color="white" />
        </mesh>

        {/* Right Eye */}
        <mesh position={[-0.18, 0, 0]} rotation={[0, 0, 0.2]} castShadow>
           <sphereGeometry args={[0.14, 32, 32]} />
           <meshStandardMaterial color="white" roughness={0.1} />
        </mesh>
        <mesh position={[-0.18, 0.05, 0.11]}>
           <sphereGeometry args={[0.06, 16, 16]} />
           <meshStandardMaterial color="black" roughness={0} />
        </mesh>
        <mesh position={[-0.20, 0.08, 0.15]}>
           <sphereGeometry args={[0.02, 8, 8]} />
           <meshStandardMaterial color="white" />
        </mesh>
      </group>

      {/* Cheeks */}
      <mesh position={[0.25, 0.45, 0.25]} rotation={[0, 0.5, 0]}>
         <circleGeometry args={[0.06, 16]} />
         <meshStandardMaterial color="#fbcfe8" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-0.25, 0.45, 0.25]} rotation={[0, -0.5, 0]}>
         <circleGeometry args={[0.06, 16]} />
         <meshStandardMaterial color="#fbcfe8" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Legs */}
      {/* Back Thighs */}
      <mesh position={[0.28, 0.2, -0.05]} rotation={[0, 0, -0.3]}>
         <sphereGeometry args={[0.2, 24, 24]} />
         <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.28, 0.2, -0.05]} rotation={[0, 0, 0.3]}>
         <sphereGeometry args={[0.2, 24, 24]} />
         <meshStandardMaterial color={color} />
      </mesh>

      {/* Feet */}
      <mesh position={[0.3, 0.05, 0.15]} rotation={[-0.2, 0.5, 0]} scale={[1, 0.3, 1.8]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.3, 0.05, 0.15]} rotation={[-0.2, -0.5, 0]} scale={[1, 0.3, 1.8]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Arms */}
      <mesh position={[0.2, 0.25, 0.28]} rotation={[0.8, 0.2, -0.2]}>
         <capsuleGeometry args={[0.05, 0.3, 4, 8]} />
         <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.2, 0.25, 0.28]} rotation={[0.8, -0.2, 0.2]}>
         <capsuleGeometry args={[0.05, 0.3, 4, 8]} />
         <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
};