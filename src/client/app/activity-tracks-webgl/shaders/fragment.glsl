#version 300 es
 
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

in float v_intensity;

// we need to declare an output for the fragment shader
out vec4 outColor;
 
void main() {
  float color = clamp(1.0 - log(v_intensity) / 12.0, 0.3, 1.0);

  outColor = vec4(color, color, color, 1.0);

  // outColor = vec4(1.0, 0.0, 0.0, 1.0); // just color all vertices red
}
