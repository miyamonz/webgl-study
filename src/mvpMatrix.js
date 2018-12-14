import matIV from "./minMatrix";
import { Mat4 } from "ogl";
var m = new matIV();

export function getPV({ width, height }) {
  const vMatrix = new Mat4();
  const pMatrix = new Mat4();

  // ビュー座標変換行列
  const eye = [0.0, 10.0, 20.0];
  const center = [0, 0, 0];
  const up = [0, 1, 0];

  // vMatrix.lookAt(eye, center, up);
  m.lookAt(eye, center, up, vMatrix);

  // プロジェクション座標変換行列
  m.perspective(45, width / height, 0.1, 100, pMatrix);

  return pMatrix.multiply(vMatrix);
}
