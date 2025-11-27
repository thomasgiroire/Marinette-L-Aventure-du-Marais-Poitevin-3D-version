import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Entity, EntityType } from '../../types';
import { COLORS } from '../../constants';
import { MarinetteModel } from '../models/MarinetteModel';
import { MosquitoModel } from '../models/MosquitoModel';

interface CharacterProps {
    entity: Entity;
    isPlayer?: boolean;
    attackTrigger?: number;
}

export const Character: React.FC<CharacterProps> = ({ entity, isPlayer, attackTrigger }) => {
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
      const hoverSpeed = isMosquito ? 10 : 4;
      const hoverHeight = isMosquito ? 0.8 : 0.5; // Mosquitos fly higher
      const hoverAmp = isMosquito ? 0.15 : 0.1;

      mesh.current.position.y = hoverHeight + Math.sin(state.clock.elapsedTime * hoverSpeed) * hoverAmp;
      
      // Smooth Rotation
      let rot = mesh.current.rotation.y;
      mesh.current.rotation.y = THREE.MathUtils.lerp(rot, targetRotation.current, 0.2);
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
            tongueMesh.current.position.z = 0.2 + (currentLength / 2); // Adjusted for new model mouth pos
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

  // Adjust body size: Mosquito uses custom model now, but keeping prop for fallback
  const bodyRadius = 0.4;

  return (
    <group ref={mesh} position={[entity.position.x, 0.5, entity.position.y]}>
      
      {isPlayer ? (
        <MarinetteModel color={getColor()} />
      ) : isMosquito ? (
        <MosquitoModel />
      ) : (
        <>
            {/* Standard Body for Ragondin / Sanglier */}
            <mesh castShadow>
                <sphereGeometry args={[bodyRadius, 32, 32]} />
                <meshStandardMaterial color={getColor()} />
            </mesh>
            
            {/* Tail for Boar (Sanglier) */}
            {isBoar && (
                <group position={[0, 0, -0.35]} rotation={[0.5, 0, 0]}>
                <mesh>
                    <cylinderGeometry args={[0.03, 0.05, 0.2, 8]} />
                    <meshStandardMaterial color={getColor()} />
                </mesh>
                </group>
            )}
        </>
      )}

      {/* Tongue (Player Only) */}
      {isPlayer && (
         <mesh ref={tongueMesh} position={[0, 0.2, 0]} visible={false}>
            {/* Box of length 1 */}
            <boxGeometry args={[0.15, 0.05, 1]} /> 
            <meshStandardMaterial color={COLORS.TONGUE} />
         </mesh>
      )}
    </group>
  );
};