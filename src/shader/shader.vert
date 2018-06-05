attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;

uniform   mat4 mvpMatrix;
uniform   mat4 mMatrix;
uniform   vec4 ambientColor;
uniform   vec3 lightDirection;
uniform   vec3 eyeDirection;

varying vec4 vColor;

void main(void){
  /* vec3  invLight = normalize(invMatrix * vec4(lightDirection, 0.0)).xyz; */
  vec3 gnormal = normalize(mMatrix * vec4(normal,0)).xyz;
  vec3 halfLE = normalize(lightDirection + eyeDirection);
  float diffuse  = clamp(dot(gnormal, lightDirection), 0., 1.0);

  float specular = pow(clamp(dot(gnormal, halfLE), 0.0, 1.0), 50.0);
  vec4 baseColor = color * vec4(vec3(diffuse), 1.0); 
  vec4 light =  + baseColor + ( vec4(vec3(specular),1.0));
  vColor         =  light+ ambientColor;
  gl_Position    = mvpMatrix * vec4(position, 1.0);
}
