attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;

uniform   mat4 mvpMatrix;
uniform   mat4 mMatrix;
uniform   vec3 lightDirection;

varying vec4 vColor;

void main(void){
  /* vec3  invLight = normalize(invMatrix * vec4(lightDirection, 0.0)).xyz; */
  vec3 gnormal = normalize(mMatrix * vec4(normal,0)).xyz;
  float diffuse  = clamp(dot(gnormal, lightDirection), 0.1, 1.0);
  vColor         = color * vec4(vec3(diffuse), 1.0);
  gl_Position    = mvpMatrix * vec4(position, 1.0);
}
