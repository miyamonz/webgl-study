import shaderDef from "./shader/simulation-def.frag";
import shaderPos from "./shader/simulation-pos.frag";
import shaderVel from "./shader/simulation-vel.frag";

const initArrayData = (dataPos, dataVel, dataDef) => {
  const posArray = dataPos.image.data;
  const velArray = dataVel.image.data;
  const defArray = dataDef.image.data;

  for (let i = 0; i < posArray.length; i += 4) {
    const phi = Math.random() * 2 * Math.PI;
    const theta = Math.random() * Math.PI;
    const r = 0.8 + Math.random() * 2;

    defArray[i + 0] = posArray[i + 0] = r * Math.sin(theta) * Math.cos(phi);
    defArray[i + 1] = posArray[i + 1] = r * Math.sin(theta) * Math.sin(phi);
    defArray[i + 2] = posArray[i + 2] = r * Math.cos(theta);

    velArray[i + 3] = Math.random() * 100; // frames life
  }
};
const setVelUniforms = velUniforms => {
  velUniforms.timer = { value: 0.0 };
  velUniforms.delta = { value: 0.0 };
  velUniforms.speed = { value: 0.5 };
  velUniforms.factor = { value: 0.5 };
  velUniforms.evolution = { value: 0.5 };
  velUniforms.radius = { value: 2.0 };
};

export default class Simulation {
  constructor(renderer, size) {
    Object.assign(this, { renderer, size });
    this.init();
  }

  init() {
    this.gpuCompute = new GPUComputationRenderer(
      this.size,
      this.size,
      this.renderer
    );

    const dataPos = this.gpuCompute.createTexture();
    const dataVel = this.gpuCompute.createTexture();
    const dataDef = this.gpuCompute.createTexture();

    initArrayData(dataPos, dataVel, dataDef);

    this.def = this.gpuCompute.addVariable("defTex", shaderDef, dataDef);
    this.vel = this.gpuCompute.addVariable("velTex", shaderVel, dataVel);
    this.pos = this.gpuCompute.addVariable("posTex", shaderPos, dataPos);

    let dependencies = [this.pos, this.vel, this.def];
    this.gpuCompute.setVariableDependencies(this.def, dependencies);
    this.gpuCompute.setVariableDependencies(this.vel, dependencies);
    this.gpuCompute.setVariableDependencies(this.pos, dependencies);

    let velUniforms = this.vel.material.uniforms;
    setVelUniforms(velUniforms);
    this.velUniforms = velUniforms;

    const error = this.gpuCompute.init();
    if (error !== null) {
      console.error(error);
    }
  }

  getPosMap() {
    return this.gpuCompute.getCurrentRenderTarget(this.pos).texture;
  }
  getVelMap() {
    return this.gpuCompute.getCurrentRenderTarget(this.vel).texture;
  }
  setTime(time, delta) {
    this.velUniforms.timer.value = time;
    this.velUniforms.delta.value = delta;
  }
}
