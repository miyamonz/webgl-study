precision mediump float;

uniform   mat4 mMatrix;
uniform   vec3 lightPosition;
uniform   vec3 eyeDirection;
uniform   vec3 ambientColor;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vColor;

vec3 getModeled(vec3 v) {
    return normalize(mMatrix * vec4(v, 1.0)).xyz;
}

void main(void){
  vec3 lightVec = lightPosition - vPosition;
  vec3 gnormal = normalize(vNormal);
  vec3 halfLE = normalize(lightVec + eyeDirection);
  float diffuse  = clamp(dot(gnormal, normalize(lightVec)), 0., 1.0);

  float specular = pow(clamp(dot(gnormal, halfLE), 0.0, 1.0), 50.0);
  vec4 baseColor = vColor * vec4(vec3(diffuse), 1.0); 
  vec4 light     = baseColor + ( vec4(vec3(specular),0.0));
  vec4 destColor = light + vec4(ambientColor,0.0);
    gl_FragColor = destColor; 
}
