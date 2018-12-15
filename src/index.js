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

  const renderer = new Renderer({ width, height, alpha: true });
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
  prg.setBlendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);
  let x;
  window.onmousemove = e => (x = e.clientX / window.innerWidth);

  const { sphere } = geometries(gl, prg);
  const length = sphere.attributes.index.count;
  const draw = () => {
    prg.use();
    // gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.drawElements(gl.TRIANGLES, length, gl.UNSIGNED_SHORT, 0);
  };

  const tick = createAnimate(gl, prg, draw);
  loop(tick);
};
