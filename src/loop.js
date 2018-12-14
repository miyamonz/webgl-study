import { getPV } from "./mvpMatrix";
import { Mat4 } from "ogl";

const initCanvas = gl => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

const makeUniformFunc = (prg, name, num) => pos => {
  const loc = gl.getUniformLocation(prg, name);
  switch (num) {
    case 2:
      return gl.uniform2fv(loc, pos);
    case 3:
      return gl.uniform3fv(loc, pos);
    case 4:
      return gl.uniform4fv(loc, pos);
  }
};
const makeUniformMatFunc = (prg, name) => mat => {
  const loc = gl.getUniformLocation(prg, name);
  return gl.uniformMatrix4fv(loc, false, mat);
};

export default (gl, prg, size, indexLength) => {
  const pv = getPV(size);
  const setMat = makeUniformMatFunc(prg, "mvpMatrix");
  const setModel = makeUniformMatFunc(prg, "mMatrix");
  const setAmbient = makeUniformFunc(prg, "ambientColor", 4);
  const drawWithMat = mat => {
    setMat(mat);
    // gl.drawArrays(gl.TRIANGLES, 0, 3);
    // インデックスを用いた描画命令
    gl.drawElements(gl.TRIANGLES, indexLength, gl.UNSIGNED_SHORT, 0);
  };
  const setLight = makeUniformFunc(prg, "lightPosition", 3);
  const setEye = makeUniformFunc(prg, "eyeDirection", 3);

  let count = 0;

  const loop = () => {
    initCanvas(gl);

    setEye([0, 10, 20]);
    const t = count / 40;
    const pos = [3 * Math.cos(t), 3 * Math.sin(t), 0];

    setLight([10 * Math.cos(t), 10 * Math.sin(t), 0]);
    setAmbient([0.1, 0.1, 0.1, 1]);

    //prettier-ignore
    const vecs = [
      [0, 0, 0], 
      pos
    ];

    vecs
      .map(pos =>
        new Mat4()
          .rotateY(t)
          .translate([3, 0, 0])
          .rotateX(3.14 / 2)
      )
      .forEach(model => {
        setModel(model);
        drawWithMat(new Mat4(pv).multiply(model));
      });

    setModel(new Mat4());
    drawWithMat(pv);
    gl.flush();

    count++;
    requestAnimationFrame(loop);
  };
  loop();
};
