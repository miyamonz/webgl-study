import registerVBO from "./registerVBO";
import { createProgramFromShaderText, create_ibo } from "./util";

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

const makeUniformFunc = (gl, prg, name, num) => pos => {
  const loc = gl.getUniformLocation(prg, name);
  switch (num) {
    case 2:
      return gl.uniform2fv(loc, pos);
    case 3:
      return gl.uniform3fv(loc, pos);
    case 4:
      return gl.uniform4fv(loc, pos);
  }
};
const makeUniformMatFunc = (gl, prg, name) => mat => {
  const loc = gl.getUniformLocation(prg, name);
  return gl.uniformMatrix4fv(loc, false, mat);
};
const use = (gl, prg, uniforms) => {
  for ([name, uniform] of Object.entries(uniforms)) {
    const len = uniform.value.length;
    if (len <= 4) makeUniformFunc(gl, prg, name, len)(uniform.value);
    else if (len === 16) makeUniformMatFunc(gl, prg, name)(uniform.value);
  }
};

export default function(gl, { frag, vert, uniforms }) {
  const _program = createProgramFromShaderText(gl, { frag, vert });
  const len = prependVBO(gl, _program);

  const draw = () => {
    use(gl, _program, uniforms);
    // gl.drawArrays(gl.TRIANGLES, 0, 3);
    // インデックスを用いた描画命令
    gl.drawElements(gl.TRIANGLES, length, gl.UNSIGNED_SHORT, 0);
  };
  return {
    program: _program,
    uniforms,
    draw,
    length: len
  };
}
