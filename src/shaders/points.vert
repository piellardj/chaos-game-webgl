attribute vec2 aCoords; // {-1,1}x{-1,1}

void main(void)
{
    gl_PointSize = 1.0;
    gl_Position = vec4(aCoords, 0, 1);
}
