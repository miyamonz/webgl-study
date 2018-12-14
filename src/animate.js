import { getPV } from "./mvpMatrix";
import { Mat4, Color } from "ogl";

const initCanvas = gl => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

export const uniforms = {
  mvpMatrix: { value: new Mat4() },
  mMatrix: { value: new Mat4() },
  ambientColor: { value: new Color([0.1, 0.1, 0.1, 1]) },
  lightPosition: { value: [1, 0, 0] },
  eyeDirection: { value: [0, 10, 20] }
};

export default (gl, program, draw) => {
  const { uniforms } = program;
  const { width, height } = gl.renderer;
  const pv = getPV(width, height);
  const setMat = v => (uniforms.mvpMatrix.value = v);
  const setModel = v => (uniforms.mMatrix.value = v);
  const setAmbient = v => (uniforms.ambientColor.value = v);
  const setLight = v => (uniforms.lightPosition.value = v);
  const setEye = v => (uniforms.eyeDirection.value = v);

  const drawWithMat = mat => {
    setMat(mat);
    draw();
  };

  const tick = ({ time, count }) => {
    initCanvas(gl);

    setEye([0, 10, 20]);
    const t = count / 40;
    const pos = [3 * Math.cos(t), 3 * Math.sin(t), 0];

    setLight([10 * Math.cos(t), 10 * Math.sin(t), 0]);
    setAmbient([0.1, 0.1, 0.1, 1]);

    //prettier-ignore
    const vecs = [
      [0, 0, 0], 
      pos
    ];

    vecs
      .map(pos =>
        new Mat4()
          .rotateY(t)
          .translate([3, 0, 0])
          .rotateX(3.14 / 2)
      )
      .forEach(model => {
        setModel(model);
        drawWithMat(new Mat4(pv).multiply(model));
      });

    setModel(new Mat4());
    drawWithMat(pv);
    gl.flush();
  };
  return tick;
};
