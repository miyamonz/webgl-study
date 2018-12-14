import { Geometry } from "ogl";
import sphere from "./sphere";

export const prependGeometry = (gl, program) => {
  const [positions, normals, colors, index] = sphere(64, 64, 2.0);
  const geometry = new Geometry(gl, {
    position: { size: 3, data: new Float32Array(positions) },
    normal: { size: 3, data: new Float32Array(normals) },
    color: { size: 4, data: new Float32Array(colors) },
    index: { data: new Uint16Array(index) }
  });
  geometry.bindAttributes(program);

  return {
    draw: () => {
      program.use();
      // gl.drawArrays(gl.TRIANGLES, 0, 3);
      // インデックスを用いた描画命令
      gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);
    }
  };
};
