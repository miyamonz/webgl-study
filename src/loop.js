import { multiply, getModel, getPV } from "./mvpMatrix";

let initCanvas = gl => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

export default (gl, prg, size, indexLength) => {
  let pv = getPV(size);
  let uniLocation = gl.getUniformLocation(prg, "mvpMatrix");
  let drawWithMat = mat => {
    gl.uniformMatrix4fv(uniLocation, false, mat);
    // gl.drawArrays(gl.TRIANGLES, 0, 3);
    // インデックスを用いた描画命令
    gl.drawElements(gl.TRIANGLES, indexLength, gl.UNSIGNED_SHORT, 0);
  };

  let count = 0;
  let loop = () => {
    initCanvas(gl);

    let t = count / 10;
    let pos = [3 * Math.cos(t), 0, 3 * Math.sin(t), 0];

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
