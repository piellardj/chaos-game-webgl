/**
 * @param hue in [0,1]
 * @return vec3 in [0,1]
 */
function ColorFromHue(hue: number): number [] {
    let r = 0;
    let g = 0;
    let b = 0;

    hue = (hue %  1) * 6;

    if (hue < 1) {
        r = 1;
        g = hue;
    } else if (hue < 2) {
        r = 2 - hue;
        g = 1;
    } else if (hue < 3) {
        g = 1;
        b = hue - 2;
    } else if (hue < 4) {
        g = 4 - hue;
        b = 1;
    } else if (hue < 5) {
        r = hue - 4;
        b = 1;
    } else if (hue < 6) {
        r = 1;
        b = 6 - hue;
    }

    return [r, g, b];
}

export default ColorFromHue;