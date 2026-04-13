"use client";

import {
  Environment,
  PerspectiveCamera,
  RenderTexture,
  Text,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const LiquidPlane = ({ isHovered }: { isHovered: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const { viewport, pointer } = useThree();

  // Uniforms for the shader
  const uniforms = useMemo(
    () => ({
      uMouse: { value: new THREE.Vector2(0, 0) },
      uRadius: { value: 8.5 }, // Spread area
      uStrength: { value: 0.0 },
      uTime: { value: 0.0 }, // Add time for continuous base motion
    }),
    [],
  );

  // Smooth mouse tracking
  const targetMouse = useRef(new THREE.Vector2(0, 0));
  const currentMouse = useRef(new THREE.Vector2(0, 0));
  const targetStrength = useRef(0);

  useFrame((state, delta) => {
    uniforms.uTime.value += delta;

    // Map pointer (-1 to 1) to viewport coordinates
    targetMouse.current.x = (pointer.x * viewport.width) / 2;
    targetMouse.current.y = (pointer.y * viewport.height) / 2;

    // Lerp for smooth magnetic effect
    currentMouse.current.lerp(targetMouse.current, 0.05);

    // Maintain a constant low-level deformation baseline, smoothly fade out if cursor leaves completely
    targetStrength.current = 0.45;
    // Very slow transition to avoid abrupt pop-up effect
    uniforms.uStrength.value +=
      (targetStrength.current - uniforms.uStrength.value) * 0.015;

    if (uniforms.uMouse) {
      uniforms.uMouse.value.copy(currentMouse.current);
    }

    // Make the point light follow the cursor smoothly
    if (lightRef.current) {
      lightRef.current.position.x = currentMouse.current.x;
      lightRef.current.position.y = currentMouse.current.y;
      lightRef.current.position.z = 2.0; // Keep light further back for broader illumination
      lightRef.current.intensity = 0.2;
    }
  });

  const onBeforeCompile = (shader: any) => {
    shader.uniforms.uMouse = uniforms.uMouse;
    shader.uniforms.uRadius = uniforms.uRadius;
    shader.uniforms.uStrength = uniforms.uStrength;
    shader.uniforms.uTime = uniforms.uTime;

    // Inject uniforms and displacement function
    shader.vertexShader =
      `
      uniform vec2 uMouse;
      uniform float uRadius;
      uniform float uStrength;
      uniform float uTime;
      varying float vFocus;

      // Continuous base motion to make the surface feel alive
      float getBaseMotion(vec2 pos, float time) {
        float wave1 = sin(pos.x * 0.2 + time * 0.4) * cos(pos.y * 0.2 + time * 0.3) * 0.12;
        float wave2 = sin(pos.x * 0.1 - time * 0.2) * cos(pos.y * 0.15 + time * 0.25) * 0.15;
        return wave1 + wave2;
      }

      vec3 getDisplacedPosition(vec3 pos) {
        float dist = distance(pos.xy, uMouse);
        float focus = exp(-(dist * dist) / (2.0 * (uRadius * 0.22) * (uRadius * 0.22)));

        // Base motion (always active)
        float baseZ = getBaseMotion(pos.xy, uTime);

        // Combine a broad base with a sharp peak for the magnetic pull
        float baseSigma = uRadius * 0.7;

        float base = exp(-(dist * dist) / (2.0 * baseSigma * baseSigma));
        float centerLift = pow(focus, 1.2);

        float z = baseZ + base * uStrength * 0.4 + centerLift * uStrength * 0.55;

        float directionalBoost = smoothstep(0.0, 1.0, focus) * 0.3;
        z += directionalBoost;

        vec2 dir = normalize(uMouse - pos.xy);
        float influence = smoothstep(uRadius, 0.0, dist);

        float tension = pow(influence, 1.5);

        float centerLock = 1.0 - focus;

        vec2 flow = dir * tension * uStrength * 0.22 * centerLock;

        return vec3(
          pos.x + flow.x,
          pos.y + flow.y,
          pos.z + z
        );
      }
    ` + shader.vertexShader;

    // Recalculate normals for proper lighting on the displaced surface
    shader.vertexShader = shader.vertexShader.replace(
      "#include <beginnormal_vertex>",
      `
      vec3 pos = position;
      vec3 displaced = getDisplacedPosition(pos);

      // Calculate neighboring points to compute the new normal
      float offset = 0.01;
      vec3 pX = getDisplacedPosition(pos + vec3(offset, 0.0, 0.0));
      vec3 pY = getDisplacedPosition(pos + vec3(0.0, offset, 0.0));

      vec3 objectNormal = normalize(cross(pX - displaced, pY - displaced));
      `,
    );

    // Apply displacement
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `
      vec3 transformed = displaced;
      float distToMouse = distance(position.xy, uMouse);
      vFocus = exp(-(distToMouse * distToMouse) / (2.0 * (uRadius * 0.22) * (uRadius * 0.22)));
      `,
    );

    shader.fragmentShader =
      `
      uniform float uTime;
      varying float vFocus;
    ` + shader.fragmentShader;

    shader.fragmentShader = shader.fragmentShader.replace(
      "gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
      `
      vec3 focusedLight = outgoingLight + vec3(0.1, 0.18, 0.3) * vFocus;
      gl_FragColor = vec4( focusedLight, diffuseColor.a );
      `,
    );
  };

  return (
    <>
      <pointLight
        ref={lightRef}
        position={[0, 0, 1]}
        intensity={0.05}
        color="#60a5fa"
        distance={15}
        decay={2}
      />
      {/* Tilt the plane slightly to make the 3D bump more visible, and oversize it to hide edges */}
      <mesh ref={meshRef} rotation={[0, 0, 0]}>
        <planeGeometry
          args={[viewport.width * 1.5, viewport.height * 1.5, 192, 192]}
        />
        <meshStandardMaterial
          ref={materialRef}
          color="#ffffff" // White so the texture colors show properly
          metalness={0.7}
          roughness={0.38}
          onBeforeCompile={onBeforeCompile}
        >
          <RenderTexture attach="map" anisotropy={16}>
            <PerspectiveCamera
              makeDefault
              manual
              aspect={viewport.width / viewport.height}
              position={[0, 0, 5]}
            />
            <color attach="background" args={["#0f172a"]} />
            <ambientLight intensity={1.0} />
            <Text
              position={[0, 0.3, 0]}
              fontSize={0.4}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
              textAlign="center"
              maxWidth={viewport.width * 0.8}
              lineHeight={1.2}
            >
              Ready for Premium{"\n"}Atmospheric Precision?
            </Text>
            <Text
              position={[0, -0.3, 0]}
              fontSize={0.16}
              color="#94a3b8"
              anchorX="center"
              anchorY="middle"
              maxWidth={viewport.width * 0.6}
              textAlign="center"
              lineHeight={1.5}
            >
              Join 2,500+ architecture firms and intelligence networks scaling
              with Lumina AI.
            </Text>
          </RenderTexture>
        </meshStandardMaterial>
      </mesh>
    </>
  );
};

export default function MagneticLiquidBackground() {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fallback for mobile devices to save performance
  if (isMobile) {
    return <div className="absolute inset-0 bg-slate-900" />;
  }

  return (
    <div
      className="absolute inset-0 z-0 pointer-events-auto"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} />
        <Environment preset="city" />
        <LiquidPlane isHovered={isHovered} />
      </Canvas>
    </div>
  );
}
