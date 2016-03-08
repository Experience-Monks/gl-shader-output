var test = require('tst')
var assert = require('assert');
var create = require('../')
var glslify = require('glslify')
var almost = require('array-almost-equal')

test('should return the color blue', function() {
    var shader = glslify({
        vertex: './shaders/test.vert',
        fragment: './shaders/blue.frag'
    })

    var draw = create({
        shader: shader
    })

    assert.deepEqual(draw(), [0, 0, 1, 1])
});

test('should process more-than-one dimension input', function() {
    var shader = glslify({
        vertex: './shaders/test.vert',
        fragment: './shaders/blue.frag'
    })

    var draw = create({
        shader: shader,
        width: 2,
        height: 2
    })

    assert.deepEqual(draw(), [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1])
});

test('should be able to handle alpha', function() {
    var shader = glslify({
        vertex: './shaders/test.vert',
        fragment: './shaders/alpha.frag'
    })

    var draw = create({
        shader: shader
    })

    assert.deepEqual(draw(), [0, 0, 1, 0])
});

test('should accept uniforms', function() {
    var shader = glslify({
        vertex: './shaders/test.vert',
        fragment: './shaders/uniforms.frag'
    })

    var draw = create({
        shader: shader
    })

    var input = [0, 0.25, 0.5, 1.0]
    var reversed = input.slice().reverse()

    almost(draw({ u_value: input, multiplier: 1.0 }), reversed, 0.01)
    almost(draw({ u_value: input, multiplier: 3.0 }), [ 1, 1, 0.75, 0 ], 0.01)
});
