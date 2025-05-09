import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stage, Loader } from "@react-three/drei";
import { STLLoader } from "three-stdlib";
import { onNewLog, getLogs } from "../DataStore";

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function MPUModel({ targetRotation }) {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = lerp(meshRef.current.rotation.x, targetRotation.current.x, 0.1);
      meshRef.current.rotation.y = lerp(meshRef.current.rotation.y, targetRotation.current.y, 0.1);
      meshRef.current.rotation.z = lerp(meshRef.current.rotation.z, targetRotation.current.z, 0.1);
    }
  });

  const geometry = useLoader(STLLoader, "/cansat_casing.STL");

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={meshRef} geometry={geometry} scale={0.02} position={[0, 0, 0]}>
        <meshStandardMaterial color="orange" />
      </mesh>
    </group>
  );
}

export default function MPUModelViewer() {
  const targetRotation = useRef({ x: 0, y: 0, z: 0 });
  const lastTimeRef = useRef(null);
  const [rotationDisplay, setRotationDisplay] = useState({ x: 0, y: 0, z: 0 });

  const applyRotationUpdate = (entry) => {
    if (entry.MPU6050) {
      const now = Date.now();
      const dt = lastTimeRef.current ? (now - lastTimeRef.current) / 1000 : 0;
      lastTimeRef.current = now;

      const { gyroX = 0, gyroY = 0, gyroZ = 0 } = entry.MPU6050;

      const dx = (gyroX * Math.PI) / 180 * dt;
      const dy = (gyroY * Math.PI) / 180 * dt;
      const dz = (gyroZ * Math.PI) / 180 * dt;

      targetRotation.current.x += dx;
      targetRotation.current.y += dy;
      targetRotation.current.z += dz;

      setRotationDisplay({
        x: targetRotation.current.x,
        y: targetRotation.current.y,
        z: targetRotation.current.z,
      });
    }
  };

  useEffect(() => {
    const logs = getLogs();
    if (logs.length > 0) {
      applyRotationUpdate(logs[logs.length - 1]);
    }

    onNewLog((entry) => {
      applyRotationUpdate(entry);
    });
  }, []);

  return (
    <div className="bg-gray-900 rounded-xl p-4 shadow-lg w-full">
      <h2 className="text-xl font-semibold mb-2 text-white">3D Orientation</h2>
      <div className="h-80 rounded overflow-hidden">
        <Canvas camera={{ position: [3, 3, 3], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <Stage intensity={0.5} environment="city" adjustCamera={false}>
            <MPUModel targetRotation={targetRotation} />
          </Stage>
          <OrbitControls enableZoom={false} enablePan={false} target={[0, 0, 0]} makeDefault />
        </Canvas>
      </div>
      <div className="mt-2 text-sm text-gray-300 flex justify-between">
        <p><strong>X:</strong> {rotationDisplay.x.toFixed(2)} rad</p>
        <p><strong>Y:</strong> {rotationDisplay.y.toFixed(2)} rad</p>
        <p><strong>Z:</strong> {rotationDisplay.z.toFixed(2)} rad</p>
      </div>
      <Loader />
    </div>
  );
}
