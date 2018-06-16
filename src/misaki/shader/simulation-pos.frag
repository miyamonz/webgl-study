void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 tmpPos = texture2D( posTex, uv );
  vec3 pos = tmpPos.xyz;
  vec4 tmpVel = texture2D( velTex, uv );

  float life = tmpVel.a;
  vec3 vel = tmpVel.xyz;

  pos += vel;

  if( life >= 100.0) {
    pos = texture2D( defTex, uv ).xyz;
  }

  gl_FragColor = vec4( pos, 0.0 );
}

