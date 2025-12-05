import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Entity, CameraMode } from '../../types';

interface FollowCameraProps {
    player: Entity;
    mode: CameraMode;
}

export const FollowCamera: React.FC<FollowCameraProps> = ({ player, mode }) => {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const cameraPos = useRef(new THREE.Vector3());
    const targetLookAt = useRef(new THREE.Vector3());

    useFrame((state) => {
        if (!cameraRef.current) return;

        let targetX, targetY, targetZ;
        let lookTarget: THREE.Vector3;

        // Common vectors
        let lookDirX = 0;
        let lookDirZ = 0;
        if (player.direction === 0) lookDirZ = -1; // North
        else if (player.direction === 1) lookDirX = 1;  // East
        else if (player.direction === 2) lookDirZ = 1;  // South
        else if (player.direction === 3) lookDirX = -1; // West

        if (mode === 'FPS') {
            // --- FPS MODE ---
            // Camera exactly at player position + eye height
            const eyeHeight = 0.6; 
            targetX = player.position.x;
            targetY = eyeHeight;
            targetZ = player.position.y;
            
            // Look forward
            lookTarget = new THREE.Vector3(
                targetX + lookDirX * 5, 
                eyeHeight, 
                targetZ + lookDirZ * 5
            );
            
            // Lerp position for smoothness
            cameraPos.current.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.2);
            cameraRef.current.position.copy(cameraPos.current);

        } else {
            // --- TPS MODE ---
            // Camera behind player and slightly up
            const distanceBehind = 3;
            const heightAbove = 4;
            
            targetX = player.position.x - (lookDirX * distanceBehind);
            targetY = heightAbove;
            targetZ = player.position.y - (lookDirZ * distanceBehind);

            // Lerp position for smoothness (slower for TPS feeling)
            cameraPos.current.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.1);
            cameraRef.current.position.copy(cameraPos.current);

            // Look at player
            lookTarget = new THREE.Vector3(player.position.x, 0, player.position.y);
        }

        // Smooth look-at
        targetLookAt.current.lerp(lookTarget, 0.15);
        cameraRef.current.lookAt(targetLookAt.current);
    });

    return <PerspectiveCamera ref={cameraRef} makeDefault fov={75} near={0.1} far={50} />;
};