import { useGLTF } from "@react-three/drei";

import React from "react";

const Environement = (props) => {
  const { scene } = useGLTF("/models/doctors_office.glb");
  return <primitive object={scene} {...props} />;
};

export default Environement;
