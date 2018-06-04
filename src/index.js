import vert from "./shader/shader.vert";
import frag from "./shader/shader.frag";
import { create_program, create_shader, create_ibo } from "./util";
import registerVBO from "./registerVBO";
import startLoop from "./loop";

import torus from "./torus";
let prependVBO = prg => {
  let [positions, normals, colors, index] = torus(64, 64, 1, 3);

  registerVBO(prg, positions, 3, "position");
  registerVBO(prg, normals, 3, "normal");
  registerVBO(prg, colors, 4, "color");

  let ibo = create_ibo(index);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

  return index.length;
};

window.onload = function() {
  // canvasエレメントを取得
  var c = document.getElementById("canvas");
  c.width = 500;
  c.height = 500;
  let size = {
    width: c.width,
    height: c.height
  };

  let gl = c.getContext("webgl");
  window.gl = gl;

  let { vert: v_shader, frag: f_shader } = create_shader({ frag, vert });
  var prg = create_program(v_shader, f_shader);

  let len = prependVBO(prg);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.CULL_FACE);

  startLoop(gl, prg, size, len);
};
