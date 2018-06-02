import { create_vbo, create_program, create_shader } from "./util";
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

  // attributeの要素数(この場合は xyz の3要素)
  var attStride = 3;

  // prettier-ignore
  // モデル(頂点)データ
  var vertex_position = [
    0.0, 1.0, 0.0, 
    1.0, 0.0, 0.0, 
    -1.0, 0.0, 0.0
  ];

  //vbo
  // VBOの生成とbind
  var vbo = create_vbo(vertex_position);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

  // attributeLocationの取得
  var attLocation = gl.getAttribLocation(prg, "position");
  // attribute属性を有効 & 登録
  gl.enableVertexAttribArray(attLocation);
  gl.vertexAttribPointer(attLocation, attStride, gl.FLOAT, false, 0, 0);

  //uniform
  // uniformLocationの取得
  // uniformLocationへ座標変換行列を登録
  var uniLocation = gl.getUniformLocation(prg, "mvpMatrix");
  let mvpMatrix = getMvpMatrix(c.width, c.height);
  gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);

  // モデルの描画
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  // コンテキストの再描画
  gl.flush();
};
