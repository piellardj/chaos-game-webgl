precision lowp float;

uniform float uAlpha;

void main(void)
{
    gl_FragColor = vec4(uAlpha);
}