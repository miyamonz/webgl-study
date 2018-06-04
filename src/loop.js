import {
  identity,
  multiply,
  translate,
  rotate,
  getModel,
  getPV
} from "./mvpMatrix";

let initCanvas = gl => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

let makeUniformFunc = (prg, name) => pos => {
  let loc = gl.getUniformLocation(prg, name);
  return gl.uniform3fv(loc, pos);
};
let makeUniformMatFunc = (prg, name) => mat => {
  let loc = gl.getUniformLocation(prg, name);
  return gl.uniformMatrix4fv(loc, false, mat);
};

export default (gl, prg, size, indexLength) => {
  let pv = getPV(size);
  let setMat = makeUniformMatFunc(prg, "mvpMatrix");
  let drawWithMat = mat => {
    setMat(mat);
    // gl.drawArrays(gl.TRIANGLES, 0, 3);
    // インデックスを用いた描画命令
    gl.drawElements(gl.TRIANGLES, indexLength, gl.UNSIGNED_SHORT, 0);
  };
  let setLightDirection = makeUniformFunc(prg, "lightDirection");

  let count = 0;
  let loop = () => {
    initCanvas(gl);

    let t = count / 40;
    let pos = [3 * Math.cos(t), 0, 3 * Math.sin(t)];

    setLightDirection(pos);

    //prettier-ignore
    let vecs = [
      [0, 0, 0], 
      pos
    ];

    vecs
      .map(pos => {
        let mat = identity();
        mat = rotate(mat, t, [0, 1, 0]);
        mat = translate(mat, [3, 0, 0]);
        mat = rotate(mat, 3.14 / 2, [1, 0, 0]);
        return mat;
      })
      .map(model => multiply(pv, model))
      .forEach(drawWithMat);

    drawWithMat(multiply(identity(), pv));
    gl.flush();

    count++;
    requestAnimationFrame(loop);
  };
  loop();
};
