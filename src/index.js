import { Renderer } from "ogl";
import vert from "./shader/shader.vert";
import frag from "./shader/shader.frag";
import { createProgramFromShaderText, create_ibo } from "./util";
import registerVBO from "./registerVBO";
import startLoop from "./loop";

import torus from "./torus";
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

window.onload = function() {
  // canvasエレメントを取得
  const canvas = document.getElementById("canvas");
  const width = 500;
  const height = 500;
  Object.assign(canvas, { width, height });

  const renderer = new Renderer({ canvas, width, height });
  const gl = renderer.gl;

  renderer.setDepthFunc(gl.LEQUAL);
  //ProgramにcullFaceがあれば自動でなる
  renderer.enable(gl.CULL_FACE);

  const prg = createProgramFromShaderText(gl, { frag, vert });
  const len = prependVBO(gl, prg);

  startLoop(gl, prg, { width, height }, len);
};
