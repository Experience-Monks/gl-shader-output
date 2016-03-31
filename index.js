var create = require('webgl-context')
var triangle = require('a-big-triangle')
var xtend = require('xtend')
var assign = require('xtend/mutable')
var glExt = require('webglew')
var Framebuffer = require('gl-fbo')

module.exports = function(opt) {
    opt = xtend({
        width: 1,
        height: 1,
        preserveDrawingBuffer: true,
        float: true
    }, opt)

    var gl = opt.shader && opt.shader.gl || opt.gl || create(opt)
    if (!opt.shader)
        throw new Error('no shader supplied to gl-shader-output')

    //set gl context dims
    gl.canvas.width = opt.width
    gl.canvas.height = opt.height

    var shader = typeof opt.shader === 'function'
            ? opt.shader(gl)
            : opt.shader

    //try to use floats
    var float = glExt(gl).OES_texture_float && opt.float

    //set framebuffer as a main target
    var framebuffer = new Framebuffer(gl, [opt.width, opt.height], {
        float: float,
        depth: false,
        color: 1
    })
    framebuffer.bind()
    shader.bind()


    function process(uniforms) {
        var w = gl.drawingBufferWidth, h = gl.drawingBufferHeight

        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        //if user specifies some uniforms
        if (uniforms) {
            shader.bind()
            assign(shader.uniforms, uniforms)
        }

        //full-screen quad
        triangle(gl)

        if (float) {
            var pixels = new Float32Array(w * h * 4)
            gl.readPixels(0, 0, w, h, gl.RGBA, gl.FLOAT, pixels)
        }
        else {
            var pixels = new Uint8Array(w * h * 4)
            gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
            pixels = new Float32Array(pixels).map(function(p) {
                return p / 255
            })
        }

        return pixels
    }
    return process
}