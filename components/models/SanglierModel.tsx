import React from 'react';

export const SanglierModel = () => {
  return (
    <group position={[0, -0.2, 0]}>
      {/* Body - Bulky and front-heavy */}
      <mesh position={[0, 0.4, -0.1]} scale={[0.9, 1, 1.3]} castShadow>
         <sphereGeometry args={[0.4, 32, 32]} />
         <meshStandardMaterial color="#4b5563" roughness={0.8} /> {/* Dark Grey/Brown */}
      </mesh>

      {/* Head/Snout */}
      <mesh position={[0, 0.35, 0.4]} rotation={[1.57, 0, 0]} castShadow>
         <coneGeometry args={[0.25, 0.5, 32]} />
         <meshStandardMaterial color="#374151" />
      </mesh>
      
      {/* Nose Tip */}
      <mesh position={[0, 0.35, 0.65]} rotation={[1.57, 0, 0]}>
         <cylinderGeometry args={[0.1, 0.12, 0.05]} />
         <meshStandardMaterial color="#fca5a5" /> {/* Pinkish snout */}
      </mesh>

      {/* Tusks */}
      <mesh position={[0.12, 0.25, 0.45]} rotation={[-0.5, 0, 0.3]}>
         <coneGeometry args={[0.03, 0.15, 8]} />
         <meshStandardMaterial color="#f3f4f6" />
      </mesh>
      <mesh position={[-0.12, 0.25, 0.45]} rotation={[-0.5, 0, -0.3]}>
         <coneGeometry args={[0.03, 0.15, 8]} />
         <meshStandardMaterial color="#f3f4f6" />
      </mesh>

      {/* Legs */}
      <group position={[0, 0.2, 0]}>
        <mesh position={[0.2, -0.2, 0.2]}>
           <cylinderGeometry args={[0.06, 0.05, 0.3]} />
           <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[-0.2, -0.2, 0.2]}>
           <cylinderGeometry args={[0.06, 0.05, 0.3]} />
           <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[0.2, -0.2, -0.3]}>
           <cylinderGeometry args={[0.06, 0.05, 0.3]} />
           <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[-0.2, -0.2, -0.3]}>
           <cylinderGeometry args={[0.06, 0.05, 0.3]} />
           <meshStandardMaterial color="#1f2937" />
        </mesh>
      </group>

      {/* Tail */}
      <mesh position={[0, 0.4, -0.6]} rotation={[-0.5, 0, 0]}>
         <cylinderGeometry args={[0.02, 0.02, 0.2]} />
         <meshStandardMaterial color="#374151" />
      </mesh>
    </group>
  );
};