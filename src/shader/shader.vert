precision mediump float;

attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;

uniform   mat4 mMatrix;
uniform   mat4 mMatrixRT;
uniform   mat4 pvmMatrix;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vColor;


void main(void){
  vec4 pos4 = vec4(position, 1.);
  vec4 nor4 = vec4(normal, 1.);
  vPosition = (mMatrix * pos4).xyz;
  vNormal = (mMatrixRT * nor4).xyz;
  vColor  = color; 
  gl_Position = pvmMatrix * pos4;
}
