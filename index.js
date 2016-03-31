var create = require('webgl-context')
var getPixels = require('canvas-pixels').get3d
var triangle = require('a-big-triangle')
var xtend = require('xtend')
var assign = require('xtend/mutable')

module.exports = function(opt) {
    opt = xtend({
        width: 1,
        height: 1,
        preserveDrawingBuffer: true
    }, opt)

    var gl = opt.shader && opt.shader.gl || opt.gl || create(opt)
    if (!opt.shader)
        throw new Error('no shader supplied to gl-shader-output')

    var shader = typeof opt.shader === 'function'
            ? opt.shader(gl)
            : opt.shader


    function process(uniforms) {
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        shader.bind()

        //if user specifies some uniforms
        if (uniforms)
            assign(shader.uniforms, uniforms)

        //full-screen quad
        triangle(gl)

        var pixels = Array.prototype.slice.call(getPixels(gl))
        return pixels.map(function(p) {
            return p / 255
        })
    }
    return process
}