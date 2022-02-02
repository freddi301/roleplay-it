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
      {/* <DepthOfField bokehScale={2} /> */}
      <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
      <Noise opacity={0.015} />
      <Vignette eskil={false} offset={0.35} darkness={0.5} />
      {/* <SSAO /> */}
      <ToneMapping />
      <LUT lut={lut} />
    </EffectComposer>
  );
}
