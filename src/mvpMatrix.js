import { Mat4 } from "ogl";
import { lookAt } from "ogl/src/math/functions/Mat4Func.js";

export function transpose(mat) {
  if (mat instanceof Mat4) {
    const out = new Mat4();
    //prettier-ignore
    out.set(
      mat[0], mat[4], mat[8], mat[12],
      mat[1], mat[5], mat[9], mat[13],
      mat[2], mat[6], mat[10], mat[14],
      mat[3], mat[7], mat[11], mat[15],
    );
    return out;
  }
}
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
