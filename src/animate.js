import { getPV, transpose } from "./mvpMatrix";
import { Mat4, Color } from "ogl";

const initCanvas = gl => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

export const uniforms = {
  pvmMatrix: { value: new Mat4() },
  mMatrix: { value: new Mat4() },
  mMatrixIV: { value: new Mat4() },
  ambientColor: { value: new Color([0.1, 0.1, 0.1, 1]) },
  lightPosition: { value: [1, 0, 0] },
  eyeDirection: { value: [0, 0, 20] }
};

export default (gl, program, draw) => {
  const { uniforms } = program;
  const { width, height } = gl.renderer;
  const pv = getPV(width, height);
  const setVPM = (vp, m) => {
    uniforms.mMatrix.value = m;
    uniforms.mMatrixIV.value = transpose(new Mat4(m).inverse());
    uniforms.pvmMatrix.value = new Mat4(pv).multiply(m);
  };
  const setAmbient = v => (uniforms.ambientColor.value = v);
  const setLight = v => (uniforms.lightPosition.value = v);

  const drawPVM = mat => {
    setVPM(pv, mat);
    draw();
  };

  const tick = ({ time, count }) => {
    initCanvas(gl);

    const t = count / 40;
    const pos = [5 * Math.cos(t), 5 * Math.sin(t), 0];

    setLight([100, 0, 0]);
    setAmbient([0.2, 0.2, 0.2, 1]);

    //prettier-ignore
    const vecs = [
      [0, 0, 0], 
      pos
    ];

    vecs
      .map(pos =>
        //prettier-ignore
        new Mat4()
          .rotateY(t)
          .translate(pos)
          .rotateZ(t)
          .rotateX(t)
      )
      .forEach(model => {
        drawPVM(model);
      });

    gl.flush();
  };
  return tick;
};
