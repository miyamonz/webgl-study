import { Geometry } from "ogl";
import sphere from "./sphere";

export default function(gl, prg) {
  const [positions, normals, colors, index] = sphere(64, 64, 2.0);
  const geometry = new Geometry(gl, {
    position: { size: 3, data: new Float32Array(positions) },
    normal: { size: 3, data: new Float32Array(normals) },
    color: { size: 4, data: new Float32Array(colors) },
    index: { data: new Uint16Array(index) }
  });
  geometry.bindAttributes(prg);
  return { sphere: geometry };
}
