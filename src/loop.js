import {
  identity,
  multiply,
  translate,
  rotate,
  inverse,
  getModel,
  getPV
} from "./mvpMatrix";

let initCanvas = gl => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

let makeUniformFunc = (prg, name, num) => pos => {
  let loc = gl.getUniformLocation(prg, name);
  switch (num) {
    case 2:
      return gl.uniform2fv(loc, pos);
    case 3:
      return gl.uniform3fv(loc, pos);
    case 4:
      return gl.uniform4fv(loc, pos);
  }
};
let makeUniformMatFunc = (prg, name) => mat => {
  let loc = gl.getUniformLocation(prg, name);
  return gl.uniformMatrix4fv(loc, false, mat);
};

export default (gl, prg, size, indexLength) => {
  let pv = getPV(size);
  let setMat = makeUniformMatFunc(prg, "mvpMatrix");
  let setModel = makeUniformMatFunc(prg, "mMatrix");
  let setAmbient = makeUniformFunc(prg, "ambientColor", 4);
  let drawWithMat = mat => {
    setMat(mat);
    // gl.drawArrays(gl.TRIANGLES, 0, 3);
    // インデックスを用いた描画命令
    gl.drawElements(gl.TRIANGLES, indexLength, gl.UNSIGNED_SHORT, 0);
  };
  let setLight = makeUniformFunc(prg, "lightDirection", 3);

  let count = 0;
  let loop = () => {
    initCanvas(gl);

    let t = count / 40;
    let pos = [3 * Math.cos(t), 3 * Math.sin(t), 0];

    setLight([Math.cos(t), Math.sin(t), 0]);
    setAmbient([0.1, 0.1, 0.1, 1]);

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
      .forEach(model => {
        setModel(model);
        drawWithMat(multiply(pv, model));
      });

    setModel(identity());
    drawWithMat(multiply(identity(), pv));
    gl.flush();

    count++;
    requestAnimationFrame(loop);
  };
  loop();
};
