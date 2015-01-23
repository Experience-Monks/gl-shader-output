var test = require('tape')

var create = require('../')
var glslify = require('glslify')
var FuzzyArray = require('test-fuzzy-array')

test('should return the color blue', function(t) {
    var shader = glslify({
        vertex: './shaders/test.vert',
        fragment: './shaders/blue.frag'
    })

    var draw = create({
        shader: shader
    })

    t.deepEqual(draw(), [0, 0, 1, 1])
    t.end()
})

test('should be able to handle alpha', function(t) {
    var shader = glslify({
        vertex: './shaders/test.vert',
        fragment: './shaders/alpha.frag'
    })

    var draw = create({
        shader: shader
    })

    t.deepEqual(draw(), [0, 0, 1, 0])
    t.end()
})

test('should accept uniforms', function(t) {
    var shader = glslify({
        vertex: './shaders/test.vert',
        fragment: './shaders/uniforms.frag'
    })

    var draw = create({
        shader: shader
    })

    var input = [0, 0.25, 0.5, 1.0]
    var reversed = input.slice().reverse()
    
    var almost = FuzzyArray(t, 0.01)
    almost(draw({ u_value: input, multiplier: 1.0 }), reversed)
    almost(draw({ u_value: input, multiplier: 3.0 }), [ 1, 1, 0.75, 0 ])
    t.end()
})
