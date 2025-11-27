import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Entity } from '../../types';

interface FollowCameraProps {
    player: Entity;
}

export const FollowCamera: React.FC<FollowCameraProps> = ({ player }) => {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const targetPos = useRef(new THREE.Vector3());
    const cameraPos = useRef(new THREE.Vector3());

    useFrame(() => {
        if (!cameraRef.current) return;
        let offsetX = 0;
        let offsetZ = 0;
        
        // Move camera back to see more environment
        const distance = 8; 
        const height = 7;   

        if (player.direction === 0) offsetZ = distance;
        else if (player.direction === 1) offsetX = -distance;
        else if (player.direction === 2) offsetZ = -distance;
        else if (player.direction === 3) offsetX = distance;

        const idealX = player.position.x + offsetX;
        const idealZ = player.position.y + offsetZ;
        
        // Increased lerp speed from 0.05 to 0.1 for snappier tracking
        cameraPos.current.lerp(new THREE.Vector3(idealX, height, idealZ), 0.1);
        cameraRef.current.position.copy(cameraPos.current);

        const lookAtX = player.position.x;
        const lookAtZ = player.position.y;
        targetPos.current.lerp(new THREE.Vector3(lookAtX, 0.5, lookAtZ), 0.1);
        cameraRef.current.lookAt(targetPos.current);
    });

    return <PerspectiveCamera ref={cameraRef} makeDefault fov={50} />;
};