# gl-shader-output

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

![img](http://i.imgur.com/bROGMVq.png)

A helper module for processing rectangular shaders and obtaining the reslut. Can be used for unit testing, audio processing etc. See [glsl-hsl2rgb](https://github.com/Jam3/glsl-hsl2rgb) or [audio-shader](https://github.com/audio-lab/audio-shader) for practical examples.

Example:

```js
var ShaderOutput = require('gl-shader-output')

//get a draw function for our test
var draw = ShaderOutput(`
    precision mediump float;
    uniform float green;
    void main() {
        gl_FragColor = vec4(0.0, green, 0.0, 1.0);
    }
`, {
    width: 1,
    height: 1
});

//returns the frag color as [R, G, B, A]
var color = draw()

//we could also set uniforms before rendering
var color2 = draw({ green: 0.5 })

//due to precision loss, you may want to use a fuzzy equality check
var epsilon = 0.01
var almostEqual = require('array-almost-equal')
almostEqual(color2, [0.0, 0.5, 0.0, 1.0], epsilon)
```

You can use this with tools like [smokestack](https://github.com/hughsk/smokestack) for test-driven GLSL development.

## Usage

[![NPM](https://nodei.co/npm/gl-shader-output.png)](https://www.npmjs.com/package/gl-shader-output)

#### `draw = ShaderOutput(source?, options?)`

Takes a shader object/source and options object, and returns a `draw` function. Possible options:

- `shader` the shader, can be a source of fragment shader, a function that accepts `gl` or an instance of gl-shader. Same as passing shader as the only argument.
- `gl` the gl state to re-use, expected to hold a canvas (creates a new one if not specified, or uses nogl fallback if there is no webgl in environment). Set `null` to force nogl rendering.
- `width` the width of a gl context, if undefined
- `height` the height of a gl context, if undefined
- other [webgl-context](https://www.npmjs.com/package/webgl-context) options such as `alpha` and `premultipliedAlpha`

The draw function has the following signature:

```js
var fragColor = draw([uniforms])
```

Where `uniforms` is an optional map of uniform names to values (such as `[x, y]` array for vec2), applied before rendering.

The return value is the gl_FragColor RGBA of the canvas, in floats, such as `[0.5, 1.0, 0.25, 1.0]`.

## License

MIT, see [LICENSE.md](http://github.com/Jam3/gl-shader-output/blob/master/LICENSE.md) for details.