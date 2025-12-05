import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Entity, EntityType, CameraMode } from '../../types';
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
    isFacingCamera?: boolean;
    cameraMode?: CameraMode;
}

export const Character: React.FC<CharacterProps> = ({ entity, isPlayer, attackTrigger, isFacingCamera, cameraMode }) => {
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
    
    // 180 Rotation on Backwards (Only applies in TPS mode via isFacingCamera prop)
    if (isFacingCamera) {
        baseRotation += Math.PI;
    }
    
    targetRotation.current = baseRotation;
  }, [entity.direction, isPlayer, isFacingCamera]);

  useFrame((state) => {
    if (mesh.current) {
      // Bobbing animation (only for enemies or player in TPS)
      if (!isPlayer || cameraMode === 'TPS') {
          const hoverSpeed = isMosquito ? 10 : 4;
          const hoverHeight = isMosquito ? 0.8 : 0.5;
          const hoverAmp = isMosquito ? 0.15 : 0.1;
          mesh.current.position.y = hoverHeight + Math.sin(state.clock.elapsedTime * hoverSpeed) * hoverAmp;
      }
      
      // Rotation Logic
      let currentRot = mesh.current.rotation.y;
      let diff = targetRotation.current - currentRot;
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
            const maxLength = 2.0; 
            const currentLength = scale * maxLength;

            tongueMesh.current.visible = true;
            tongueMesh.current.scale.z = currentLength;
            
            // Adjust tongue origin based on Camera Mode
            if (cameraMode === 'TPS') {
                 tongueMesh.current.position.z = 0.5 + (currentLength / 2); 
                 tongueMesh.current.position.y = -0.1;
            } else {
                 // FPS: Lower and "forward" relative to camera view
                 tongueMesh.current.position.z = 0.5 + (currentLength / 2); 
                 tongueMesh.current.position.y = -0.2; 
            }

        } else {
            tongueMesh.current.visible = false;
        }
    }
  });

  const getColor = () => {
    if (isPlayer) return COLORS.PLAYER;
    if (entity.type === EntityType.SANGLIER) return '#ef4444'; 
    if (entity.type === EntityType.RAGONDIN) return '#92400e'; 
    if (entity.type === EntityType.MOUSTIQUE) return '#94a3b8'; 
    if (entity.type === EntityType.SNAKE) return '#65a30d'; 
    return '#ffffff';
  };

  return (
    <group ref={mesh} position={[entity.position.x, isPlayer ? 0.6 : 0.5, entity.position.y]}>
      
      {isPlayer && cameraMode === 'FPS' ? (
        // In FPS, hide body
        null 
      ) : isPlayer ? (
        // In TPS, show Marinette
        <MarinetteModel color={COLORS.PLAYER} />
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
         <mesh ref={tongueMesh} position={[0, -0.2, 0]} visible={false}>
            <boxGeometry args={[0.1, 0.05, 1]} /> 
            <meshStandardMaterial color={COLORS.TONGUE} />
         </mesh>
      )}
    </group>
  );
};