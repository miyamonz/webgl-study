precision mediump float;

uniform   mat4 mMatrix;
uniform   vec3 lightDirection;
uniform   vec3 eyeDirection;
uniform   vec4 ambientColor;

varying vec3 vNormal;
varying vec4 vColor;

void main(void){
  /* vec3  invLight = normalize(invMatrix * vec4(lightDirection, 0.0)).xyz; */
  vec3 gnormal = normalize(mMatrix * vec4(vNormal,0)).xyz;
  vec3 halfLE = normalize(lightDirection + eyeDirection);
  float diffuse  = clamp(dot(gnormal, lightDirection), 0., 1.0);

  float specular = pow(clamp(dot(gnormal, halfLE), 0.0, 1.0), 50.0);
  vec4 baseColor = vColor * vec4(vec3(diffuse), 1.0); 
  vec4 light     =  + baseColor + ( vec4(vec3(specular),1.0));
  vec4 destColor = light + ambientColor;
    gl_FragColor = destColor;
}
