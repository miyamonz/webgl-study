export default lookAtPos => {
  const light = new THREE.DirectionalLight(0xffaa55);
  light.position.set(-4, -6, 10);
  light.castShadow = true;

  const shadowCamera = light.shadow.camera;
  shadowCamera.lookAt(lookAtPos);

  //prettier-ignore
  light.shadow.matrix.set(
      0.5, 0.0, 0.0, 0.5,
      0.0, 0.5, 0.0, 0.5,
      0.0, 0.0, 0.5, 0.5,
      0.0, 0.0, 0.0, 1.0
    );

  light.shadow.matrix.multiply(shadowCamera.projectionMatrix);
  light.shadow.matrix.multiply(shadowCamera.matrixWorldInverse);

  if (light.shadow.map === null) {
    light.shadow.mapSize.x = 2048;
    light.shadow.mapSize.y = 2048;

    var pars = {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat
    };

    light.shadow.map = new THREE.WebGLRenderTarget(
      light.shadow.mapSize.x,
      light.shadow.mapSize.y,
      pars
    );
    // light.shadow.map.texture.name = light.name + ".shadowMap";
  }
  return light;
};
