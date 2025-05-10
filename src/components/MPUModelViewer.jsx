import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stage, Loader } from "@react-three/drei";
import { STLLoader } from "three-stdlib";
import * as THREE from "three";
import { onNewLog, getLogs } from "../DataStore";

function getTargetRotation(acc) {
  const threshold = 7; // minimum to consider a strong direction

  if (acc.x > threshold) return { x: 0, y: 0, z: 0 }; // upright
  if (acc.x < -threshold) return { x: Math.PI, y: 0, z: 0 }; // upside down

  if (acc.y > threshold) return { x: 0, y: 0, z: -Math.PI / 2 }; // +Y up
  if (acc.y < -threshold) return { x: 0, y: 0, z: Math.PI / 2 }; // -Y up

  if (acc.z > threshold) return { x: -Math.PI / 2, y: 0, z: 0 }; // +Z up
  if (acc.z < -threshold) return { x: Math.PI / 2, y: 0, z: 0 }; // -Z up

  // default fallback (no strong orientation)
  return { x: 0, y: 0, z: 0 };
}

function MPUModel({ targetRotation }) {
  const meshRef = useRef();
  const geometry = useLoader(STLLoader, "/cansat_casing.STL");

  const currentRotation = useRef(new THREE.Euler(0, 0, 0));

  useFrame(() => {
    if (meshRef.current) {
      currentRotation.current.x = THREE.MathUtils.lerp(
        currentRotation.current.x,
        targetRotation.x,
        0.1
      );
      currentRotation.current.y = THREE.MathUtils.lerp(
        currentRotation.current.y,
        targetRotation.y,
        0.1
      );
      currentRotation.current.z = THREE.MathUtils.lerp(
        currentRotation.current.z,
        targetRotation.z,
        0.1
      );

      meshRef.current.rotation.set(
        currentRotation.current.x,
        currentRotation.current.y,
        currentRotation.current.z
      );
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={meshRef} geometry={geometry} scale={0.02}>
        <meshStandardMaterial color="orange" />
      </mesh>
    </group>
  );
}

export default function MPUModelViewer() {
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const logs = getLogs();
    if (logs.length > 0 && logs[logs.length - 1].MPU6050) {
      const { accX, accY, accZ } = logs[logs.length - 1].MPU6050;
      const acc = { x: accX || 0, y: accY || 0, z: accZ || 0 };
      setAcceleration(acc);
      setRotation(getTargetRotation(acc));
    }

    onNewLog((entry) => {
      if (entry.MPU6050) {
        const { accX, accY, accZ } = entry.MPU6050;
        const acc = { x: accX || 0, y: accY || 0, z: accZ || 0 };
        setAcceleration(acc);
        setRotation(getTargetRotation(acc));
      }
    });
  }, []);

  return (
    <div className="bg-gray-900 rounded-xl p-4 shadow-lg w-full">
      <h2 className="text-xl font-semibold mb-2 text-white">3D Model & Acceleration</h2>
      <div className="h-80 rounded overflow-hidden">
        <Canvas camera={{ position: [3, 3, 3], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <Stage intensity={0.5} environment="city" adjustCamera={false}>
            <MPUModel targetRotation={rotation} />
          </Stage>
          <OrbitControls enableZoom={false} enablePan={false} target={[0, 0, 0]} makeDefault />
        </Canvas>
      </div>
      <div className="mt-2 text-sm text-gray-300 space-y-1">
        <p>
    <strong>Acceleration:</strong> X: {acceleration.x.toFixed(2)} m/s²,&nbsp;
    Y: {acceleration.y.toFixed(2)} m/s²,&nbsp;
    Z: {acceleration.z.toFixed(2)} m/s²
  </p>
  <p>
    <strong>Axis Up:</strong> {(() => {
      const threshold = 7;
      const { x, y, z } = acceleration;

      if (x > threshold) return "+X";
      if (x < -threshold) return "-X";
      if (y > threshold) return "+Y";
      if (y < -threshold) return "-Y";
      if (z > threshold) return "+Z";
      if (z < -threshold) return "-Z";
      return "Undetermined";
    })()}
  </p>
      </div>
      <Loader />
    </div>
  );
}
