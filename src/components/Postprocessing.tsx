import React from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import {
  EffectComposer,
  DepthOfField,
  Bloom,
  Noise,
  Vignette,
  SSAO,
  ToneMapping,
  LUT,
} from "@react-three/postprocessing";
// @ts-ignore
import { LUTCubeLoader } from "postprocessing";

export function PostProcessing() {
  const lut: THREE.Texture = useLoader(LUTCubeLoader, "/django-25.cube");
  return (
    <EffectComposer>
      <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} />
      <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
      <Noise opacity={0.01} />
      <Vignette eskil={false} offset={0.1} darkness={0.9} />
      <SSAO />
      <ToneMapping />
      <LUT lut={lut} />
    </EffectComposer>
  );
}
