import { create_program, create_shader } from "./util";
import registerVBO from "./registerVBO";
import startLoop from "./loop";
let prependVBO = prg => {
  // prettier-ignore
  var positions = [
    0.0, 1.0, 0.0, 
    1.0, 0.0, 0.0, 
    -1.0, 0.0, 0.0
  ];
  registerVBO(prg, positions, 3, "position");

  // prettier-ignore
  var colors = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
  ];
  registerVBO(prg, colors, 4, "color");
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

  prependVBO(prg);
  startLoop(gl, prg, size);
};
