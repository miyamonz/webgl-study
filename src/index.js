import { Renderer, Program } from "ogl";
import vertex from "./shader/shader.vert";
import fragment from "./shader/shader.frag";
import { prependGeometry } from "./program";
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

  const prg = new Program(gl, {
    vertex,
    fragment,
    uniforms
  });

  const { draw } = prependGeometry(gl, prg);

  const tick = createAnimate(gl, prg, draw);
  loop(tick);
};
