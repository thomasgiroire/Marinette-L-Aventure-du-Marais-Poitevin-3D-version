import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Entity, EntityType } from '../../types';
import { COLORS } from '../../constants';
import { MarinetteModel } from '../models/MarinetteModel';
import { MosquitoModel } from '../models/MosquitoModel';
import { RagondinModel } from '../models/RagondinModel';
import { SanglierModel } from '../models/SanglierModel';
import { SnakeModel } from '../models/SnakeModel';

interface CharacterProps {
    entity: Entity;
    isPlayer?: boolean;
    attackTrigger?: number;
    isMovingBackwards?: boolean;
}

export const Character: React.FC<CharacterProps> = ({ entity, isPlayer, attackTrigger, isMovingBackwards }) => {
  const mesh = useRef<THREE.Group>(null);
  const tongueMesh = useRef<THREE.Mesh>(null);
  const targetRotation = useRef(0);
  
  const isMosquito = entity.type === EntityType.MOUSTIQUE;

  useEffect(() => {
    let baseRotation = 0;
    switch (entity.direction) {
        case 0: baseRotation = Math.PI; break;
        case 1: baseRotation = Math.PI / 2; break;
        case 2: baseRotation = 0; break;
        case 3: baseRotation = -Math.PI / 2; break;
    }
    
    // If moving backwards, flip 180 degrees visually (Face the player/screen)
    if (isPlayer && isMovingBackwards) {
        baseRotation += Math.PI;
    }

    targetRotation.current = baseRotation;
  }, [entity.direction, isPlayer, isMovingBackwards]);

  useFrame((state) => {
    if (mesh.current) {
      // Bobbing animation
      const hoverSpeed = isMosquito ? 10 : 4;
      const hoverHeight = isMosquito ? 0.8 : 0.5; // Mosquitos fly higher
      const hoverAmp = isMosquito ? 0.15 : 0.1;

      mesh.current.position.y = hoverHeight + Math.sin(state.clock.elapsedTime * hoverSpeed) * hoverAmp;
      
      // Shortest Path Rotation Logic
      let currentRot = mesh.current.rotation.y;
      let diff = targetRotation.current - currentRot;
      
      // Normalize difference to -PI to PI
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;

      mesh.current.rotation.y = THREE.MathUtils.lerp(currentRot, currentRot + diff, 0.2);
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
    if (entity.type === EntityType.SNAKE) return '#65a30d'; // Green
    return '#ffffff';
  };

  return (
    <group ref={mesh} position={[entity.position.x, 0.5, entity.position.y]}>
      
      {isPlayer ? (
        <MarinetteModel color={getColor()} />
      ) : isMosquito ? (
        <MosquitoModel />
      ) : entity.type === EntityType.RAGONDIN ? (
        <RagondinModel />
      ) : entity.type === EntityType.SANGLIER ? (
        <SanglierModel />
      ) : entity.type === EntityType.SNAKE ? (
        <SnakeModel />
      ) : (
        <mesh castShadow>
             <sphereGeometry args={[0.4, 32, 32]} />
             <meshStandardMaterial color={getColor()} />
        </mesh>
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