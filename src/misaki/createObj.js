import { createMaterial, createShadowMaterial } from "./createMaterial";
import createGeometry from "./createGeometry";

export default ({ size, light, colorPallete }) => {
  var scale = {
    x: 1,
    y: 4,
    z: 1
  };

  const param = {
    size,
    scale,
    light
  };
  const material = createMaterial(param);
  const shadowMaterial = createShadowMaterial(param);

  let geometry = createGeometry({ size, colorPallete });
  const mesh = new THREE.Mesh(geometry, material);
  return { mesh, material, shadowMaterial };
};
