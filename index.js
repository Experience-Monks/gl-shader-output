var createGLContext = require('webgl-context')
var xtend = require('xtend')
var assign = require('xtend/mutable')
var Framebuffer = require('gl-fbo')
var Shader = require('gl-shader')


module.exports = function (shader, opt) {
    if (!shader)
        throw new Error('no shader supplied to gl-shader-output')

    opt = xtend({
        width: 1,
        height: 1,
        preserveDrawingBuffer: true,
        float: true
    }, opt)

    var gl = shader.gl || opt.gl || createGLContext(opt)

    //set gl context dims
    gl.canvas.width = opt.width
    gl.canvas.height = opt.height

    //shader can be a function or string
    shader = typeof shader === 'function'
            ? shader(gl)
            : shader

    //create gl-shader, if only fragment shader source
    if (typeof shader === 'string') {
        shader = Shader(gl, '\
            attribute vec2 position;\
            void main() {\
              gl_Position = vec4(position, 1.0, 1.0);\
            }\
        ', shader)
    }

    //micro optimizations
    gl.disable(gl.DEPTH_TEST)
    gl.disable(gl.BLEND)
    gl.disable(gl.CULL_FACE)
    gl.disable(gl.DITHER)
    gl.disable(gl.POLYGON_OFFSET_FILL)
    gl.disable(gl.SAMPLE_COVERAGE)
    gl.disable(gl.SCISSOR_TEST)
    gl.disable(gl.STENCIL_TEST)

    var buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 3, 3, -1]), gl.STATIC_DRAW)
    shader.attributes.position.pointer()

    //try to use floats
    var float = opt.float && gl.getExtension('OES_texture_float')

    //set framebuffer as a main target
    var framebuffer = new Framebuffer(gl, [opt.width, opt.height], {
        float: float,
        depth: false,
        color: 1
    })
    framebuffer.bind()
    shader.bind()

    function render (uniforms) {
        var w = gl.drawingBufferWidth, h = gl.drawingBufferHeight

        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        //if user specifies some uniforms
        if (uniforms) {
            shader.bind()
            assign(shader.uniforms, uniforms)
        }

        //full-screen quad
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        if (float) {
            var pixels = new Float32Array(w * h * 4)
            gl.readPixels(0, 0, w, h, gl.RGBA, gl.FLOAT, pixels)
        }
        else {
            var pixels = new Uint8Array(w * h * 4)
            gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
            pixels = Array.prototype.map.call(pixels, function (p) {
                return p / 255;
            })
        }

        return pixels
    }
    return render
}