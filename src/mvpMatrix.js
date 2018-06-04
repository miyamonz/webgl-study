import matIV from "./minMatrix";
var m = new matIV();

export function identity() {
  return m.identity(m.create());
}
export function multiply(mat0, mat1) {
  let ret = m.create();
  m.multiply(mat0, mat1, ret);
  return ret;
}
export function translate(mat, vec) {
  let ret = m.create();
  m.translate(mat, vec, ret);
  return ret;
}
export function rotate(mat, angle, axis) {
  let ret = m.create();
  m.rotate(mat, angle, axis, ret);
  return ret;
}
export function inverse(mat, angle, axis) {
  let ret = m.create();
  m.inverse(mat, ret);
  return ret;
}

export function getModel(pos) {
  let mat = m.identity(m.create());
  return translate(mat, pos);
}

export function getPV({ width, height }) {
  let vMatrix = m.identity(m.create());
  let pMatrix = m.identity(m.create());
  let ret = m.identity(m.create());

  // ビュー座標変換行列
  m.lookAt([0.0, 10.0, 20.0], [0, 0, 0], [0, 1, 0], vMatrix);

  // プロジェクション座標変換行列
  m.perspective(45, width / height, 0.1, 100, pMatrix);

  return multiply(pMatrix, vMatrix);
}
