import {
  CameraControls,
  Environment,
  Text,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { Avatar } from "./Avatar";
import Environement from "./Environement";


const Dots = (props) => {
  const { loading } = useChat();
  const [loadingText, setLoadingText] = useState("");
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingText((loadingText) => {
          if (loadingText.length > 2) {
            return ".";
          }
          return loadingText + ".";
        });
      }, 800);
      return () => clearInterval(interval);
    } else {
      setLoadingText("");
    }
  }, [loading]);
  if (!loading) return null;
  return (
    <group {...props}>
      <Text fontSize={0.14} anchorX={"left"} anchorY={"bottom"}>
        {loadingText}
        <meshBasicMaterial attach="material" color="black" />
      </Text>
    </group>
  );
};

const OfficeEnvironment = () => {

  return (
    <group>
      <Environement position={[0, 0, -2]} rotation={[0, 0, 0]}/>
    </group>
  );
};

export const Experience = () => {
  const cameraControls = useRef();
  const { cameraZoomed } = useChat();
  const avatarRef = useRef();

  useEffect(() => {
    cameraControls.current.setLookAt(1, 3, 2, 0, 4, 0);
  }, []);

  useEffect(() => {
    if (cameraZoomed) {
      cameraControls.current.setLookAt(-0.40, 2, 1.5, -0.40, 1.5, 0, true);
    } else {
      cameraControls.current.setLookAt(-0.40, 2.2, 5, -0.40, 1.0, 0, true);
    }
  }, [cameraZoomed]);

  useEffect(() => {
    if (avatarRef.current) {
      cameraControls.current.setLookAt(avatarRef.current.position.x - 0.40, avatarRef.current.position.y, avatarRef.current.position.z);
    }
  }, [avatarRef.current]);

  return (
    <>
      <CameraControls
        ref={cameraControls}
        dampingFactor={0.5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(2 * Math.PI) / 4} 
        minDistance={1}
        maxDistance={2}
        dollySpeed={0.5}
        panSpeed={0.5}
      />
      <Environment preset="city" />
      <OfficeEnvironment />
      <Suspense>
        <Dots position-y={1.85} position-x={0.00} />
      </Suspense>
      <Avatar ref={avatarRef} position={[0, 0, 0]}/>
    </>
  );
};
