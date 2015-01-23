# gl-shader-output

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

A helper module for unit testing shaders and comparing the result of `gl_FragColor` on a 1x1 WebGL canvas. 

Example: 

```js
var ShaderOutput = require('gl-shader-output')

//your shader, could be a simple glsl-shader-core object
var glslify = require('glslify')
var shader = glslify({
    vertex: [
        'attribute vec2 position;',
        'void main() {',
          'gl_Position = vec4(position, 1.0, 1.0);',
        '}'
    ].join('\n')
    fragment: [
        'precision mediump float;',
        'uniform float green;',
        'void main() {',
            'gl_FragColor = vec4(0.0, green, 0.0, 1.0);',
        '}'
    ].join('\n')
})

//get a draw function for our test
var draw = ShaderOutput({
    shader: shader
})

//returns the frag color as [R, G, B, A]
var color = draw()

//we could also set uniforms before rendering
var color2 = draw({ green: 0.5 })

//due to precision loss, you may want to use a fuzzy equality check
var epsilon = 0.01
var almostEqual = require('array-almost-equal')
almostEqual(color2, [0.0, 0.5, 0.0, 1.0], epsilon)
```

## Usage

[![NPM](https://nodei.co/npm/gl-shader-output.png)](https://www.npmjs.com/package/gl-shader-output)

#### `draw = ShaderOutput(opt)`

Takes the following options, and returns a `draw` function.

- `shader` the shader object or function (required)
- `gl` the gl state to re-use, expected to hold a 1x1 canvas (creates a new one if not specified)
- [webgl-context](https://www.npmjs.com/package/webgl-context) options such as `alpha` and `premultipliedAlpha`

The draw function has the following signature:

```js
var fragColor = draw([uniforms])
```

Where `uniforms` is an optional map of uniform names to values (such as `[x, y]` array for vec2), applied before rendering.

The return value is the gl_FragColor RGBA of the canvas, in floats, such as `[0.5, 1.0, 0.25, 1.0]`.

## License

MIT, see [LICENSE.md](http://github.com/Jam3/gl-shader-output/blob/master/LICENSE.md) for details.
