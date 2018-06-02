import { create_program, create_shader } from "./util";
import registerVBO from "./registerVBO";
import { multiply, getModel, getPV } from "./mvpMatrix";

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

let initCanvas = gl => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

let startLoop = (gl, prg, size) => {
  let pv = getPV(size);
  let uniLocation = gl.getUniformLocation(prg, "mvpMatrix");
  let drawWithMat = mat => {
    gl.uniformMatrix4fv(uniLocation, false, mat);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  let count = 0;
  let loop = () => {
    initCanvas(gl);

    let t = count / 10;
    let pos = [Math.cos(t), Math.sin(t), 0];

    //prettier-ignore
    let vecs = [
      [0, 0, 0], 
      pos
    ];

    vecs
      .map(getModel)
      .map(model => multiply(pv, model))
      .forEach(drawWithMat);
    gl.flush();

    count++;
    requestAnimationFrame(loop);
  };
  loop();
};
