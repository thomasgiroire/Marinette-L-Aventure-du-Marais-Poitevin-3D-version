import React, { useMemo } from 'react';
import * as THREE from 'three';

export const RagondinModel = () => {
  
  // Génération des moustaches (Vibrisses)
  const whiskers = useMemo(() => {
    const lines = [];
    for (let i = 0; i < 6; i++) {
      lines.push(
        <mesh key={i} position={[i % 2 === 0 ? 0.25 : -0.25, -0.1, 0.55]} rotation={[0, i % 2 === 0 ? 0.5 : -0.5, (i * 0.2) - 0.5]}>
          <cylinderGeometry args={[0.005, 0.005, 0.35]} />
          <meshBasicMaterial color="#d1d5db" opacity={0.6} transparent />
        </mesh>
      );
    }
    return lines;
  }, []);

  const furColor = "#654321"; // Brun foncé "boueux"
  const tailColor = "#262626"; // Queue sombre et écailleuse
  const toothColor = "#f97316"; // Orange vif typique

  return (
    <group position={[0, -0.3, 0]}>
      
      {/* --- CORPS (Forme de "patate" vûtée) --- */}
      <group>
        {/* Corps principal */}
        <mesh position={[0, 0.3, 0]} scale={[0.9, 0.85, 1.3]} castShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color={furColor} roughness={0.6} /> 
        </mesh>
        
        {/* Arrière-train (Pour l'effet dos rond) */}
        <mesh position={[0, 0.35, -0.3]} scale={[0.85, 0.8, 1]} castShadow>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshStandardMaterial color={furColor} roughness={0.6} />
        </mesh>
      </group>

      {/* --- TÊTE (Rectangulaire et massive) --- */}
      <group position={[0, 0.35, 0.5]} scale={[0.85, 0.85, 0.85]}>
        {/* Crâne */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.5, 0.45, 0.4]} />
          <meshStandardMaterial color={furColor} />
        </mesh>

        {/* Museau (Boxy) */}
        <mesh position={[0, 0, 0.25]}>
           <boxGeometry args={[0.3, 0.25, 0.3]} />
           <meshStandardMaterial color="#553a1f" />
        </mesh>

        {/* Nez */}
        <mesh position={[0, 0.08, 0.4]} rotation={[1.57, 0, 0]}>
           <cylinderGeometry args={[0.08, 0.1, 0.05]} />
           <meshStandardMaterial color="#1f1f1f" />
        </mesh>

        {/* DENTS (Les fameuses incisives oranges) */}
        <group position={[0, -0.15, 0.38]} rotation={[0.2, 0, 0]}>
           <mesh position={[0.04, 0, 0]}>
              <boxGeometry args={[0.06, 0.18, 0.02]} />
              <meshStandardMaterial color={toothColor} roughness={0.2} />
           </mesh>
           <mesh position={[-0.04, 0, 0]}>
              <boxGeometry args={[0.06, 0.18, 0.02]} />
              <meshStandardMaterial color={toothColor} roughness={0.2} />
           </mesh>
        </group>

        {/* Oreilles (Petites et rondes sur le côté) */}
        <mesh position={[0.26, 0.25, -0.1]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.05]} />
          <meshStandardMaterial color="#4a3015" />
        </mesh>
        <mesh position={[-0.26, 0.25, -0.1]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.05]} />
          <meshStandardMaterial color="#4a3015" />
        </mesh>

        {/* Yeux (Petits et noirs) */}
        <mesh position={[0.2, 0.15, 0.15]}>
          <sphereGeometry args={[0.04]} />
          <meshStandardMaterial color="black" roughness={0.1} />
        </mesh>
        <mesh position={[-0.2, 0.15, 0.15]}>
          <sphereGeometry args={[0.04]} />
          <meshStandardMaterial color="black" roughness={0.1} />
        </mesh>

        {/* Ajout des moustaches */}
        <group>{whiskers}</group>
      </group>

      {/* --- QUEUE (Longue, cylindrique et traînante) --- */}
      {/* Base de la queue */}
      <mesh position={[0, 0.15, -0.6]} rotation={[-0.4, 0, 0]}>
         <cylinderGeometry args={[0.08, 0.06, 0.3]} />
         <meshStandardMaterial color={tailColor} roughness={0.8} />
      </mesh>
      {/* Bout de la queue (Plus fin) */}
      <mesh position={[0, 0.03, -0.9]} rotation={[-0.1, 0, 0]}>
         <cylinderGeometry args={[0.05, 0.02, 0.5]} />
         <meshStandardMaterial color={tailColor} roughness={0.8} />
      </mesh>

      {/* --- PATTES --- */}
      {/* Arrière (Grosses et palmées suggérées par la largeur) */}
      <group position={[0, 0, -0.2]}>
         <mesh position={[0.3, 0.1, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.08, 0.3]} />
            <meshStandardMaterial color={furColor} />
         </mesh>
         <mesh position={[-0.3, 0.1, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.08, 0.3]} />
            <meshStandardMaterial color={furColor} />
         </mesh>
         {/* Pieds */}
         <mesh position={[0.35, 0, 0.1]}>
             <boxGeometry args={[0.12, 0.05, 0.2]} />
             <meshStandardMaterial color="#3f3f46" />
         </mesh>
         <mesh position={[-0.35, 0, 0.1]}>
             <boxGeometry args={[0.12, 0.05, 0.2]} />
             <meshStandardMaterial color="#3f3f46" />
         </mesh>
      </group>

      {/* Avant (Petites mains) */}
      <group position={[0, 0, 0.3]}>
         <mesh position={[0.2, 0.1, 0]} rotation={[0.2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.04, 0.25]} />
            <meshStandardMaterial color={furColor} />
         </mesh>
         <mesh position={[-0.2, 0.1, 0]} rotation={[0.2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.04, 0.25]} />
            <meshStandardMaterial color={furColor} />
         </mesh>
      </group>

    </group>
  );
};