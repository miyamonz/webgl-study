import registerVBO from "./registerVBO";
import { create_ibo } from "./util";

import sphere from "./sphere";

let prependVBO = (gl, prg) => {
  // const [positions, normals, colors, index] = torus(4, 4, 1, 3);
  const [positions, normals, colors, index] = sphere(64, 64, 2.0);

  registerVBO(gl, prg, positions, 3, "position");
  registerVBO(gl, prg, normals, 3, "normal");
  registerVBO(gl, prg, colors, 4, "color");

  const ibo = create_ibo(gl, index);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

  return index.length;
};

export const prependGeometry = (gl, oglProgram) => {
  const len = prependVBO(gl, oglProgram.program);
  return {
    draw: () => {
      oglProgram.use();
      // gl.drawArrays(gl.TRIANGLES, 0, 3);
      // インデックスを用いた描画命令
      gl.drawElements(gl.TRIANGLES, len, gl.UNSIGNED_SHORT, 0);
    }
  };
};
