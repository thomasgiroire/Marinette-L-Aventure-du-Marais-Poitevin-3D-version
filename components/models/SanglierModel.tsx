import React, { useMemo } from 'react';
import * as THREE from 'three';

export const SanglierModel = () => {
  
  // Création procédurale de la "crinière" (poils sur le dos)
  const bristles = useMemo(() => {
    const hairs = [];
    for (let i = 0; i < 20; i++) {
      hairs.push(
        <mesh key={i} position={[0, 0.75 + Math.random() * 0.05, -0.5 + (i * 0.08)]} rotation={[0.2, 0, 0]}>
          <coneGeometry args={[0.02, 0.3, 4]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>
      );
    }
    return hairs;
  }, []);

  const boarColor = "#3f3f46"; // Gris foncé/Zinc
  const hoofColor = "#18181b"; // Noir
  
  return (
    <group position={[0, -0.4, 0]}>
      
      {/* --- CORPS (Silhouette en pente) --- */}
      {/* Avant-train (Massif, les épaules) */}
      <mesh position={[0, 0.5, 0.2]} scale={[1, 1.1, 1]} castShadow>
         <sphereGeometry args={[0.45, 32, 32]} />
         <meshStandardMaterial color={boarColor} roughness={0.9} />
      </mesh>
      
      {/* Arrière-train (Plus petit et bas) */}
      <mesh position={[0, 0.45, -0.4]} scale={[0.85, 0.9, 1.2]} castShadow>
         <sphereGeometry args={[0.4, 32, 32]} />
         <meshStandardMaterial color={boarColor} roughness={0.9} />
      </mesh>

      {/* Crinière dorsale (Détail important pour le réalisme) */}
      <group>{bristles}</group>

      {/* --- TÊTE (Conique et basse) --- */}
      <group position={[0, 0.4, 0.6]} rotation={[0.2, 0, 0]}>
        {/* Crâne */}
        <mesh position={[0, 0, 0]}>
           <boxGeometry args={[0.5, 0.5, 0.6]} />
           <meshStandardMaterial color={boarColor} />
        </mesh>
        
        {/* Groin (Long et finissant plat) */}
        <mesh position={[0, -0.1, 0.4]} rotation={[1.57, 0, 0]}>
           <coneGeometry args={[0.18, 0.6, 16]} />
           <meshStandardMaterial color="#27272a" />
        </mesh>
        
        {/* Bout du nez (Disque) */}
        <mesh position={[0, -0.1, 0.7]} rotation={[1.57, 0, 0]}>
           <cylinderGeometry args={[0.08, 0.08, 0.05]} />
           <meshStandardMaterial color="#pink" emissive="#5c3a3a" emissiveIntensity={0.2} /> 
        </mesh>

        {/* Oreilles (Plus pointues et vers l'avant) */}
        <mesh position={[0.22, 0.25, 0]} rotation={[0, 0, -0.3]}>
           <coneGeometry args={[0.05, 0.2, 4]} />
           <meshStandardMaterial color={boarColor} />
        </mesh>
        <mesh position={[-0.22, 0.25, 0]} rotation={[0, 0, 0.3]}>
           <coneGeometry args={[0.05, 0.2, 4]} />
           <meshStandardMaterial color={boarColor} />
        </mesh>

        {/* Défenses (Courbées vers le haut) */}
        <mesh position={[0.16, -0.15, 0.4]} rotation={[-2.5, 0, 0.4]}>
           <coneGeometry args={[0.02, 0.25, 8]} />
           <meshStandardMaterial color="#e5e7eb" roughness={0.4} />
        </mesh>
        <mesh position={[-0.16, -0.15, 0.4]} rotation={[-2.5, 0, -0.4]}>
           <coneGeometry args={[0.02, 0.25, 8]} />
           <meshStandardMaterial color="#e5e7eb" roughness={0.4} />
        </mesh>
      </group>

      {/* --- PATTES (Courtes et musclées) --- */}
      <group>
        {/* Avant Gauche */}
        <mesh position={[0.25, 0.15, 0.3]} rotation={[0.1, 0, 0]}>
           <cylinderGeometry args={[0.08, 0.06, 0.45]} />
           <meshStandardMaterial color={boarColor} />
        </mesh>
        {/* Avant Droite */}
        <mesh position={[-0.25, 0.15, 0.3]} rotation={[0.1, 0, 0]}>
           <cylinderGeometry args={[0.08, 0.06, 0.45]} />
           <meshStandardMaterial color={boarColor} />
        </mesh>
        {/* Arrière Gauche */}
        <mesh position={[0.2, 0.15, -0.5]} rotation={[-0.1, 0, 0]}>
           <cylinderGeometry args={[0.09, 0.05, 0.45]} />
           <meshStandardMaterial color={boarColor} />
        </mesh>
        {/* Arrière Droite */}
        <mesh position={[-0.2, 0.15, -0.5]} rotation={[-0.1, 0, 0]}>
           <cylinderGeometry args={[0.09, 0.05, 0.45]} />
           <meshStandardMaterial color={boarColor} />
        </mesh>
      </group>

      {/* Queue (Fine et pendante avec un bout touffu) */}
      <group position={[0, 0.4, -0.75]} rotation={[-0.8, 0, 0]}>
        <mesh>
           <cylinderGeometry args={[0.02, 0.01, 0.25]} />
           <meshStandardMaterial color={boarColor} />
        </mesh>
        <mesh position={[0, -0.15, 0]}>
            <sphereGeometry args={[0.04]} />
            <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>

    </group>
  );
};