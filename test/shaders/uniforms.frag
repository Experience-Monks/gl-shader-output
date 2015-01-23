precision mediump float;

uniform vec4 u_value;
uniform float multiplier;

void main() {
    gl_FragColor = vec4(u_value.wzyx) * multiplier;
}