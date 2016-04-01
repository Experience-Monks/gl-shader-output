var test = require('tape')

var create = require('../')
var glslify = require('glslify')
var FuzzyArray = require('test-fuzzy-array')
var Shader = require('gl-shader');
var createGl = require('webgl-context');

test('should return the color blue', function(t) {
    var draw = create(function (gl) {
        return Shader(gl,
            glslify('./shaders/test.vert'),
            glslify('./shaders/blue.frag')
        )
    }, {
        float: false
    })
    t.deepEqual(draw(), [0, 0, 1, 1])
    t.end()
})

test('should be able to handle alpha', function(t) {
    var draw = create(glslify('./shaders/alpha.frag'))

    t.deepEqual(draw(), [0, 0, 1, 0])
    t.end()
})

test('should accept uniforms', function(t) {
    var shader = Shader(createGl({width: 1, height: 1}),
        glslify('./shaders/test.vert'),
        glslify('./shaders/uniforms.frag')
    )

    var draw = create(shader)

    var input = [0, 0.25, 0.5, 1.0]
    var reversed = input.slice().reverse()

    var almost = FuzzyArray(t, 0.01)
    almost(draw({ u_value: input, multiplier: 1.0 }), reversed)
    almost(draw({ u_value: input, multiplier: 3.0 }), [ 3, 1.5, 0.75, 0 ])
    t.end()
})

test('should process n-dim input', function (t) {
    var draw = create(glslify('./shaders/blue.frag'), {
        width: 2,
        height: 2
    });
    t.deepEqual(draw(), [0,0,1,1, 0,0,1,1, 0,0,1,1, 0,0,1,1])
    t.end()
})