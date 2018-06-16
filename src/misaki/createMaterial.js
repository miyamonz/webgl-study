import particlesVert from "../shader/particles.vert";
import particlesFrag from "../shader/particles.frag";
import particlesShadow from "../shader/particles-shadow.frag";

const getDefaultUniforms = (size, scale, light) => {
  return {
    posMap: { type: "t" },
    velMap: { type: "t" },
    size: { type: "f", value: size },

    timer: { type: "f", value: 0 },
    boxScale: {
      type: "v3",
      value: new THREE.Vector3(scale.x, scale.y, scale.z)
    },
    meshScale: { type: "f", value: 0.7 },

    // Line 217 in https://github.com/mrdoob/three.js/blob/dev/src/renderers/webgl/WebGLShadowMap.js
    shadowMatrix: { type: "m4", value: light.shadow.matrix },
    lightPosition: { type: "v3", value: light.position }
  };
};
export const createMaterial = ({ size, scale, light }) => {
  const defaultUniforms = getDefaultUniforms(size, scale, light);
  //prettier-ignore
  const uniforms = Object.assign(defaultUniforms, {
    shadowMap:     { type: "t",  value: light.shadow.map },
    shadowMapSize: { type: "v2", value: light.shadow.mapSize },
    shadowBias:    { type: "f",  value: light.shadow.bias },
    shadowRadius:  { type: "f",  value: light.shadow.radius }
  });

  const param = Object.assign({
    uniforms,
    vertexShader: particlesVert,
    fragmentShader: particlesFrag,
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading
  });
  return new THREE.ShaderMaterial(param);
};

export const createShadowMaterial = ({ size, scale, light }) => {
  const uniforms = getDefaultUniforms(size, scale, light);
  const param = {
    uniforms,
    vertexShader: particlesVert,
    fragmentShader: particlesShadow,
    side: THREE.DoubleSide
  };
  return new THREE.ShaderMaterial(param);
};
