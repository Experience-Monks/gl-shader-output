var test = require('tst')
var create = require('../')
var glslify = require('glslify');
var almost = require('array-almost-equal');
var assert = require('assert');
var Shader = require('gl-shader');
var createGl = require('webgl-context');


test('should process single point', function() {
    var vShader = glslify('./shaders/test.vert');
    var fShader = glslify('./shaders/blue.frag');

    var max = 10e2;

    test('webgl', function () {
        var draw = create(fShader);
        assert.deepEqual(draw(), [0, 0, 1, 1]);
    });

    test('nogl', function () {
        var draw = create(fShader, {
            gl: null
        });
        assert.deepEqual(draw(), [0, 0, 1, 1]);
    });
});


test('gl vs nogl performance', function() {
    var vShader = glslify('./shaders/test.vert');
    var fShader = glslify('./shaders/blue.frag');

    var max = 10e2;

    var drawGl = create(fShader);
    var drawNogl = create(fShader, {
        gl: null
    });

    test('webgl', function () {
        for (var i = 0; i < max; i++) {
            drawGl();
        }
    });
    test('nogl', function () {
        for (var i = 0; i < max; i++) {
            drawNogl();
        }
    });
});


test('should process more-than-one dimension input', function() {
    var shader = Shader(createGl(),
        glslify('./shaders/test.vert'),
        glslify('./shaders/blue.frag')
    );

    test('webgl', function () {
        var draw = create({
            shader: shader,
            width: 2,
            height: 2
        });
        assert.deepEqual(draw(), [0,0,1,1, 0,0,1,1, 0,0,1,1, 0,0,1,1])
    });

    test('nogl', function () {
        var draw = create({
            shader: shader,
            width: 2,
            height: 2,
            gl: null
        });
        assert.deepEqual(draw(), [0,0,1,1, 0,0,1,1, 0,0,1,1, 0,0,1,1])
    });
});

test('should be able to handle alpha', function() {
    var shader = Shader(createGl(),
        glslify('./shaders/test.vert'),
        glslify('./shaders/alpha.frag')
    );

    test('webgl', function () {
        var draw = create({
            shader: shader
        });
        assert.deepEqual(draw(), [0, 0, 1, 0])
    });

    test('nogl', function () {
        var draw = create({
            shader: shader,
            gl: null
        });
        assert.deepEqual(draw(), [0, 0, 1, 0])
    });
});


test.only('should accept uniforms', function() {
    var shader = Shader(createGl(),
        glslify('./shaders/test.vert'),
        glslify('./shaders/uniforms.frag')
    );

    var input = [0, 0.25, 0.5, 1.0]
    var reversed = input.slice().reverse();

    test('webgl', function () {
        var draw = create({
            shader: shader
        })

        almost(draw({ u_value: input, multiplier: 1.0 }), reversed, 0.01)
        almost(draw({ u_value: input, multiplier: 3.0 }), [ 1, 1, 0.75, 0 ], 0.01)
    });

    test('nogl', function () {
        var draw = create({
            shader: shader,
            gl: null
        })

        almost(draw({ u_value: input, multiplier: 1.0 }), reversed, 0.01)
        almost(draw({ u_value: input, multiplier: 3.0 }), [ 1, 1, 0.75, 0 ], 0.01)
    });

});
