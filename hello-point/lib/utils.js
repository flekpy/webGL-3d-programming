function getWebGLContext(canvas) {
  gl = null 
  try {
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  } catch(e) {
    console.log(e, 'error init web gl')
  }
  if (!gl) {
    gl = null
  }
  return gl
}

function initShaders(gl, vshader, fshader) {
  const program = createProgram(gl, vshader, fshader)

  gl.useProgram(program)
  gl.program = program
  return true
}

function createProgram(gl, vshader, fshader) {
  // создаем объекты шейдеров
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader)

  // создаем объект программы
  const program = gl.createProgram()

  // подключаем объекты программы
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)

  // компонуем объект программы
  gl.linkProgram(program)

  const link = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!link) {
    console.log('failed create program')
    return
  }
  return program
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!compiled) {
    console.log('failed load shader')
    return
  }

  return shader
}
