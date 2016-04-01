# gl-shader-output

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

![img](http://i.imgur.com/bROGMVq.png)

A helper module for unit testing shaders and comparing the result of `gl_FragColor` from a 1x1 WebGL canvas. See [glsl-hsl2rgb](https://github.com/Jam3/glsl-hsl2rgb) for a practical example.

Example:

```js
var createShaderOutput = require('gl-shader-output');

// Fragment shader source, or a gl-shader instance
var fragShader = [
    'precision mediump float;',
    'uniform float green;',
    'void main() {',
        'gl_FragColor = vec4(0.0, green, 0.0, 1.0);',
    '}'
].join('\n');

// get a draw function for our test
var draw = createShaderOutput(fragShader);

// returns the frag color as [R, G, B, A]
var color = draw();

// we could also set uniforms before rendering
var color2 = draw({ green: 0.5 });

// due to precision loss, you may want to use a fuzzy equality check
var epsilon = 0.01;
var almostEqual = require('array-almost-equal');
almostEqual(color2, [0.0, 0.5, 0.0, 1.0], epsilon);
```

You can use this with tools like [smokestack](https://github.com/hughsk/smokestack) for test-driven GLSL development.

## Usage

[![NPM](https://nodei.co/npm/gl-shader-output.png)](https://www.npmjs.com/package/gl-shader-output)

#### `draw = createShaderOutput(shader, [opt])`

Takes a `shader` with optional `opt` settings and returns a `draw` function.

Where `shader` can be one of the following:

- A GLSL String, which is used as the fragment shader
- An instance of [`gl-shader`](https://github.com/stackgl/gl-shader)
- A function with the signature `fn(gl)`, which returns a new gl-shader instance


Options:

- `gl` the WebGL context – defaults to `shader.gl` if an instance is passed, otherwise constructs a new context
- `width` the width of gl context, by default `1`
- `height` the height of gl context, by default `1`
- `float` whether to use floating point values, default `true` (requires an extension)

Also supports [webgl-context](https://www.npmjs.com/package/webgl-context) options such as `alpha` and `premultipliedAlpha`.

The returned function has the following signature:

#### `color = draw([uniforms])`

Where `uniforms` is an optional map of uniform names to values (such as `[x, y]` array for vec2), applied before rendering.

The return value is the gl_FragColor RGBA of the canvas, in floats, such as `[0.5, 1.0, 0.25, 1.0]`.

## License

MIT, see [LICENSE.md](http://github.com/Jam3/gl-shader-output/blob/master/LICENSE.md) for details.
