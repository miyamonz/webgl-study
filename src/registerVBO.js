import { create_vbo } from "./util";

export default (gl, prg, data, stride, name) => {
  // VBOの生成とbind
  var vbo = create_vbo(gl, data);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

  // attributeLocationの取得
  var attLocation = gl.getAttribLocation(prg, name);
  // attribute属性を有効 & 登録
  gl.enableVertexAttribArray(attLocation);
  gl.vertexAttribPointer(attLocation, stride, gl.FLOAT, false, 0, 0);
};
