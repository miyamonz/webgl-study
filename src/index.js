import { create_program, create_shader, create_ibo } from "./util";
import registerVBO from "./registerVBO";
import startLoop from "./loop";
let prependVBO = prg => {
  // prettier-ignore
  let positions = [
    0.0, 1.0, 0.0, 
    1.0, 0.0, 0.0, 
    -1.0, 0.0, 0.0,
    0.0, -1.0, 0.0, 
  ];

  // prettier-ignore
  let colors = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
  ];
  registerVBO(prg, positions, 3, "position");

  // prettier-ignore
  let index = [
    0,1,2,
    1,2,3,
  ]
  registerVBO(prg, colors, 4, "color");

  let ibo = create_ibo(index);
  // IBOをバインドして登録する
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
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
