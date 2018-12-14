import vert from "./shader/shader.vert";
import frag from "./shader/shader.frag";
import { create_program, create_shader, create_ibo } from "./util";
import registerVBO from "./registerVBO";
import startLoop from "./loop";

import torus from "./torus";
import sphere from "./sphere";
let prependVBO = prg => {
  // const [positions, normals, colors, index] = torus(4, 4, 1, 3);
  const [positions, normals, colors, index] = sphere(64, 64, 2.0);

  registerVBO(prg, positions, 3, "position");
  registerVBO(prg, normals, 3, "normal");
  registerVBO(prg, colors, 4, "color");

  const ibo = create_ibo(index);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

  return index.length;
};

window.onload = function() {
  // canvasエレメントを取得
  const canvas = document.getElementById("canvas");
  const width = 500;
  const height = 500;
  Object.assign(canvas, { width, height });

  const gl = canvas.getContext("webgl");
  window.gl = gl;

  const { vert: v_shader, frag: f_shader } = create_shader({ frag, vert });
  const prg = create_program(v_shader, f_shader);

  const len = prependVBO(prg);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.CULL_FACE);

  startLoop(gl, prg, { width, height }, len);
};
