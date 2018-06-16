import { createMaterial, createShadowMaterial } from "./createMaterial";
import createGeometry from "./createGeometry";

export default ({ size, light, colorPallete }) => {
  var scale = {
    x: 2,
    y: 3,
    z: 2
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
