import { Mat4 } from "ogl";
import { lookAt } from "ogl/src/math/functions/Mat4Func.js";

export function getPV(width, height) {
  const vMatrix = new Mat4();

  // ビュー座標変換行列
  const eye = [0.0, 0.0, 20.0];
  const center = [0, 0, 0];
  const up = [0, 1, 0];

  lookAt(vMatrix, eye, center, up);

  // プロジェクション座標変換行列
  const fov = (45 * Math.PI) / 180;
  const aspect = width / height;
  const near = 0.1;
  const far = 100;
  const pMatrix = new Mat4();
  pMatrix.fromPerspective({ fov, aspect, near, far });

  return pMatrix.multiply(vMatrix);
}
