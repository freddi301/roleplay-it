import {
  EffectComposer,
  DepthOfField,
  Bloom,
  Noise,
  Vignette,
  SSAO,
  Pixelation,
} from "@react-three/postprocessing";
// @ts-ignore
import { BlendFunction } from "postprocessing";

export function PostProcessing() {
  return (
    <EffectComposer>
      <DepthOfField
        focusDistance={0}
        focalLength={0.02}
        bokehScale={2}
        height={480}
      />
      <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
      <Noise opacity={0.02} />
      <Vignette eskil={false} offset={0.1} darkness={0.9} />
      <SSAO
        blendFunction={BlendFunction.MULTIPLY} // blend mode
        samples={30} // amount of samples per pixel (shouldn't be a multiple of the ring count)
        rings={4} // amount of rings in the occlusion sampling pattern
        distanceThreshold={1.0} // global distance threshold at which the occlusion effect starts to fade out. min: 0, max: 1
        distanceFalloff={0.0} // distance falloff. min: 0, max: 1
        rangeThreshold={0.5} // local occlusion range threshold at which the occlusion starts to fade out. min: 0, max: 1
        rangeFalloff={0.1} // occlusion range falloff. min: 0, max: 1
        luminanceInfluence={0.9} // how much the luminance of the scene influences the ambient occlusion
        radius={20} // occlusion sampling radius
        scale={0.5} // scale of the ambient occlusion
        bias={0.5} // occlusion bias
      />
    </EffectComposer>
  );
}

// color grading
// autoexposire
