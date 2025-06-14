import { CameraControls, Environment, Text } from "@react-three/drei"
import { Suspense, useEffect, useRef, useState } from "react"
import { Avatar } from "./Avatar"
import Environement from "./Environement"
import { Leva } from "leva"
import { UI } from "./UI"

const Dots = (props) => {
  const [loadingText, setLoadingText] = useState("")
  return <group {...props}></group>
}

const OfficeEnvironment = () => {
  return (
    <group>
      <Environement position={[0, 0, -2]} rotation={[0, 0, 0]} />
    </group>
  )
}

export const Experience = () => {
  const cameraControls = useRef()
  const avatarRef = useRef()

  useEffect(() => {
    if (!cameraControls.current) return

    cameraControls.current.setLookAt(0.05, 4.2, 2, -0.1, 4.1, 1, true, 5)

    return () => clearTimeout(timeout)
  }, [cameraControls])

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
        mouseButtons={{
          left: 1,
          middle: 0,
          right: 0,
        }}
      />
      <Environment files="/pine_picnic_1k.hdr" />
      <Suspense>
        <Dots position-y={1.85} position-x={0.0} />
      </Suspense>
      <>
        <Avatar ref={avatarRef} position={[0, 2.5, 1]} />
      </>
      
      <Leva hidden />
    </>
  )
}
