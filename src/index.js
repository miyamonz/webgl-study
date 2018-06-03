import { create_program, create_shader, create_ibo } from "./util";
import registerVBO from "./registerVBO";
import startLoop from "./loop";

import torus from "./torus";
let prependVBO = prg => {
  let [positions, colors, index] = torus(32, 32, 1, 3);

  registerVBO(prg, positions, 3, "position");
  registerVBO(prg, colors, 4, "color");

  let ibo = create_ibo(index);
  // IBOをバインドして登録する
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

  var v_shader = create_shader("vs");
  var f_shader = create_shader("fs");
  var prg = create_program(v_shader, f_shader);

  let len = prependVBO(prg);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.CULL_FACE);

  startLoop(gl, prg, size, len);
};
