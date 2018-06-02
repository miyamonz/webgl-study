import { create_program, create_shader } from "./util";
import registerVBO from "./registerVBO";
import getMvpMatrix from "./mvpMatrix";

window.onload = function() {
  // canvasエレメントを取得
  var c = document.getElementById("canvas");
  c.width = 500;
  c.height = 500;

  var gl = c.getContext("webgl");
  window.gl = gl;

  //init canvas
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // 頂点シェーダとフラグメントシェーダの生成
  var v_shader = create_shader("vs");
  var f_shader = create_shader("fs");

  // プログラムオブジェクトの生成とリンク
  var prg = create_program(v_shader, f_shader);

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

  //uniform
  var uniLocation = gl.getUniformLocation(prg, "mvpMatrix");
  let mvpMatrix = getMvpMatrix(c.width, c.height);
  gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);

  // モデルの描画
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  // コンテキストの再描画
  gl.flush();
};
