import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera, Stars } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import { Vector3, Color, Group } from 'three';
import { MapTile } from '../../types';

const Tile = ({ position, confidence, semanticClass }: { position: Vector3, confidence: number, semanticClass: MapTile['semanticClass'] }) => {
  const color = useMemo(() => {
    if (semanticClass === 'dynamic') return new Color('#3b82f6');
    if (semanticClass === 'hazard') return new Color('#ef4444');
    return new Color('#10b981').multiplyScalar(confidence);
  }, [semanticClass, confidence]);

  return (
    <mesh position={position}>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial color={color} transparent opacity={0.8} />
    </mesh>
  );
};

const Agent = () => {
  const meshRef = useRef<Group>(null);
  const drift = useStore((state) => state.currentDrift);

  useFrame(() => {
    if (meshRef.current) {
      // Simulate real-time drift correction visualization
      meshRef.current.position.lerp(drift.translation, 0.1);
      meshRef.current.rotation.x += 0.01;
    }
  });

  return (
    <group ref={meshRef}>
      <mesh>
        <octahedronGeometry args={[0.1]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={2} />
      </mesh>
      <pointLight color="#f59e0b" intensity={2} distance={2} />
    </group>
  );
};

export const Scene3D = ({ tiles }: { tiles: MapTile[] }) => {

  return (
    <div className="w-full h-full bg-[#050505] rounded-xl overflow-hidden border border-[#222]">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[5, 5, 5]} />
        <OrbitControls makeDefault />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Grid 
          infiniteGrid 
          fadeDistance={50} 
          fadeStrength={5} 
          cellSize={1} 
          sectionSize={5} 
          sectionColor="#222" 
          cellColor="#111" 
        />

        {tiles.map((tile) => (
          <Tile key={tile.id} {...tile} />
        ))}

        <Agent />
      </Canvas>
      
      <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded border border-white/10">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">authoritative state</span>
          <span className="text-xs font-mono text-green-400">SYNCING TILESET_02</span>
        </div>
      </div>
    </div>
  );
};
