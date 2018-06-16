import particlesVert from "../shader/particles.vert";
import particlesFrag from "../shader/particles.frag";
import particlesShadow from "../shader/particles-shadow.frag";

export const createMaterial = ({ size, scale, light }) =>
  new THREE.ShaderMaterial({
    uniforms: {
      posMap: { type: "t" },
      velMap: { type: "t" },
      size: { type: "f", value: size },

      timer: { type: "f", value: 0 },
      boxScale: {
        type: "v3",
        value: new THREE.Vector3(scale.x, scale.y, scale.z)
      },
      meshScale: { type: "f", value: 0.7 },

      shadowMap: { type: "t", value: light.shadow.map },
      shadowMapSize: { type: "v2", value: light.shadow.mapSize },
      shadowBias: { type: "f", value: light.shadow.bias },
      shadowRadius: { type: "f", value: light.shadow.radius },

      // Line 217 in https://github.com/mrdoob/three.js/blob/dev/src/renderers/webgl/WebGLShadowMap.js
      shadowMatrix: { type: "m4", value: light.shadow.matrix },
      lightPosition: { type: "v3", value: light.position }
    },

    vertexShader: particlesVert,
    fragmentShader: particlesFrag,
    side: THREE.DoubleSide,
    shading: THREE.FlatShading
  });

export const createShadowMaterial = ({ size, scale, light }) =>
  new THREE.ShaderMaterial({
    uniforms: {
      posMap: {
        type: "t"
      },
      velMap: {
        type: "t"
      },
      size: { type: "f", value: size },

      timer: { type: "f", value: 0 },
      boxScale: {
        type: "v3",
        value: new THREE.Vector3(scale.x, scale.y, scale.z)
      },
      meshScale: { type: "f", value: 0.7 },

      shadowMatrix: { type: "m4", value: light.shadow.matrix },
      lightPosition: { type: "v3", value: light.position }
    },
    vertexShader: particlesVert,
    fragmentShader: particlesShadow,
    side: THREE.DoubleSide
  });
