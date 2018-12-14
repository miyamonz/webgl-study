import { Renderer, Program } from "ogl";
import vertex from "./shader/shader.vert";
import fragment from "./shader/shader.frag";
import geometries from "./geometries";
import loop from "./loop";
import createAnimate, { uniforms } from "./animate";

import torus from "./torus";

window.onload = function() {
  const width = 500;
  const height = 500;

  const renderer = new Renderer({ width, height });
  const gl = renderer.gl;
  document.body.appendChild(gl.canvas);
  //これがないとずれるが、renderer.renderにかえれば必要がなくなるはず
  renderer.setViewport(width, height);

  renderer.setDepthFunc(gl.LEQUAL);

  const prg = new Program(gl, {
    vertex,
    fragment,
    uniforms
  });

  const { sphere } = geometries(gl, prg);
  const length = sphere.attributes.index.count;
  const draw = () => {
    prg.use();
    // gl.drawArrays(gl.TRIANGLES, 0, 3);
    // インデックスを用いた描画命令
    gl.drawElements(gl.TRIANGLES, length, gl.UNSIGNED_SHORT, 0);
  };

  const tick = createAnimate(gl, prg, draw);
  loop(tick);
};
