import React from 'react';

export const RagondinModel = () => {
  return (
    <group position={[0, -0.3, 0]}>
      {/* Body - slightly elongated */}
      <mesh position={[0, 0.25, 0]} scale={[0.8, 0.7, 1.2]} castShadow>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#854d0e" roughness={0.6} /> {/* Brown */}
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.4, 0.35]} scale={[0.7, 0.7, 0.8]} castShadow>
        <sphereGeometry args={[0.25, 24, 24]} />
        <meshStandardMaterial color="#854d0e" />
      </mesh>

      {/* Orange Teeth (Specific trait) */}
      <mesh position={[0, 0.25, 0.55]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.1, 0.12, 0.02]} />
        <meshStandardMaterial color="#f97316" /> {/* Bright Orange */}
      </mesh>

      {/* Ears */}
      <mesh position={[0.15, 0.55, 0.35]} rotation={[0, 0, -0.2]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#5c3609" />
      </mesh>
      <mesh position={[-0.15, 0.55, 0.35]} rotation={[0, 0, 0.2]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#5c3609" />
      </mesh>

      {/* Tail (Long and rat-like) */}
      <mesh position={[0, 0.1, -0.5]} rotation={[-0.2, 0, 0]}>
         <cylinderGeometry args={[0.04, 0.02, 0.6]} />
         <meshStandardMaterial color="#451a03" />
      </mesh>

      {/* Eyes */}
      <mesh position={[0.12, 0.45, 0.48]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-0.12, 0.45, 0.48]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
};