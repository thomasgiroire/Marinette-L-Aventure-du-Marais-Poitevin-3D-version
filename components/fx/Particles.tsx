import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ParticleBurst, EffectType } from '../../types';
import { COLORS } from '../../constants';

// Individual particle data structure
interface ParticleData {
  id: number;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  scale: number;
  life: number; // 0 to 1
  decay: number;
  color: string;
  type: EffectType;
}

const ParticleGroup: React.FC<{ burst: ParticleBurst }> = ({ burst }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = burst.type === EffectType.HIT ? 12 : burst.type === EffectType.SPLASH ? 8 : 6;
  
  // Initialize particles for this burst
  const particles = useMemo(() => {
    const parts: ParticleData[] = [];
    const baseY = 0.5;
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = Math.random() * 0.1 + 0.05;
      
      let vx = Math.cos(angle) * speed;
      let vy = Math.random() * 0.1 + 0.05; // Upward bias
      let vz = Math.sin(angle) * speed;
      let color = '#fff';
      let decay = 0.05;
      let startScale = 0.2;

      if (burst.type === EffectType.SPLASH) {
        color = COLORS.WATER;
        vy = Math.random() * 0.2;
        decay = 0.04;
        startScale = 0.15;
      } else if (burst.type === EffectType.HIT) {
        color = burst.color || '#ef4444';
        vx *= 2;
        vz *= 2;
        vy *= 1.5;
        decay = 0.08;
      } else if (burst.type === EffectType.COLLECT) {
        color = '#f472b6'; // Pink
        vx *= 0.5;
        vz *= 0.5;
        vy = 0.05;
        decay = 0.02;
      } else if (burst.type === EffectType.ATTACK) {
        color = '#fff';
        decay = 0.1;
        startScale = 0.1;
      }

      parts.push({
        id: i,
        pos: new THREE.Vector3(burst.position.x, baseY, burst.position.y),
        vel: new THREE.Vector3(vx, vy, vz),
        scale: startScale,
        life: 1.0,
        decay,
        color,
        type: burst.type
      });
    }
    return parts;
  }, [burst]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!meshRef.current) return;

    let activeCount = 0;

    particles.forEach((p, i) => {
      if (p.life > 0) {
        // Physics
        p.pos.add(p.vel);
        p.life -= p.decay;
        
        // Gravity
        if (p.type !== EffectType.COLLECT) {
            p.vel.y -= 0.01; 
        }

        // Floor collision
        if (p.pos.y < 0) {
           p.pos.y = 0;
           p.vel.y *= -0.5;
           p.vel.x *= 0.8;
           p.vel.z *= 0.8;
        }

        // Update Matrix
        dummy.position.copy(p.pos);
        const currentScale = p.scale * p.life;
        dummy.scale.set(currentScale, currentScale, currentScale);
        dummy.rotation.set(p.life, p.life, p.life); // Spin
        dummy.updateMatrix();
        
        meshRef.current.setMatrixAt(i, dummy.matrix);
        meshRef.current.setColorAt(i, new THREE.Color(p.color));
        activeCount++;
      } else {
        // Hide dead particles
        dummy.scale.set(0,0,0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  // Select geometry based on type
  if (burst.type === EffectType.SPLASH) {
      return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial transparent opacity={0.8} />
        </instancedMesh>
      );
  }

  if (burst.type === EffectType.COLLECT) {
      return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial emissive="#f472b6" emissiveIntensity={1} />
        </instancedMesh>
      );
  }

  // Default (Hit / Attack)
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial />
    </instancedMesh>
  );
};

export const Particles = ({ bursts }: { bursts: ParticleBurst[] }) => {
  return (
    <group>
      {bursts.map(burst => (
        <ParticleGroup key={burst.id} burst={burst} />
      ))}
    </group>
  );
};