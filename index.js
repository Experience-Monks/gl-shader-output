/**
 * @module  gl-shader-output
 */

var create = require('webgl-context');
var getPixels = require('canvas-pixels').get3d;
var xtend = require('xtend');
var assign = require('xtend/mutable');
var noGl = require('./nogl');
var Shader = require('gl-shader');
var glExt = require('webglew');
var Framebuffer = require('gl-fbo');


module.exports = function (shader, opt) {
    //resolve incomplete args
    if (!opt) {
        //just options
        if (typeof shader === 'object' && !shader.fragShader) {
            opt = shader;
        }
        //just a shader object
        else {
            opt = {
                shader: shader
            };
        }
    }
    else {
        opt.shader = shader;
    }

    //take over passed shader object opts
    if (opt.shader && opt.shader.fragShader) {
        if (opt.gl === undefined) opt.gl = opt.shader.gl;
    }

    //extend default options
    opt = xtend({
        width: 1,
        height: 1,
        preserveDrawingBuffer: true,
        shader: ''
    }, opt);

    //redefine shader
    shader = opt.shader;

    //try to obtain veritable gl
    var gl = opt.gl === undefined ? create(opt) : opt.gl;

    //if gl is null - use noGL version of renderer
    if (!gl) return noGl(shader, opt);

    //set gl context dims
    gl.canvas.width = opt.width;
    gl.canvas.height = opt.height;

    //check WebGL extensions to support floats
    var glExtensions = glExt(gl);
    if ( !glExtensions.OES_texture_float ){
        console.warn("Available webgl does not support OES_texture_float extension. Using noGL instead.");
        return noGL(shader, opt);
    }
    if ( !glExtensions.OES_texture_float_linear ) {
        console.warn("Available webgl does not support OES_texture_float_linear extension. Using noGL instead.");
        return noGL(shader, opt);
    }


    //ensure shader is created
    if (!shader) {
        throw new Error('No shader supplied to gl-shader-output');
    }
    else if (typeof shader === 'function') {
        shader = shader(gl);
    }

    //create gl-shader, if only fragment shader is passed
    if (typeof shader === 'string') {
        shader = Shader(gl, '\
            attribute vec2 position;\
            void main() {\
              gl_Position = vec4(position, 1.0, 1.0);\
            }\
        ' , shader);
    }

    //as far we process 2d rect
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.DITHER);
    gl.disable(gl.POLYGON_OFFSET_FILL);
    // gl.disable(gl.SAMPLE_ALPHA_COVERAGE);
    // gl.disable(gl.SAMPLE_COVERAGE);
    // gl.disable(gl.SCISSOR_TEST);
    // gl.disable(gl.STENCIL_TEST);


    //create rendering data
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 3, 3, -1]), gl.STATIC_DRAW);
    shader.attributes.position.pointer();

    //set framebuffer as a main target
    var framebuffer = new Framebuffer(gl, [opt.width, opt.height], {
        preferFloat: true,
        // float: true,
        depth: false,
        color: 1
    });
    framebuffer.bind();

    shader.bind();


    function process (uniforms) {
        var w = gl.drawingBufferWidth, h = gl.drawingBufferHeight;

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        //if user specifies some uniforms
        if (uniforms) {
            shader.bind();
            assign(shader.uniforms, uniforms);
        }

        //full-screen quad
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        var result = new Float32Array(w * h * 4);
        gl.readPixels(0, 0, w, h, gl.RGBA, gl.FLOAT, result);

        return result;
    }

    return process;
};
