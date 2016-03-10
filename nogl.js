/**
 * Nogl implementation
 *
 * @module gl-shader-output/nogl
 */
var GLSL = require('../glsl-js');


function create (shader, options) {
	//reset gl-shader object
	if (shader && shader.fragShader) {
		shader = shader._fref.src;
	};

	var width = options.width, height = options.height;

	var compiler = new GLSL({
		replaceUniform: shaderVar,
		replaceAttribute: shaderVar,
		replaceVarying: shaderVar
	});

	function shaderVar (name) {
		return `__data.${name}`;
	};

	var source = compiler.compile(shader);
	console.log(source)

	var process = new Function('__data', `
		${source}

		var result = [], gl_FragColor = [0, 0, 0, 0], gl_FragCoord = [0, 0, 0, 0];

		for (var j = 0; j < ${height}; j++) {
			for (var i = 0; i < ${width}; i++) {
				main();
				result.push(gl_FragColor[0]);
				result.push(gl_FragColor[1]);
				result.push(gl_FragColor[2]);
				result.push(gl_FragColor[3]);
			}
		}

		return result;
	`);

	function draw (uniforms) {
		return process(uniforms);
	}

	return draw;
};

module.exports = create;