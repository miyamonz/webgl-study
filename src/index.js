import { Renderer } from "ogl";
import vert from "./shader/shader.vert";
import frag from "./shader/shader.frag";
import createProgram from "./program";
import loop from "./loop";
import createAnimate, { uniforms } from "./animate";

import torus from "./torus";

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

  const prg = createProgram(gl, {
    frag,
    vert,
    uniforms
  });

  const tick = createAnimate(gl, prg);
  loop(tick);
};
